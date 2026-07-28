import { createConnection, type Socket } from "node:net";
import type { ValkeyRateLimitClient } from "./valkey-rate-limit-store.js";

/**
 * Minimal, dependency-free Valkey (RESP) client for the rate limiter (roadmap M7).
 *
 * Only what the limiter needs: a pipelined INCR + PEXPIRE per hit, parsing the two
 * integer replies. A persistent, lazily-connected socket with a FIFO reply queue;
 * commands are serialized. Any socket/parse error rejects the pending hit so the
 * ResilientRateLimiter degrades to the in-process fallback — reliability is that
 * wrapper's job, not this client's.
 */
interface Pending {
  resolve: (value: number) => void;
  reject: (error: Error) => void;
}

export class NetValkeyRateLimitClient implements ValkeyRateLimitClient {
  private socket: Socket | undefined;
  private connecting: Promise<Socket> | undefined;
  private buffer = "";
  private readonly queue: Pending[] = [];

  constructor(
    private readonly host: string,
    private readonly port: number
  ) {}

  async incrementInWindow(key: string, windowMs: number): Promise<number> {
    const socket = await this.connect();
    // Pipeline INCR then PEXPIRE; we consume both integer replies, INCR is the count.
    const command =
      encodeCommand(["INCR", key]) + encodeCommand(["PEXPIRE", key, String(windowMs)]);
    const incr = new Promise<number>((resolve, reject) => this.queue.push({ resolve, reject }));
    const expire = new Promise<number>((resolve, reject) => this.queue.push({ resolve, reject }));
    socket.write(command);
    const [count] = await Promise.all([incr, expire]);
    return count;
  }

  close(): void {
    this.socket?.destroy();
    this.socket = undefined;
  }

  private connect(): Promise<Socket> {
    if (this.socket && !this.socket.destroyed) return Promise.resolve(this.socket);
    if (this.connecting) return this.connecting;
    this.connecting = new Promise<Socket>((resolve, reject) => {
      const socket = createConnection({ host: this.host, port: this.port });
      socket.setNoDelay(true);
      socket.once("connect", () => {
        this.socket = socket;
        this.connecting = undefined;
        resolve(socket);
      });
      socket.on("data", (chunk) => this.onData(chunk.toString("utf8")));
      socket.on("error", (error) => this.failAll(error));
      socket.on("close", () => this.failAll(new Error("valkey connection closed")));
      socket.once("error", (error) => {
        this.connecting = undefined;
        reject(error);
      });
    });
    return this.connecting;
  }

  private onData(chunk: string): void {
    this.buffer += chunk;
    let newlineIndex = this.buffer.indexOf("\r\n");
    while (newlineIndex !== -1) {
      const line = this.buffer.slice(0, newlineIndex);
      this.buffer = this.buffer.slice(newlineIndex + 2);
      const pending = this.queue.shift();
      if (pending) {
        if (line.startsWith(":")) {
          pending.resolve(Number.parseInt(line.slice(1), 10));
        } else if (line.startsWith("-")) {
          pending.reject(new Error(`valkey error: ${line.slice(1)}`));
        } else {
          // The limiter only issues INCR/PEXPIRE (integer replies); anything else
          // is unexpected — reject so the caller degrades.
          pending.reject(new Error(`unexpected valkey reply: ${line}`));
        }
      }
      newlineIndex = this.buffer.indexOf("\r\n");
    }
  }

  private failAll(error: Error): void {
    this.socket = undefined;
    this.connecting = undefined;
    while (this.queue.length > 0) {
      this.queue.shift()?.reject(error);
    }
  }
}

/** RESP array-of-bulk-strings encoding for a command. */
function encodeCommand(parts: string[]): string {
  let out = `*${parts.length}\r\n`;
  for (const part of parts) {
    out += `$${Buffer.byteLength(part)}\r\n${part}\r\n`;
  }
  return out;
}

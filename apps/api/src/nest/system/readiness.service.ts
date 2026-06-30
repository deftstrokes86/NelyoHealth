import { Injectable } from "@nestjs/common";
import net from "node:net";

export interface ReadinessState {
  ready: boolean;
  checks: {
    postgresTcp: "ok" | "unavailable";
  };
  checkedAt: string;
}

@Injectable()
export class ReadinessService {
  async getReadiness(): Promise<ReadinessState> {
    const postgresTcp = await this.checkTcp(
      process.env.NELYO_LOCAL_POSTGRES_HOST ?? "127.0.0.1",
      this.parsePort(process.env.NELYO_LOCAL_POSTGRES_PORT, 55432)
    );

    return {
      ready: postgresTcp,
      checks: {
        postgresTcp: postgresTcp ? "ok" : "unavailable"
      },
      checkedAt: new Date().toISOString()
    };
  }

  private parsePort(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1024 || parsed > 65535) return fallback;
    return parsed;
  }

  private checkTcp(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = net.createConnection({ host, port });
      const done = (ok: boolean) => {
        socket.removeAllListeners();
        socket.destroy();
        resolve(ok);
      };
      socket.setTimeout(750);
      socket.once("connect", () => done(true));
      socket.once("timeout", () => done(false));
      socket.once("error", () => done(false));
    });
  }
}

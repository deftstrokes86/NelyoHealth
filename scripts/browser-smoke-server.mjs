import http from "node:http";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    host: { type: "string", default: "127.0.0.1" },
    port: { type: "string", default: "4173" }
  }
});
const host = values.host ?? "127.0.0.1";
const port = Number(values.port ?? "4173");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NelyoHealth Browser Smoke Check</title>
<style>
body{font-family:Verdana,sans-serif;margin:0;background:#fffdf8;color:#102321}main{width:min(100% - 2rem,64rem);margin:0 auto;padding:2rem;display:grid;gap:1rem}nav ul{display:flex;gap:.75rem;flex-wrap:wrap;padding:0;list-style:none}button,input{min-height:44px;font:inherit;border-radius:12px;border:1px solid #b8cab9;padding:.65rem .9rem}button{background:#0d5e57;color:#fffdf8;font-weight:700}button:focus-visible,input:focus-visible{outline:3px solid #f5c15c;outline-offset:3px}.dialog-backdrop{position:fixed;inset:0;display:none;place-items:center;background:rgba(16,35,33,.36);padding:1rem}.dialog-backdrop[open]{display:grid}.dialog-panel{background:#fffdf8;border:1px solid #b8cab9;border-radius:20px;padding:1.25rem;box-shadow:0 18px 42px rgba(16,35,33,.12)}.error{color:#7a1f17}</style>
</head>
<body>
<main>
<h1>NelyoHealth Browser Smoke Check</h1>
<nav aria-label="Smoke sections"><ul><li><a href="#status">Status</a></li><li><a href="#form">Form</a></li><li><a href="#dialog">Dialog</a></li></ul></nav>
<section id="status"><p role="status" id="live-status" aria-live="polite">Synthetic status idle.</p><button id="statusButton" type="button">Update synthetic status</button></section>
<section id="form"><label for="syntheticInput">Synthetic label</label><p id="synthetic-name-help">Enter the synthetic pass phrase.</p><input id="syntheticInput" autocomplete="off" aria-describedby="synthetic-name-help"><button id="formButton" type="button">Submit synthetic form</button><p id="synthetic-name-error" class="error" hidden>Enter &quot;ready&quot; to pass the synthetic validation check.</p></section>
<section id="dialog"><button id="openDialog" type="button">Open synthetic dialog</button></section>
<section><p id="asyncState">Synthetic same-origin idle.</p><button id="sameOrigin" type="button">Run same-origin check</button><button id="errorState" type="button">Show synthetic error state</button></section>
<div class="dialog-backdrop" id="dialogBackdrop"><div class="dialog-panel" role="dialog" aria-modal="true" aria-label="Synthetic confirmation dialog"><p>Synthetic confirmation dialog</p><button id="closeDialog" type="button">Close dialog</button></div></div>
</main>
<script>
const statusText=document.getElementById('live-status');
const statusButton=document.getElementById('statusButton');
const input=document.getElementById('syntheticInput');
const formButton=document.getElementById('formButton');
const validation=document.getElementById('synthetic-name-error');
const backdrop=document.getElementById('dialogBackdrop');
const openDialog=document.getElementById('openDialog');
const closeDialog=document.getElementById('closeDialog');
const asyncState=document.getElementById('asyncState');
statusButton.addEventListener('click',()=>{statusText.textContent='Synthetic status updated.'});
formButton.addEventListener('click',()=>{if(input.value!=='ready'){input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby','synthetic-name-help synthetic-name-error');validation.hidden=false;input.focus();return;}input.removeAttribute('aria-invalid');input.setAttribute('aria-describedby','synthetic-name-help');validation.hidden=true;});
openDialog.addEventListener('click',()=>{backdrop.setAttribute('open','');closeDialog.focus();});
closeDialog.addEventListener('click',()=>{backdrop.removeAttribute('open');openDialog.focus();});
document.getElementById('sameOrigin').addEventListener('click',async()=>{asyncState.textContent='Loading synthetic same-origin response...';const response=await fetch('/api/smoke',{cache:'no-store'});if(response.ok)asyncState.textContent='Synthetic same-origin request completed.';});
document.getElementById('errorState').addEventListener('click',()=>{asyncState.textContent='Synthetic handled error state.'});
</script>
</body></html>`;
const server = http.createServer((request, response) => {
  if (request.url === "/api/smoke") {
    response.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    });
    setTimeout(() => response.end(JSON.stringify({ ok: true, synthetic: true })), 1000);
    return;
  }
  if (request.url === "/" || request.url === "/healthz") {
    response.writeHead(200, {
      "content-type":
        request.url === "/healthz" ? "text/plain; charset=utf-8" : "text/html; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(request.url === "/healthz" ? "ok" : html);
    return;
  }
  response.writeHead(404, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end("not found");
});
server.listen(port, host, () =>
  console.log(`browser smoke server listening at http://${host}:${port}`)
);

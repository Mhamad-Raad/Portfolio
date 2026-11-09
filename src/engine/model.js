// The samurai is downloaded once for the whole site (hero and dojo both show him).
// The first caller streams it with progress; later callers get the finished bytes.
const URL_ = '/samurai.glb';
let bytes = null;                 // Promise<ArrayBuffer>
const listeners = new Set();

function download() {
  return fetch(URL_).then(async res => {
    if (!res.ok) throw new Error(URL_ + ' (' + res.status + ')');
    const total = +res.headers.get('Content-Length') || 0;
    if (!res.body) { const b = await res.arrayBuffer(); listeners.forEach(fn => fn(b.byteLength, b.byteLength)); return b; }
    const reader = res.body.getReader(), chunks = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); got += value.length;
      listeners.forEach(fn => fn(got, total));
    }
    const all = new Uint8Array(got); let o = 0;
    for (const c of chunks) { all.set(c, o); o += c.length; }
    return all.buffer;
  });
}

/** resolves to a copy of the model bytes (GLTFLoader may keep views into the buffer) */
export function samuraiBytes(onProgress) {
  if (onProgress) listeners.add(onProgress);
  if (!bytes) { bytes = download(); bytes.catch(() => { bytes = null; }); }
  return bytes.then(b => { if (onProgress) { listeners.delete(onProgress); onProgress(b.byteLength, b.byteLength); } return b.slice(0); },
                    e => { listeners.delete(onProgress); throw e; });
}
export const SAMURAI_BYTES = 4278820;

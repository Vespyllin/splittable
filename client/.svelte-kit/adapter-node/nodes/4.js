import * as server from '../entries/pages/lobby/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lobby/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/lobby/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.7kNUCvPO.js","_app/immutable/chunks/scheduler.1a9SJi-2.js","_app/immutable/chunks/index.FHDkQX8k.js","_app/immutable/chunks/Plus.TDXWsPLN.js","_app/immutable/chunks/utils.cpa_6CbF.js","_app/immutable/chunks/separator.ohQXHnVy.js","_app/immutable/chunks/index.npW6cGHV.js","_app/immutable/chunks/entry.8hIwxSB0.js"];
export const stylesheets = [];
export const fonts = [];

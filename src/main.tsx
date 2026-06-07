import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initWebVitals } from "./lib/webVitals";

// Auto-recover from stale chunk references after a redeploy.
// When Vite splits routes, an old index-*.js may try to import a hashed
// chunk that no longer exists on the server. Reload once to fetch the
// fresh bundle instead of leaving the user on a blank screen.
const RELOAD_FLAG = "__lovable_chunk_reload__";
const isChunkLoadError = (msg: unknown) => {
  const s = typeof msg === "string" ? msg : (msg as any)?.message ?? "";
  return (
    /Importing a module script failed/i.test(s) ||
    /Failed to fetch dynamically imported module/i.test(s) ||
    /ChunkLoadError/i.test(s) ||
    /Loading chunk [\d]+ failed/i.test(s)
  );
};
const tryReloadOnce = () => {
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  sessionStorage.setItem(RELOAD_FLAG, "1");
  window.location.reload();
};
window.addEventListener("error", (e) => {
  if (isChunkLoadError(e.message) || isChunkLoadError(e.error)) tryReloadOnce();
});
window.addEventListener("unhandledrejection", (e) => {
  if (isChunkLoadError(e.reason)) tryReloadOnce();
});
// Clear the guard once the app successfully mounts on the new bundle.
window.addEventListener("load", () => sessionStorage.removeItem(RELOAD_FLAG));

createRoot(document.getElementById("root")!).render(<App />);

// Kick off Core Web Vitals tracking after the app mounts
initWebVitals();

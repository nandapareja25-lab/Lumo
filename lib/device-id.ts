const KEY = "lumo_device_id";

/** Identidad anónima por dispositivo — no hay cuentas reales todavía (ver lib/app-data.ts). */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

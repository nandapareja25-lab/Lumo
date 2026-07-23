"use client";

import { useEffect, useState } from "react";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { CATEGORIES, DEFAULT_PREFERENCES, type PushPreferences } from "@/lib/push/types";

function urlBase64ToUint8Array(b64: string) {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
}

type Status = "unknown" | "granted" | "denied" | "loading";

export function PushSettings() {
  const [status, setStatus] = useState<Status>("unknown");
  const [supported, setSupported] = useState(false);
  const [preferences, setPreferences] = useState<PushPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setSupported(true);
      if (Notification.permission === "granted") setStatus("granted");
      else if (Notification.permission === "denied") setStatus("denied");
    }
  }, []);

  async function enable() {
    setStatus("loading");
    try {
      const deviceId = getOrCreateDeviceId();
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        }));
      const json = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, endpoint: json.endpoint, keys: json.keys, preferences }),
      });
      setStatus("granted");
    } catch {
      setStatus(Notification.permission === "denied" ? "denied" : "unknown");
    }
  }

  async function togglePreference(id: keyof PushPreferences) {
    const next = { ...preferences, [id]: !preferences[id] };
    setPreferences(next);
    if (status === "granted") {
      await fetch("/api/push/subscribe", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: getOrCreateDeviceId(), preferences: next }),
      });
    }
  }

  if (!supported) return null;

  return (
    <div
      className="flex flex-col gap-3 rounded-[22px] border border-[rgba(42,31,23,0.10)] bg-white p-5"
      style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
    >
      <div>
        <p className="font-heading text-base font-medium">Avisos de Lumo</p>
        <p className="text-xs text-[#6B5A4A]">
          Invitaciones tranquilas, nunca recordatorios insistentes. Pueden desactivarlas cuando quieran.
        </p>
      </div>

      {status !== "granted" ? (
        <button
          onClick={enable}
          disabled={status === "loading" || status === "denied"}
          className="self-start rounded-full px-4 py-2 text-sm font-semibold text-[#1F1712] disabled:opacity-50"
          style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
        >
          {status === "loading"
            ? "Activando…"
            : status === "denied"
              ? "Bloqueadas — habilítalas en el navegador"
              : "Activar avisos"}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex items-start justify-between gap-3 text-sm">
              <span>
                <span className="font-medium">{c.label}</span>
                <span className="block text-xs text-[#6B5A4A]">{c.description}</span>
              </span>
              <input
                type="checkbox"
                checked={preferences[c.id]}
                onChange={() => togglePreference(c.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#E8A33D]"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

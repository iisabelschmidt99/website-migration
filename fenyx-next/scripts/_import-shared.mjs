// Gemeinsame Hilfsfunktionen für CMS-Import-Skripte (nur lokal ausführen).
import { readFileSync } from "node:fs";
import path from "node:path";

export const BUCKET = "media";

export function loadEnv() {
  const txt = readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

/** RFC4180-CSV-Parser (Quotes, "", Zeilenumbrüche in Feldern). */
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\r") {
        /* ignorieren */
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function splitSemiList(value) {
  return (value || "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isPublished(get) {
  return (
    get("Draft").toLowerCase() !== "true" &&
    get("Archived").toLowerCase() !== "true"
  );
}

export function parseIntOrZero(value) {
  const n = parseInt(String(value || "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

export function parseDateOrNull(value) {
  const v = (value || "").trim();
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Bild von Webflow-CDN laden und in Storage legen; bei Fehler CDN-URL behalten. */
export async function uploadImageFromUrl(supabase, sourceUrl, destPath) {
  if (!sourceUrl) return { url: null, ok: false, fail: false };
  try {
    const res = await fetch(sourceUrl, {
      headers: { "User-Agent": "fenyx-import/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (sourceUrl.split(".").pop() || "webp").split("?")[0].slice(0, 5);
    const dest = destPath.includes(".") ? destPath : `${destPath}.${ext}`;
    const contentType =
      res.headers.get("content-type") ||
      (ext === "svg" ? "image/svg+xml" : "image/webp");
    const up = await supabase.storage
      .from(BUCKET)
      .upload(dest, buf, { contentType, upsert: true });
    if (up.error) throw up.error;
    return {
      url: supabase.storage.from(BUCKET).getPublicUrl(dest).data.publicUrl,
      ok: true,
      fail: false,
    };
  } catch (e) {
    return { url: sourceUrl, ok: false, fail: true, error: e.message };
  }
}

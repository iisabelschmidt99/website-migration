#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_SRC = path.join(ROOT, "..", "_reference", "webflow-export", "images");
const CMS_DEST = path.join(ROOT, "public", "assets", "cms");

const CDN_BASES = {
  CDN: "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d7e6",
  CMS: "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f",
  IMG: "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d7e6",
};

const SCAN_DIRS = ["data", "components", "app"];
const EXTENSIONS = new Set([".ts", ".tsx", ".json"]);

function decodeFilename(segment) {
  let decoded = segment;
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

function listSourceImages() {
  const exact = new Map();
  const byBase = new Map();
  if (!fs.existsSync(IMAGES_SRC)) return { exact, byBase };
  for (const name of fs.readdirSync(IMAGES_SRC)) {
    exact.set(name, path.join(IMAGES_SRC, name));
    const base = name.replace(/\.[^.]+$/, "");
    if (!byBase.has(base)) byBase.set(base, name);
  }
  return { exact, byBase };
}

const BASE_MANUAL_ALIASES = {
  "bueroaufloesung (thumbnail).webp": "bueroaufloesung-thumbnail.webp",
  "mitarbeiterverkauf (thumbnail).webp": "mitarbeiterverkauf-thumbnail.webp",
  "Home Digitales Bestandsmanagement.webp": "Home-Digitales-Bestandsmanagement.webp",
  "im Kreis.webp": "im-Kreis.webp",
  "spende 1.webp": "spende-1.webp",
  "Kristina.avif": "kristina_1kristina.webp",
  "Thomas (2).avif": "Thomas2.webp",
  "Anina (2).avif": "fenyx-anina_1fenyx-anina.webp",
  "Nunatak.webp": "Nunatak-Quadrat.webp",
  "NunatakGroup.avif": "Nunatak-Quadrat.webp",
  "Sofa Lobby Quadrat.avif": "Sofa-Lobby-Quadrat.webp",
};

function nfc(value) {
  return value.normalize("NFC");
}

function buildManualAliases(sourceImages) {
  const aliases = { ...BASE_MANUAL_ALIASES };
  for (const name of sourceImages.exact.keys()) {
    if (name.includes("Besichtigung") && name.includes("Angebotserstellung")) {
      aliases["Auflösung Besichtigung & Angebotserstellung.webp"] = name;
    }
  }
  return aliases;
}

function findLocalFilename(decodedSegment, sourceImages, manualAliases) {
  const normalized = nfc(decodedSegment);
  if (manualAliases[normalized] && sourceImages.exact.has(manualAliases[normalized])) {
    return manualAliases[normalized];
  }

  const candidates = [decodedSegment];
  let current = decodedSegment;
  while (/^[0-9a-f]{8,}_/i.test(current)) {
    current = current.replace(/^[0-9a-f]{8,}_/i, "");
    candidates.push(current);
  }
  if (decodedSegment.endsWith("_map.svg")) candidates.push("map.svg");

  for (const candidate of candidates) {
    if (sourceImages.exact.has(candidate)) return candidate;
    const aliasKey = nfc(candidate);
    if (manualAliases[aliasKey] && sourceImages.exact.has(manualAliases[aliasKey])) {
      return manualAliases[aliasKey];
    }
    const lower = candidate.toLowerCase();
    for (const name of sourceImages.exact.keys()) {
      if (name.toLowerCase() === lower) return name;
    }
    const base = candidate.replace(/\.[^.]+$/, "");
    const alt = sourceImages.byBase.get(base);
    if (alt) return alt;
    const otherExt = [".webp", ".avif", ".jpg", ".jpeg", ".png", ".svg"];
    const ext = path.extname(candidate);
    for (const nextExt of otherExt) {
      if (nextExt === ext) continue;
      const swapped = `${base}${nextExt}`;
      if (sourceImages.exact.has(swapped)) return swapped;
    }
  }
  return null;
}

function collectFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, acc);
    else if (EXTENSIONS.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

function extractReferences(content) {
  const refs = [];

  for (const match of content.matchAll(
    /https:\/\/cdn\.prod\.website-files\.com\/[^"'`\s)]+/g,
  )) {
    refs.push({ type: "url", value: match[0] });
  }

  for (const match of content.matchAll(
    /\$\{(CDN|CMS|IMG)\}\/([^"'`\s]+)/g,
  )) {
    refs.push({
      type: "template",
      varName: match[1],
      path: match[2],
      value: `${CDN_BASES[match[1]]}/${match[2]}`,
      raw: match[0],
    });
  }

  return refs;
}

function isAssetUrl(url) {
  const segment = url.split("/").pop() ?? "";
  return segment.includes(".");
}

function resolveLocal(url, sourceImages, manualAliases) {
  if (!isAssetUrl(url)) return { ok: false };
  const segment = decodeFilename(url.split("/").pop() ?? "");
  const localName = findLocalFilename(segment, sourceImages, manualAliases);
  if (!localName) return { ok: false, segment };

  fs.mkdirSync(CMS_DEST, { recursive: true });
  const destPath = path.join(CMS_DEST, localName);
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(sourceImages.exact.get(localName), destPath);
  }
  return { ok: true, localPath: `/assets/cms/${localName}` };
}

function stripTodoLines(content) {
  return content
    .split("\n")
    .filter((line) => !line.includes("// TODO: Bild fehlt"))
    .join("\n");
}

function replaceTemplateOccurrences(content, raw, replacement) {
  const backtickWrapped = `\`${raw}\``;
  if (content.includes(backtickWrapped)) {
    const quoted = `"${replacement}"`;
    return content.split(backtickWrapped).join(quoted);
  }
  return content.split(raw).join(replacement);
}

function replaceInContent(
  content,
  urlToLocal,
  templateToLocal,
  templateToUrl,
  missingUrls,
  filePath,
) {
  const isJson = filePath.endsWith(".json");
  let next = stripTodoLines(content);

  const sortedTemplates = [...templateToLocal.entries()].sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [raw, localPath] of sortedTemplates) {
    next = replaceTemplateOccurrences(next, raw, localPath);
  }

  const sortedMissingTemplates = [...templateToUrl.entries()].sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [raw, url] of sortedMissingTemplates) {
    next = replaceTemplateOccurrences(next, raw, url);
  }

  const sortedUrls = [...urlToLocal.entries()].sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [url, localPath] of sortedUrls) {
    next = next.split(url).join(localPath);
  }

  if (!isJson) {
    for (const url of missingUrls) {
      const searchTargets = [url];
      for (const [raw, fullUrl] of templateToUrl.entries()) {
        if (fullUrl === url) searchTargets.push(raw);
      }
      for (const target of searchTargets) {
        if (!next.includes(target)) continue;
        const idx = next.indexOf(target);
        const lineStart = next.lastIndexOf("\n", idx) + 1;
        const lineEnd = next.indexOf("\n", idx);
        const line = next.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
        if (!line.trimStart().startsWith("// TODO: Bild fehlt")) {
          const indent = line.match(/^\s*/)?.[0] ?? "";
          next =
            next.slice(0, lineStart) +
            `${indent}// TODO: Bild fehlt – ${url}\n` +
            next.slice(lineStart);
        }
        break;
      }
    }
  }

  for (const varName of ["CDN", "CMS", "IMG"]) {
    if (!next.includes(`\${${varName}}`)) {
      next = next.replace(
        new RegExp(`^const ${varName} = "[^"]+";\\n`, "m"),
        "",
      );
    }
  }

  return next;
}

const sourceImages = listSourceImages();
const manualAliases = buildManualAliases(sourceImages);
const files = SCAN_DIRS.flatMap((d) => collectFiles(path.join(ROOT, d)));

const urlToLocal = new Map();
const templateToLocal = new Map();
const templateToUrl = new Map();
const missingUrls = new Set();

for (const file of files) {
  if (file.includes("migrate-cdn-images.mjs")) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const ref of extractReferences(content)) {
    const url = ref.type === "url" ? ref.value : ref.value;
    if (!isAssetUrl(url)) continue;
    if (urlToLocal.has(url) || missingUrls.has(url)) {
      if (ref.type === "template" && missingUrls.has(url)) {
        templateToUrl.set(ref.raw, url);
      }
      continue;
    }

    const result = resolveLocal(url, sourceImages, manualAliases);
    if (result.ok) {
      urlToLocal.set(url, result.localPath);
      if (ref.type === "template") templateToLocal.set(ref.raw, result.localPath);
    } else {
      missingUrls.add(url);
      if (ref.type === "template") templateToUrl.set(ref.raw, url);
    }
  }
}

let changedFiles = 0;
for (const file of files) {
  if (file.includes("migrate-cdn-images.mjs")) continue;
  const original = fs.readFileSync(file, "utf8");
  const fileMissing = extractReferences(original)
    .map((ref) => (ref.type === "url" ? ref.value : ref.value))
    .filter((url) => isAssetUrl(url) && missingUrls.has(url));
  const fileTemplates = new Map(
    extractReferences(original)
      .filter((ref) => ref.type === "template" && templateToUrl.has(ref.raw))
      .map((ref) => [ref.raw, templateToUrl.get(ref.raw)]),
  );
  const updated = replaceInContent(
    original,
    urlToLocal,
    templateToLocal,
    fileTemplates,
    new Set(fileMissing),
    file,
  );
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    changedFiles++;
  }
}

console.log(`Copied: ${urlToLocal.size}`);
console.log(`Missing: ${missingUrls.size}`);
console.log(`Updated files: ${changedFiles}`);
if (missingUrls.size) {
  console.log("\nMissing images:");
  for (const url of [...missingUrls].sort()) console.log(`  - ${url}`);
}

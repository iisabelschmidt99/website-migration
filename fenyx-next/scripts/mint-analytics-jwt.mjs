#!/usr/bin/env node
import crypto from "node:crypto";

const secret = process.env.SUPABASE_JWT_SECRET;
if (!secret) {
  console.error("SUPABASE_JWT_SECRET fehlt.");
  process.exit(1);
}

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const now = Math.floor(Date.now() / 1000);
const header = { alg: "HS256", typ: "JWT" };
const payload = {
  role: "analytics_ingress",
  iss: "supabase",
  ref: process.env.SUPABASE_PROJECT_REF || "aadugmrnlvsmdxisaady",
  iat: now,
  exp: now + 60 * 60 * 24 * 90,
};

const encoded = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
const sig = crypto
  .createHmac("sha256", secret)
  .update(encoded)
  .digest("base64")
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

console.log(`${encoded}.${sig}`);

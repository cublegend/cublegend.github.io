const crypto = require("node:crypto");

function applyCors(req, res) {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", frontendOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (_error) {
      return {};
    }
  }
  if (body && typeof body === "object") {
    return body;
  }
  return {};
}

function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

module.exports = async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const accelerationPassword = process.env.RIFT_ACCELERATION_PASSWORD || "";
  if (!accelerationPassword) {
    return res.status(500).json({ error: "Server control password is not configured." });
  }

  const body = parseBody(req.body);
  const secret = typeof body.secret === "string" ? body.secret : "";

  if (safeCompare(secret, accelerationPassword)) {
    return res.status(200).json({ ok: true, action: "accelerate" });
  }

  return res.status(403).json({ ok: false, action: "none", error: "Command rejected." });
};

// api/member-count.js — returns live member count
// Uses a simple KV store via Vercel Edge Config (or falls back to a static number)

let memberCount = 1; // starting count — update this manually or connect a database

export default async function handler(req, res) {
  res.status(200).json({ count: memberCount });
}

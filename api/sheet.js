// Relais entre le site et ton Google Sheet (script Apps Script).
// L'URL du script et son mot de passe restent cachés sur le serveur Vercel :
//   SHEET_URL    = l'URL du déploiement Apps Script (finit par /exec)
//   SHEET_SECRET = le mot de passe écrit dans Code.gs
module.exports = async (req, res) => {
  const url = process.env.SHEET_URL, secret = process.env.SHEET_SECRET;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !secret) return res.status(500).json({ ok: false, error: "SHEET_URL / SHEET_SECRET manquants sur Vercel" });
  try {
    let r;
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ secret, ops: body.ops || [] }), redirect: "follow" });
    } else {
      r = await fetch(url + (url.includes("?") ? "&" : "?") + "secret=" + encodeURIComponent(secret), { redirect: "follow" });
    }
    const text = await r.text();
    let j;
    try { j = JSON.parse(text); } catch { return res.status(502).json({ ok: false, error: "Le script Google ne répond pas en JSON (déploiement « Tout le monde » ?)" }); }
    res.status(j.ok ? 200 : 403).json(j);
  } catch (e) {
    res.status(502).json({ ok: false, error: "Google Sheet injoignable" });
  }
};

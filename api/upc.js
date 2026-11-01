// Relais vers UPCitemdb (offre d'essai gratuite, ~100 requêtes/jour) : solution de secours si DVDFr ne connaît pas le code.
module.exports = async (req, res) => {
  const { code } = req.query || {};
  if (typeof code !== "string" || !/^\d{8,14}$/.test(code)) return res.status(400).json({ error: "code invalide" });
  try {
    const r = await fetch("https://api.upcitemdb.com/prod/trial/lookup?upc=" + code, { headers: { accept: "application/json" } });
    const body = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (r.ok) res.setHeader("Cache-Control", "public, s-maxage=604800");
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: "UPCitemdb injoignable" });
  }
};

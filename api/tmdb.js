// Relais vers l'API TMDB : la clé reste côté serveur (variable d'environnement TMDB_KEY sur Vercel).
const ALLOWED = [/^\/search\/(multi|movie|tv)$/, /^\/(movie|tv)\/\d+$/, /^\/configuration$/];

module.exports = async (req, res) => {
  const key = process.env.TMDB_KEY;
  if (!key) return res.status(500).json({ error: "TMDB_KEY manquante sur le serveur" });
  const { path, ...params } = req.query || {};
  if (typeof path !== "string" || !ALLOWED.some(rx => rx.test(path))) return res.status(400).json({ error: "chemin non autorisé" });

  const url = new URL("https://api.themoviedb.org/3" + path);
  for (const [k, v] of Object.entries(params)) if (typeof v === "string") url.searchParams.set(k, v);
  const headers = { accept: "application/json" };
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key; else url.searchParams.set("api_key", key);

  try {
    const r = await fetch(url, { headers });
    const body = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (r.ok) res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: "TMDB injoignable" });
  }
};

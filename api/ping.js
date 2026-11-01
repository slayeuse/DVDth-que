// Indique au site que les fonctions serveur sont disponibles (et si la clé TMDB est configurée).
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true, tmdb: !!process.env.TMDB_KEY });
};

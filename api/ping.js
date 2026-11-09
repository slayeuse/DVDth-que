// Indique au site quelles fonctions serveur sont configurées.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true, tmdb: !!process.env.TMDB_KEY, sheet: !!(process.env.SHEET_URL && process.env.SHEET_SECRET) });
};

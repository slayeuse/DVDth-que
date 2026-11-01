// Relais vers l'API XML de DVDFr.com (base de DVD française) : recherche par code-barres ou fiche par id.
// Le navigateur ne peut pas l'appeler directement (pas d'en-têtes CORS), d'où ce relais.
module.exports = async (req, res) => {
  const { gencode, id } = req.query || {};
  let url;
  if (typeof gencode === "string" && /^\d{8,14}$/.test(gencode)) url = "https://www.dvdfr.com/api/search.php?gencode=" + gencode;
  else if (typeof id === "string" && /^\d{1,10}$/.test(id)) url = "https://www.dvdfr.com/api/dvd.php?id=" + id;
  else return res.status(400).send("paramètre invalide");

  try {
    const r = await fetch(url, {
      headers: {
        // DVDFr refuse les requêtes sans user-agent reconnaissable
        "User-Agent": "Mozilla/5.0 (compatible; DVDtheque/2.0; collection perso)",
        Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
    });
    const body = await r.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    if (r.ok) res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate=2592000");
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).send("DVDFr injoignable");
  }
};

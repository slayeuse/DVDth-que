// ==== Configuration de ta DVDthèque ====
window.DVDT_CONFIG = {
  // Clé TMDB utilisée si le site n'a pas de serveur (test en local, hébergeur sans fonctions).
  // Une fois la variable TMDB_KEY ajoutée sur Vercel, tu peux vider cette ligne ("").
  tmdbKey: "9bf6e7ccf9c8045f34da6e37311138a9",

  // Google Sheet : à remplir SEULEMENT si tu n'utilises pas les variables Vercel SHEET_URL / SHEET_SECRET
  // (déconseillé : ici, l'URL et le mot de passe sont lisibles par n'importe qui qui ouvre le site).
  sheetUrl: "",
  sheetSecret: ""
};

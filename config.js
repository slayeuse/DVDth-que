// ==== Configuration de ta DVDthèque ====
window.DVDT_CONFIG = {
  // Clé TMDB utilisée si le site n'a pas de serveur (test en local, hébergeur sans fonctions).
  // Une fois la variable TMDB_KEY ajoutée sur Vercel, tu peux vider cette ligne ("") pour ne pas l'afficher publiquement.
  tmdbKey: "9bf6e7ccf9c8045f34da6e37311138a9",

  // Connexion Google + stockage Google Sheets : colle ici l'« ID client » OAuth (type Application Web)
  // créé dans la Google Cloud Console (étapes dans le README). Il finit par .apps.googleusercontent.com
  // Laisse vide pour rester en mode « sur cet appareil seulement ».
  googleClientId: ""
};

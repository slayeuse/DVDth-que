// ==== Configuration de ta DVDthèque ====
window.DVDT_CONFIG = {
  // Clé TMDB utilisée si le site n'a pas de serveur (test en local, hébergeur sans fonctions).
  // Une fois la variable TMDB_KEY ajoutée sur Vercel, tu peux vider cette ligne ("") pour ne pas l'afficher publiquement.

  // Sauvegarde cloud : colle ici la config de ton projet Firebase
  // (console Firebase → ⚙ Paramètres du projet → Vos applications → </> Web → firebaseConfig).
  // Laisse vide pour rester en mode « navigateur seulement ».
  firebase: {
    apiKey: "AIzaSyDvX4c1vCR8jFrMRJUVeGfuAvTNWqWU0PA",
    authDomain: "dvdtheque-cf604.firebaseapp.com",
    projectId: "dvdtheque-cf604",
    appId: "1:735853566768:web:faf241b79b4967b43746f5"
  }
};

# DVDthèque 2.0 (v3)

Site perso pour cataloguer ses DVD : on cherche le titre sur TMDB, on clique sur l'affiche, et c'est rangé.
Suivi « vu / pas vu », étagère façon années 2000, et la collection est enregistrée dans un **Google Sheet** de ton Drive après connexion avec ton compte Google.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Le site |
| `config.js` | **À compléter** : ton ID client Google (+ clé TMDB de secours, déjà remplie) |
| `api/tmdb.js`, `api/ping.js` | Fonctions Vercel : relais TMDB (la clé reste cachée sur le serveur) |
| `manifest.webmanifest`, `sw.js`, `icon*` | Installation sur l'écran d'accueil du téléphone + hors-ligne |

> Mise à jour depuis la v2 : supprime de ton dépôt `api/dvdfr.js`, `api/upc.js` et `firestore.rules` (plus utilisés). Firebase n'est plus nécessaire.

## 1. Mise en ligne (Vercel)

1. Remplace les fichiers de ton dépôt par ceux de ce dossier → Vercel redéploie tout seul.
2. Vérifie que la variable d'environnement `TMDB_KEY` existe (Vercel → projet → Settings → Environment Variables). Sinon, la clé de `config.js` sert de secours.
3. Note l'adresse de ton site (ex. `https://ma-dvdtheque.vercel.app`), elle sert à l'étape 2.

## 2. Connexion Google + Google Sheets (gratuit, ~10 min)

Le site utilise la connexion Google « officielle » et ne demande qu'une seule autorisation : **accéder aux fichiers créés par l'appli** (`drive.file`). Il ne voit donc pas le reste de ton Drive. Au premier login, il crée un tableur **« DVDthèque »** dans ton Drive. Sur un autre appareil, il retrouve ce même tableur.

Dans la **Google Cloud Console** (https://console.cloud.google.com), avec ton compte Gmail. Les intitulés peuvent varier un peu selon les mises à jour de Google.

1. **Créer un projet** : en haut, sélecteur de projet → **Nouveau projet** → nom « DVDtheque » → Créer, puis sélectionne-le.
2. **Activer les API** : menu ☰ → **API et services → Bibliothèque** → cherche **Google Sheets API** → **Activer**. Fais pareil pour **Google Drive API**.
3. **Écran de consentement** : menu ☰ → **API et services → Écran de consentement OAuth** (ou **Google Auth Platform**) → **Commencer** :
   - Nom de l'appli : « DVDthèque », adresse e-mail d'assistance : ton Gmail
   - Audience : **Externe**
   - Coordonnées : ton Gmail → accepte → **Créer**
   - Dans **Audience** (ou « Utilisateurs test ») → **Ajouter des utilisateurs** → ton Gmail (et celui des personnes de ta famille qui l'utiliseront).
4. **Créer l'ID client** : **Clients** (ou **Identifiants → Créer des identifiants → ID client OAuth**) :
   - Type : **Application Web**
   - **Origines JavaScript autorisées** → ajoute l'adresse de ton site, ex. `https://ma-dvdtheque.vercel.app` (sans `/` à la fin). Pour tester sur ton PC, ajoute aussi `http://localhost:8000`.
   - Pas besoin d'« URI de redirection » → **Créer**
5. Copie l'**ID client** (il finit par `.apps.googleusercontent.com`) dans `config.js`, ligne `googleClientId`, puis redéploie.
6. Ouvre le site → **🔑 Connexion Google** → choisis ton compte → autorise. Si Google affiche « Google n'a pas validé cette application », clique **Continuer** : c'est normal pour une appli perso en mode test.

### Bon à savoir
- **La connexion dure 1 h** (règle de Google pour les sites sans serveur). Ensuite un bandeau propose de te reconnecter en un clic. En attendant, tout reste enregistré sur l'appareil et part dans le Sheet à la reconnexion.
- **Tu peux modifier le tableur directement** dans Google Sheets (cocher « vu », corriger un titre…). Ne touche pas la colonne `id` (masquée), puis recharge le site.
- Les DVD ajoutés avant la connexion sont envoyés dans le Sheet au premier login.

## Utilisation

- **➕ Ajouter un DVD** : tape le titre (ajoute l'année si besoin : « Dune 1984 »), choisis le format, clique sur l'affiche. Enchaîne les titres sans fermer la fenêtre. Pas trouvé ? « Ajouter à la main ».
- **👁 Vu / pas vu** : bouton œil sur chaque boîtier, colonne « Vu » en vue Liste, filtres « Déjà vus / Pas encore vus ».
- **🎲 Qu'est-ce qu'on regarde ce soir ?** : tirage au sort parmi les films pas encore vus.
- **Fiche** : note en étoiles, rangement, prêté à, notes, et « Changer de film » si TMDB s'est trompé d'édition.
- **💾 Exporter** : CSV pour Excel, sauvegarde `.json` (restaurable).

---
Ce site utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.

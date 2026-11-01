# DVDthèque 2.0

Site perso pour cataloguer ses DVD : scan du code-barres à la caméra, fiches automatiques (DVDFr + TMDB), « vu / pas vu », étagère façon années 2000, sauvegarde dans le cloud (Firebase, gratuit).

## Ce qu'il y a dans le dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Le site (les 51 codes sont chargés au premier lancement) |
| `config.js` | **À compléter** : ta config Firebase (+ clé TMDB de secours) |
| `api/` | Petites fonctions serveur pour Vercel : relais DVDFr, TMDB (clé cachée) et UPCitemdb |
| `firestore.rules` | Règles de sécurité à coller dans Firebase |
| `manifest.webmanifest`, `sw.js`, `icon*` | Installation sur l'écran d'accueil du téléphone + hors-ligne |

## 1. Mettre en ligne sur Vercel (gratuit)

Il faut Vercel (ou un hébergeur qui exécute le dossier `api/`) : c'est lui qui interroge DVDFr, car le navigateur n'a pas le droit de l'appeler directement.

1. Mets le dossier dans un dépôt GitHub, puis sur https://vercel.com → **Add New → Project** → importe le dépôt (aucun réglage de build : « Other »).
   *Ou* en ligne de commande dans le dossier : `npx vercel` puis `npx vercel --prod`.
2. Vercel → ton projet → **Settings → Environment Variables** → ajoute `TMDB_KEY` = ta clé TMDB → **Redeploy**.
3. Une fois que ça marche, tu peux vider `tmdbKey` dans `config.js` (sinon la clé reste lisible dans le code du site ; ce n'est pas grave pour une clé TMDB, mais c'est plus propre).

## 2. Sauvegarde cloud avec Firebase (gratuit, ~10 min)

Pourquoi Firebase plutôt que Google Sheets ou Supabase :
- **Google Sheets** : possible, mais lent, sans vraie connexion sécurisée, et pas fait pour stocker des jaquettes.
- **Supabase** (gratuit) : un projet se met **en pause après 7 jours sans activité**, gênant pour une vidéothèque qu'on ouvre de temps en temps.
- **Firebase Firestore** (offre Spark) : pas de pause, pas de carte bancaire, 1 Go de données, 50 000 lectures et 20 000 écritures par jour. Largement assez pour des milliers de DVD. Connexion avec ton compte Google.

Étapes :
1. https://console.firebase.google.com → **Ajouter un projet** (Google Analytics inutile).
2. **Build → Authentication → Commencer → Google → Activer**.
3. Authentication → **Settings → Domaines autorisés** → ajoute ton domaine Vercel (ex. `ma-dvdtheque.vercel.app`).
4. **Build → Firestore Database → Créer une base de données** (mode production, région `eur3` ou `europe-west`).
   Onglet **Règles** → colle le contenu de `firestore.rules` → **Publier**.
5. ⚙ **Paramètres du projet → Vos applications → `</>` (Web)** → donne un nom → copie l'objet `firebaseConfig` dans `config.js` (champs `apiKey`, `authDomain`, `projectId`, `appId`). Ces valeurs ne sont pas secrètes : c'est la règle Firestore qui protège tes données.
6. Redéploie, ouvre le site → **☁ Connexion Google**. Ta collection locale est envoyée dans le cloud, puis tout se synchronise entre PC et téléphone (en direct).

Sans config Firebase, le site marche quand même : tout reste dans le navigateur (pense alors à **Exporter → Sauvegarde complète**).

## Comment les fiches sont trouvées

À chaque scan (ou avec **Actions rapides → Chercher les titres via les codes**) :

1. **Solution A : DVDFr.com**, la base française des DVD. Titre FR/VO, année, édition, éditeur, jaquette, réalisateur, acteurs, durée, synopsis, genres.
2. **Solution B : UPCitemdb** si DVDFr ne connaît pas le code. Titre seul (base surtout américaine), marqué « à vérifier ».
3. **Plan C, à la main** : bouton « Chercher le code sur Google », puis tape le titre et **Chercher sur TMDB**, et clique sur la bonne affiche.

**Compléter les fiches (TMDB)** remplit ce qui manque (synopsis, acteurs, affiche…) pour tous les DVD qui ont déjà un titre.

## Vu / pas vu

- Bouton 👁 sur chaque boîtier (vert = vu, avec un bandeau « ✔ VU ») ; en vue Liste, clique dans la colonne **Vu**.
- Filtres **Déjà vus / Pas encore vus**, compteur « Reste à voir », date de visionnage enregistrée.
- 🎲 **Qu'est-ce qu'on regarde ce soir ?** tire au sort un film pas encore vu.

## Tester en local

`npx vercel dev` dans le dossier (fonctions incluses), ou simplement `python -m http.server 8000` (sans DVDFr : UPCitemdb + TMDB avec la clé de `config.js`).

---
Données DVD : DVDFr.com. Ce site utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.

# DVDthèque 2.0 (v3)

Site perso pour cataloguer ses DVD : on cherche le titre sur TMDB, on clique sur l'affiche, et c'est rangé.
Suivi « vu / pas vu », étagère façon années 2000, et la collection est enregistrée directement dans **ton Google Sheet**, sans connexion à faire sur le site.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Le site |
| `config.js` | Clé TMDB de secours (déjà remplie) |
| `google-apps-script/Code.gs` | Script à coller dans ton Google Sheet (étape 2) |
| `api/tmdb.js`, `api/sheet.js`, `api/ping.js` | Fonctions Vercel : relais vers TMDB et vers ton Google Sheet (clés cachées sur le serveur) |
| `manifest.webmanifest`, `sw.js`, `icon*` | Installation sur l'écran d'accueil du téléphone + hors-ligne |

> Mise à jour depuis la v2 : supprime de ton dépôt `api/dvdfr.js`, `api/upc.js` et `firestore.rules` (plus utilisés). Firebase n'est plus nécessaire.

## 1. Mise en ligne (Vercel)

1. Remplace les fichiers de ton dépôt par ceux de ce dossier. Vercel redéploie tout seul. Comment faire, depuis le site GitHub (sans rien installer) :
   1. **Dézippe** `dvdtheque.zip` sur ton PC : tu obtiens un dossier `dvdtheque-site`.
   2. Ouvre ton dépôt sur https://github.com (celui relié à Vercel).
   3. **Supprime les fichiers devenus inutiles** : clique sur le dossier `api`, puis sur `dvdfr.js` → menu **⋯** en haut à droite → **Delete file** → **Commit changes**. Fais pareil pour `api/upc.js` et `firestore.rules`.
   4. Reviens à la racine du dépôt → bouton **Add file → Upload files**.
   5. Ouvre le dossier `dvdtheque-site` sur ton PC, **sélectionne tout ce qu'il y a dedans** (Ctrl+A : `index.html`, `config.js`, le dossier `api`, etc.) et **glisse-le** dans la page GitHub. Glisse bien le *contenu* du dossier, pas le dossier lui-même, sinon tout se retrouve dans un sous-dossier.
   6. En bas, clique **Commit changes**. Les fichiers du même nom sont remplacés.
   7. Va sur https://vercel.com → ton projet → onglet **Deployments** : un nouveau déploiement apparaît. Attends qu'il passe à **Ready** (environ 1 min).

   *Si ton site n'est pas relié à GitHub* (déployé avec `npx vercel`) : ouvre un terminal **dans** le dossier `dvdtheque-site` et tape `npx vercel --prod`.
2. Vérifie que la variable d'environnement `TMDB_KEY` existe (Vercel → projet → Settings → Environment Variables). Sinon, la clé de `config.js` sert de secours.

## 2. Relier ton Google Sheet (sans connexion Google sur le site, ~10 min)

Le site parle à **ton** tableur via un petit script Google (« Apps Script ») que tu colles une seule fois dedans. Le script tourne avec ton compte, donc personne n'a besoin de se connecter. L'adresse du script et son mot de passe restent cachés sur Vercel.

**A. Créer le tableur et le script**
1. Sur https://sheets.google.com → **Vide** (nouveau tableur) → renomme-le « DVDthèque ».
2. Menu **Extensions → Apps Script**. Un éditeur s'ouvre avec un fichier `Code.gs`.
3. Efface tout ce qu'il contient, puis colle le contenu du fichier `google-apps-script/Code.gs` de ce dossier.
4. Ligne `const SECRET = "change-moi-123";` : remplace `change-moi-123` par un mot de passe à toi (lettres et chiffres, sans espace). Garde-le, il resservira à l'étape C.
5. Clique sur l'icône **💾 Enregistrer**.

**B. Publier le script**
1. En haut à droite : **Déployer → Nouveau déploiement**.
2. À côté de « Sélectionner le type », clique sur la **roue dentée ⚙ → Application Web**.
3. Règle **Exécuter en tant que : Moi**, puis **Qui a accès : Tout le monde** → **Déployer**.
4. Google demande d'**autoriser l'accès** : choisis ton compte. S'il affiche « Google n'a pas validé cette application », clique **Paramètres avancés → Accéder à … (non sécurisé)** → **Autoriser**. C'est normal : c'est ton propre script.
5. Copie l'**URL de l'application Web** (elle finit par `/exec`).

**C. Donner l'adresse et le mot de passe à Vercel**
1. Vercel → ton projet → **Settings → Environment Variables** → ajoute :
   - `SHEET_URL` = l'URL copiée (…/exec)
   - `SHEET_SECRET` = ton mot de passe de l'étape A.4
2. Onglet **Deployments** → sur le dernier déploiement, **⋯ → Redeploy** (pour que les variables soient prises en compte).
3. Ouvre le site : en haut à droite, tu dois voir **📊 Google Sheet ✔**. Dès la première ouverture, un onglet « DVD » se crée dans ton tableur.

### Bon à savoir
- **Tu peux modifier le tableur directement** (cocher « vu », corriger un titre…). Ne touche pas la colonne `id` (masquée). Recharge le site ensuite.
- **Hors connexion**, tout reste enregistré sur l'appareil et part dans le Sheet dès que le réseau revient (ou avec le bouton « Réessayer »).
- **Si tu modifies `Code.gs` plus tard** : Déployer → Gérer les déploiements → ✏ Modifier → Version : **Nouvelle version** → Déployer. L'URL reste la même.
- **Sécurité :** sans connexion, toute personne qui a l'adresse de ton site peut ajouter ou modifier des DVD. Ne la diffuse pas largement. Le mot de passe du script, lui, n'est jamais visible : il reste sur Vercel.

## Utilisation

- **➕ Ajouter un DVD** : tape le titre (ajoute l'année si besoin : « Dune 1984 »), choisis le format, clique sur l'affiche. Enchaîne les titres sans fermer la fenêtre. Pas trouvé ? « Ajouter à la main ».
- **👁 Vu / pas vu** : bouton œil sur chaque boîtier, colonne « Vu » en vue Liste, filtres « Déjà vus / Pas encore vus ».
- **🎲 Qu'est-ce qu'on regarde ce soir ?** : tirage au sort parmi les films pas encore vus.
- **Fiche** : note en étoiles, rangement, prêté à, notes, et « Changer de film » si TMDB s'est trompé d'édition.
- **💾 Exporter** : CSV pour Excel, sauvegarde `.json` (restaurable).

---
Ce site utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.

/**
 * DVDthèque — script à coller dans ton Google Sheet (Extensions → Apps Script).
 * Il transforme le tableur en petite « base de données » que le site peut lire et modifier,
 * sans que personne n'ait à se connecter à Google.
 *
 * 1) Remplace le mot de passe ci-dessous par un mot de passe à toi (lettres et chiffres, sans espace).
 * 2) Déployer → Nouveau déploiement → type « Application Web » →
 *    Exécuter en tant que : Moi · Qui a accès : Tout le monde → Déployer → copie l'URL (…/exec).
 * 3) Mets cette URL et ce mot de passe dans Vercel (SHEET_URL et SHEET_SECRET), voir README.
 */
const SECRET = "change-moi-123";

const TAB = "DVD";
const COLS = ["id","titre","titre_original","annee","realisateur","acteurs","genres","duree_min","format","edition",
  "vu","vu_le","note","prete_a","rangement","notes","synopsis","affiche","tmdb_id","code_barres","ajoute_le","modifie_le"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.insertSheet(TAB);
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS])
      .setFontWeight("bold").setBackground("#1f4573").setFontColor("#ffffff");
    sh.setFrozenRows(1);
    sh.hideColumns(1);                       // colonne id : ne pas toucher
    sh.setColumnWidth(2, 260);
    sh.setColumnWidth(17, 320);
    sh.getRange("K2:K").setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build()); // « vu » = case à cocher
    sh.getRange("L2:L").setNumberFormat("@");  // dates gardées en texte
    sh.getRange("U2:V").setNumberFormat("@");
  }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function findRow_(sh, id) {
  const n = sh.getLastRow();
  if (n < 2) return 0;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

// Lecture de toute la collection
function doGet(e) {
  if ((e.parameter.secret || "") !== SECRET) return out_({ ok: false, error: "mot de passe incorrect" });
  const sh = sheet_();
  const n = sh.getLastRow();
  const rows = n > 1 ? sh.getRange(2, 1, n - 1, COLS.length).getValues() : [];
  return out_({
    ok: true,
    url: SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    cols: COLS,
    rows: rows.filter(r => r[0] !== "").map(r => r.map(v => v instanceof Date ? v.toISOString() : v)),
  });
}

// Écritures : { secret, ops: [ {action:"put", id, row:[...]}, {action:"delete", id} ] }
function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents || "{}"); } catch (err) { return out_({ ok: false, error: "requête illisible" }); }
  if (body.secret !== SECRET) return out_({ ok: false, error: "mot de passe incorrect" });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    (body.ops || []).forEach(op => {
      const row = findRow_(sh, op.id);
      if (op.action === "delete") { if (row) sh.deleteRow(row); return; }
      const values = [op.row.slice(0, COLS.length)];
      if (row) sh.getRange(row, 1, 1, COLS.length).setValues(values);
      else sh.getRange(sh.getLastRow() + 1, 1, 1, COLS.length).setValues(values);
    });
    return out_({ ok: true, n: (body.ops || []).length });
  } finally {
    lock.releaseLock();
  }
}

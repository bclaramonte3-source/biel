// ============================================================
//  FUNCIONS DEL REGISTRE DIARI (compartides per registre.html i visita.html)
//  Les dades es guarden només al navegador de la persona (localStorage).
// ============================================================

var CLAU_REGISTRE = "distonia_registre_v1";

// Escales de 1 a 5 que es pregunten cada dia. Per canviar-ne el text, edita aquí.
var ESCALES = [
  { id: "anim", t: "Com ha estat el teu ànim avui?", curt: "Ànim",
    labels: ["Molt baix", "Baix", "Regular", "Bé", "Molt bé"] },
  { id: "simptomes", t: "Com han estat els símptomes físics (espasmes, postures)?", curt: "Símptomes físics",
    labels: ["Gairebé res", "Lleus", "Moderats", "Intensos", "Molt intensos"] },
  { id: "dolor", t: "Quin dolor has tingut?", curt: "Dolor",
    labels: ["Cap", "Poc", "Moderat", "Fort", "Molt fort"] },
  { id: "cansament", t: "Quin cansament has notat?", curt: "Cansament",
    labels: ["Gens", "Poc", "Moderat", "Molt", "Esgotament"] },
  { id: "estres", t: "Quin nivell d'estrès has tingut?", curt: "Estrès",
    labels: ["Gens", "Poc", "Moderat", "Molt", "Moltíssim"] },
  { id: "son", t: "Com has dormit la nit passada?", curt: "Son",
    labels: ["Molt malament", "Malament", "Regular", "Bé", "Molt bé"] }
];

var ZONES = ["Coll", "Ulls o parpelles", "Cara, boca o mandíbula", "Veu o parla", "Mans o braços", "Tronc o esquena", "Cames o peus"];

function dosXifres(n) { return (n < 10 ? "0" : "") + n; }

function dataAISO(d) {
  return d.getFullYear() + "-" + dosXifres(d.getMonth() + 1) + "-" + dosXifres(d.getDate());
}

function avuiISO() { return dataAISO(new Date()); }

// Suma (o resta, amb negatiu) dies a una data "AAAA-MM-DD"
function isoMesDies(iso, dies) {
  var d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + dies);
  return dataAISO(d);
}

// "2026-10-18" -> "18/10/2026"
function formatData(iso) {
  return iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4);
}

function llegeixRegistre() {
  try {
    var r = JSON.parse(localStorage.getItem(CLAU_REGISTRE));
    return Array.isArray(r) ? r : [];
  } catch (e) { return []; }
}

function escriuRegistre(llista) {
  try { localStorage.setItem(CLAU_REGISTRE, JSON.stringify(llista)); return true; } catch (e) { return false; }
}

// Mitjana de només els valors numèrics; null si no n'hi ha cap
function mitjana(valors) {
  var v = valors.filter(function (x) { return typeof x === "number" && !isNaN(x); });
  if (!v.length) return null;
  return v.reduce(function (a, b) { return a + b; }, 0) / v.length;
}

// Resum dels últims `dies` dies (comptant avui) a partir d'una llista d'entrades
function resumPeriode(entrades, dies, avui) {
  var des = isoMesDies(avui, -(dies - 1));
  var e = entrades
    .filter(function (x) { return x.data >= des && x.data <= avui; })
    .sort(function (a, b) { return a.data < b.data ? -1 : 1; });

  var mitjanes = {};
  ESCALES.forEach(function (s) {
    mitjanes[s.id] = mitjana(e.map(function (x) { return x[s.id]; }));
  });

  var recompte = {};
  e.forEach(function (x) {
    (x.zones || []).forEach(function (z) { recompte[z] = (recompte[z] || 0) + 1; });
  });
  var zones = Object.keys(recompte)
    .map(function (z) { return [z, recompte[z]]; })
    .sort(function (a, b) { return b[1] - a[1]; });

  return {
    des: des,
    n: e.length,
    entrades: e,
    mitjanes: mitjanes,
    diesSimptomesAlts: e.filter(function (x) { return x.simptomes >= 4; }).length,
    diesAnimBaix: e.filter(function (x) { return x.anim !== null && x.anim <= 2; }).length,
    diesEvitat: e.filter(function (x) { return x.evitat; }).length,
    diesTrucs: e.filter(function (x) { return x.trucs; }).length,
    zones: zones,
    notes: e.filter(function (x) { return x.nota; }).map(function (x) { return { data: x.data, nota: x.nota }; })
  };
}

function csvEscapa(v) {
  var s = v === null || v === undefined ? "" : String(v);
  return '"' + s.replace(/"/g, '""') + '"';
}

function registreACSV(entrades) {
  var cap = ["data"].concat(ESCALES.map(function (s) { return s.id; }))
    .concat(["zones", "trucs_sensitius", "evitat_situacio", "tractament", "nota"]);
  var files = entrades.slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; }).map(function (x) {
    var fila = [x.data].concat(ESCALES.map(function (s) { return x[s.id]; }));
    fila.push((x.zones || []).join(";"), x.trucs ? "si" : "no", x.evitat ? "si" : "no", x.tractament || "", x.nota || "");
    return fila.map(csvEscapa).join(",");
  });
  return [cap.map(csvEscapa).join(",")].concat(files).join("\n");
}

function baixaFitxer(nom, text, tipus) {
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: tipus || "text/plain;charset=utf-8" }));
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

// Per poder comprovar les funcions des d'un terminal (Node); al navegador no fa res
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ESCALES: ESCALES, ZONES: ZONES, avuiISO: avuiISO, isoMesDies: isoMesDies, formatData: formatData,
    mitjana: mitjana, resumPeriode: resumPeriode, registreACSV: registreACSV, csvEscapa: csvEscapa };
}

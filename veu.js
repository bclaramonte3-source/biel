// ============================================================
//  VEU: llegir en veu alta i respondre parlant
//
//  - Llegir en veu alta (speechSynthesis): ho fa el propi dispositiu.
//  - Entendre la veu (SpeechRecognition): ho fa el servei de veu del
//    navegador (normalment Google o Microsoft). Aquesta web no rep ni
//    guarda l'àudio. Funciona sobretot a Chrome i Edge.
//  - La veu sempre és opcional: tot es pot fer també amb els botons.
// ============================================================

// ---------- Part pura (es pot provar des d'un terminal amb Node) ----------

function normalitzaVeu(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

var NUMEROS_VEU = {
  "1": 1, "un": 1, "u": 1, "una": 1, "primer": 1, "primera": 1,
  "2": 2, "dos": 2, "dues": 2, "segon": 2, "segona": 2,
  "3": 3, "tres": 3, "tercer": 3, "tercera": 3,
  "4": 4, "quatre": 4, "quart": 4, "quarta": 4,
  "5": 5, "cinc": 5, "cinque": 5, "cinquena": 5,
  "6": 6, "sis": 6, "sise": 6, "sisena": 6
};
var PARAULES_NUMERO = ["opcio", "numero", "la", "el", "l", "vull", "trio", "escullo", "de", "d", "aquesta", "aquest"];
var PARAULES_BUIDES = ["de", "la", "el", "els", "les", "l", "a", "o", "i", "en", "per", "que", "em", "m", "ho", "he", "un", "una", "del", "al", "amb", "es", "s", "se", "li", "me", "ha", "hi", "d"];
var PARAULES_SI = ["si", "confirmo", "confirma", "acord", "correcte", "endavant", "vale", "ok", "exacte"];
var PARAULES_NO = ["no", "cancel", "cancella", "cancela", "corregeix", "canvia", "incorrecte", "altra", "altre"];

// "la dos", "opció tres", "4"... -> 2, 3, 4 (només si és l'únic que s'ha dit)
function numeroDit(txt) {
  var t = normalitzaVeu(txt).split(" ").filter(function (w) { return w && PARAULES_NUMERO.indexOf(w) === -1; });
  if (t.length === 1 && NUMEROS_VEU[t[0]]) return NUMEROS_VEU[t[0]];
  return null;
}

// Ordres: "repeteix", "enrere", "passa"
function ordreDita(txt) {
  var n = " " + normalitzaVeu(txt) + " ";
  if (/ (repeteix|repeteixi|repetir|repeteixes) /.test(n) || n.indexOf(" torna a llegir ") > -1 || n.indexOf(" un altre cop ") > -1) return "repeteix";
  if (/ (enrere|endarrere|anterior|retrocedeix) /.test(n) || n.trim() === "torna") return "enrere";
  if (/ (passa|salta|saltar|omet|ometre) /.test(n)) return "salta";
  return null;
}

function fitxaTokens(s) {
  var out = [];
  normalitzaVeu(s).split(" ").forEach(function (w) {
    if (w.length >= 2 && PARAULES_BUIDES.indexOf(w) === -1 && out.indexOf(w) === -1) out.push(w);
  });
  return out;
}

// Troba quina opció s'ha dit. `alternatives` són les transcripcions que dona el
// navegador (de més a menys probable). Retorna:
//   {index: n}            -> opció triada (0 = primera)
//   {accio: "enrere"...}  -> una ordre
//   {ambigu: true}        -> encaixa amb més d'una opció
//   null                  -> no s'ha entès
function trobaOpcio(alternatives, opcions) {
  var ambigu = null;
  for (var a = 0; a < Math.min(alternatives.length, 3); a++) {
    var dit = alternatives[a];
    var ordre = ordreDita(dit);
    if (ordre) return { accio: ordre };
    var num = numeroDit(dit);
    if (num && num <= opcions.length) return { index: num - 1 };

    var tok = fitxaTokens(dit);
    if (!tok.length) continue;
    var punts = opcions.map(function (o, i) {
      var ot = fitxaTokens(o);
      var comu = tok.filter(function (w) { return ot.indexOf(w) > -1; }).length;
      return { p: comu ? 0.7 * (comu / tok.length) + 0.3 * (comu / ot.length) : 0, i: i };
    }).sort(function (x, y) { return y.p - x.p; });
    var millor = punts[0], segon = punts[1] || { p: 0 };
    if (millor.p >= 0.6 && millor.p - segon.p >= 0.15) return { index: millor.i };
    if (!ambigu && millor.p >= 0.6) ambigu = { ambigu: true };
  }
  return ambigu;
}

// true = sí, false = no, null = no s'ha entès
function esSiNo(alternatives) {
  for (var a = 0; a < alternatives.length; a++) {
    var t = normalitzaVeu(alternatives[a]).split(" ");
    var si = t.some(function (w) { return PARAULES_SI.indexOf(w) > -1; });
    var no = t.some(function (w) { return PARAULES_NO.indexOf(w) > -1; });
    if (si && !no) return true;
    if (no && !si) return false;
  }
  return null;
}

// ---------- Part del navegador ----------

var Veu = (function () {
  if (typeof window === "undefined") return null;

  var synth = window.speechSynthesis || null;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var CLAU_CONSENTIMENT = "distonia_veu_consentiment";
  var fil = 0;       // s'incrementa per cancel·lar lectures en curs
  var rec = null;    // reconeixement en curs

  function triaVeuCatalana() {
    if (!synth || !synth.getVoices) return null;
    var vs = synth.getVoices() || [];
    for (var i = 0; i < vs.length; i++) {
      if (vs[i].lang && vs[i].lang.toLowerCase().indexOf("ca") === 0) return vs[i];
    }
    return null;
  }

  // Llegeix un text i resol quan acaba (o quan es cancel·la)
  function parla(text) {
    return new Promise(function (resol) {
      if (!synth || !text) { resol(); return; }
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "ca-ES";
      var v = triaVeuCatalana();
      if (v) u.voice = v;
      u.rate = 0.95;
      var fet = false;
      function fi() { if (!fet) { fet = true; resol(); } }
      u.onend = fi;
      u.onerror = fi;
      setTimeout(fi, 4000 + text.length * 110);   // per si el navegador no avisa mai
      try { synth.speak(u); } catch (e) { fi(); }
    });
  }

  function paraEscolta() {
    if (rec) { try { rec.abort(); } catch (e) { /* res */ } rec = null; }
  }

  // Atura la lectura i el micròfon
  function atura() {
    fil++;
    if (synth) { try { synth.cancel(); } catch (e) { /* res */ } }
    paraEscolta();
  }

  // Llegeix una llista de textos un darrere l'altre
  function llegeixLlista(textos) {
    var id = ++fil;
    if (synth) { try { synth.cancel(); } catch (e) { /* res */ } }
    return new Promise(function (resol) {
      setTimeout(function () {
        (function seguent(i) {
          if (id !== fil || i >= textos.length) { resol(); return; }
          parla(textos[i]).then(function () { seguent(i + 1); });
        })(0);
      }, 60);
    });
  }

  // Escolta una frase. Resol amb la llista de transcripcions; rebutja amb {error}
  function escolta() {
    return new Promise(function (resol, rebutja) {
      if (!SR) { rebutja({ error: "no-suportat" }); return; }
      paraEscolta();
      var r = new SR();
      var fet = false;
      r.lang = "ca-ES";
      r.interimResults = false;
      r.maxAlternatives = 5;
      r.continuous = false;
      r.onresult = function (e) {
        if (fet) return;
        fet = true;
        var alts = [], res0 = e.results[0];
        for (var i = 0; i < res0.length; i++) alts.push(res0[i].transcript);
        resol(alts);
      };
      r.onerror = function (e) {
        if (!fet) { fet = true; rebutja({ error: (e && e.error) || "error" }); }
      };
      r.onend = function () {
        if (!fet) { fet = true; rebutja({ error: "no-speech" }); }
        if (rec === r) rec = null;
      };
      rec = r;
      try { r.start(); } catch (e) { fet = true; rebutja({ error: "error" }); }
    });
  }

  // Avís de privacitat abans del primer ús del micròfon
  function consentiment() {
    try { if (localStorage.getItem(CLAU_CONSENTIMENT) === "1") return true; } catch (e) { /* res */ }
    var ok = confirm(
      "Per entendre la teva veu, el navegador envia l'àudio al seu servei de reconeixement de veu " +
      "(normalment de Google o de Microsoft). Aquesta web no rep ni guarda l'àudio.\n\nVols continuar?");
    if (ok) { try { localStorage.setItem(CLAU_CONSENTIMENT, "1"); } catch (e) { /* res */ } }
    return ok;
  }

  function missatgeError(err) {
    switch (err && err.error) {
      case "not-allowed":
      case "service-not-allowed":
        return "El navegador no té permís per fer servir el micròfon. Pots permetre'l a la icona del candau, al costat de l'adreça.";
      case "no-speech": return "No he sentit res.";
      case "audio-capture": return "No es detecta cap micròfon.";
      case "network": return "No hi ha connexió amb el servei de veu del navegador.";
      case "language-not-supported": return "El navegador no reconeix el català per veu.";
      case "no-suportat": return "Aquest navegador no pot entendre la veu. Prova Chrome o Edge.";
      case "aborted": return "";
      default: return "No s'ha pogut escoltar.";
    }
  }

  // Errors després dels quals no té sentit tornar a provar
  function errorFatal(err) {
    var e = err && err.error;
    return e === "not-allowed" || e === "service-not-allowed" || e === "audio-capture" ||
      e === "no-suportat" || e === "language-not-supported" || e === "network" || e === "aborted";
  }

  // Textos visibles d'una zona de la pàgina, per llegir-los
  function textosLlegibles(arrel) {
    var out = [];
    arrel.querySelectorAll("h1,h2,h3,summary,p,li,th,td,.avis").forEach(function (el) {
      if (el.closest(".barra-veu")) return;
      if (el.getClientRects().length === 0) return;                       // amagat o dins un desplegable tancat
      if (el.querySelector("p,li,h1,h2,h3,td,th")) return;                // contenidor: es llegeixen els fills
      var t = el.textContent.replace(/[↗←→·]/g, " ").replace(/\s+/g, " ").trim();
      if (t) out.push(t);
    });
    return out;
  }

  // Barra «Llegir la pàgina» a les pàgines amb <body data-llegir>
  function iniciaBarra() {
    if (!document.body.hasAttribute("data-llegir")) return;
    var main = document.getElementById("contingut");
    if (!main) return;
    var d = document.createElement("div");
    d.className = "barra-veu no-print";
    if (!synth) {
      var p = document.createElement("p");
      p.className = "muted";
      p.textContent = "Aquest navegador no pot llegir la pàgina en veu alta.";
      d.appendChild(p);
    } else {
      var b1 = document.createElement("button");
      b1.type = "button"; b1.className = "btn-sec"; b1.textContent = "Llegir la pàgina en veu alta";
      b1.addEventListener("click", function () { llegeixLlista(textosLlegibles(main)); });
      var b2 = document.createElement("button");
      b2.type = "button"; b2.className = "btn-sec"; b2.textContent = "Aturar la lectura";
      b2.addEventListener("click", atura);
      d.appendChild(b1); d.appendChild(b2);
    }
    main.insertBefore(d, main.firstChild);
  }

  iniciaBarra();

  return {
    suportaLlegir: !!synth,
    suportaParlar: !!SR,
    parla: parla,
    atura: atura,
    paraEscolta: paraEscolta,
    llegeixLlista: llegeixLlista,
    escolta: escolta,
    consentiment: consentiment,
    missatgeError: missatgeError,
    errorFatal: errorFatal,
    trobaOpcio: trobaOpcio,
    esSiNo: esSiNo
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { normalitzaVeu: normalitzaVeu, numeroDit: numeroDit, ordreDita: ordreDita, trobaOpcio: trobaOpcio, esSiNo: esSiNo };
}

// ============================================================
//  DADES DE L'ARBRE DE PREGUNTES
//  Aquí pots editar preguntes, opcions i finals sense tocar index.html.
//  Format d'un node:  CODI: { t: "Pregunta", o: [["Text de l'opció", "CODI_SEGÜENT"], ...] }
//  Si el CODI_SEGÜENT comença per F (F1, F2...), és un final i es busca a FINALS.
// ============================================================

const INICI = "A1";

const NODES = {
  // ---------- Bloc A: entrada ----------
  A1: { t: "Com estàs avui?", o: [
    ["Bé", "A2"],
    ["Bé, però amb un neguit", "A3"],
    ["Regular (sense ganes de fer coses)", "A6"],
    ["Malament", "A9"],
    ["No sé com em sento", "A5"]
  ]},
  A2: { t: "Com han estat els símptomes físics avui?", o: [
    ["Gairebé no els he notat", "A4"],
    ["Els de sempre", "A4"],
    ["Més intensos del normal", "B2"]
  ]},
  A3: { t: "D'on ve el neguit?", o: [
    ["Del cos (dolor, espasmes, cansament)", "B2"],
    ["De pensar què passarà en el futur", "C3"],
    ["D'estar amb altres persones", "D1"],
    ["De la feina o els estudis", "E4"]
  ]},
  A4: { t: "Has pogut fer avui alguna cosa que t'agrada?", o: [
    ["Sí", "F1"],
    ["No, no he tingut ganes", "A6"],
    ["No, ho he evitat per la distonia", "E1"]
  ]},
  A5: { t: "Què notes més ara mateix?", o: [
    ["Tensió o molèsties al cos", "B2"],
    ["Buit o cansament emocional", "A7"],
    ["Preocupació o neguit", "C3"],
    ["Res en concret", "A7"]
  ]},
  A6: { t: "Què et treu més les ganes de fer coses?", o: [
    ["El cansament o el dolor", "B2"],
    ["La frustració de no poder fer el que feia", "C2"],
    ["Pensar com em miren els altres", "D1"],
    ["La tristesa", "C4"],
    ["No ho sé", "A7"]
  ]},
  A7: { t: "Quant fa que et sents així?", o: [
    ["Només avui", "A8"],
    ["Fa alguns dies", "A8"],
    ["Fa setmanes o més", "C4"]
  ]},
  A8: { t: "Has dormit bé aquests dies?", o: [
    ["Sí", "F2"],
    ["No, pel dolor o els espasmes", "B2"],
    ["No, pels pensaments i les preocupacions", "C3"]
  ]},
  A9: { t: "Què et fa sentir pitjor?", o: [
    ["El cos", "B1"],
    ["Les emocions", "C1"],
    ["Les dues coses", "B1"],
    ["No ho sé", "C1"]
  ]},

  // ---------- Bloc B: el cos ----------
  B1: { t: "Tens ara dificultat per respirar o empassar, una caiguda recent, no pots obrir els ulls o un dolor insuportable?", o: [
    ["Sí", "F4"],
    ["No", "B2"]
  ]},
  B2: { t: "Quin nivell de dolor tens avui?", o: [
    ["Gens o molt poc", "B3"],
    ["Moderat (em molesta, però puc fer coses)", "B3"],
    ["Fort (condiciona el meu dia)", "B4"]
  ]},
  B3: { t: "Quina zona et molesta més avui?", o: [
    ["Coll o cap", "B4"],
    ["Ulls, cara o veu", "B4"],
    ["Mans o braços", "B4"],
    ["Tronc o cames", "B4"],
    ["Moltes zones a la vegada", "B4"]
  ]},
  B4: { t: "Què t'ha costat més avui per culpa del cos?", o: [
    ["Res en especial", "B5"],
    ["Tasques quotidianes (menjar, vestir-me, escriure, caminar)", "E2"],
    ["Sortir de casa o fer plans", "E1"],
    ["Conduir, llegir o mirar pantalles", "B5"]
  ]},
  B5: { t: "Com va el teu tractament (toxina botulínica, medicació, fisioteràpia)?", o: [
    ["Va bé, noto millora", "B6"],
    ["L'efecte s'està acabant o sembla que ja no funciona", "F3"],
    ["No segueixo cap tractament o no sé quin em convé", "I1"],
    ["Estic pendent d'una visita", "B6"]
  ]},
  B6: { t: "Deixant el cos de banda, com et sents per dins avui?", o: [
    ["Tranquil/a", "F2"],
    ["Una mica baix/baixa o neguitós/a", "C1"],
    ["Gens bé", "C1"]
  ]},

  // ---------- Bloc C: emocions ----------
  C1: { t: "Quina emoció pesa més ara mateix?", o: [
    ["Frustració o ràbia", "C2"],
    ["Ansietat o por", "C3"],
    ["Tristesa o buit", "C4"],
    ["Vergonya o inseguretat", "D1"],
    ["Soledat", "D4"]
  ]},
  C2: { t: "Què et frustra més?", o: [
    ["No poder fer el que feia abans", "E1"],
    ["Que el cos no em faci cas encara que ho vulgui", "C5"],
    ["Haver de dependre d'altres", "E2"],
    ["Que ningú entengui què em passa", "D1"]
  ]},
  C3: { t: "Què et preocupa més?", o: [
    ["Quan vindran els espasmes i si es notaran", "D1"],
    ["Que la distonia empitjori o s'estengui", "I1"],
    ["La incertesa de les visites i els tractaments", "I1"],
    ["No saber què és normal i què no", "I1"]
  ]},
  C4: { t: "Fa quant que et sents trist/a o amb poques ganes?", o: [
    ["Només aquests dies", "C5"],
    ["Fa setmanes", "S1"],
    ["Gairebé sempre", "S1"]
  ]},
  C5: { t: "Com portes els canvis respecte a la vida d'abans?", o: [
    ["L'estic acceptant poc a poc", "F9"],
    ["Enyoro la vida d'abans i em fa molt mal", "S1"],
    ["M'enfado amb mi o amb el meu cos", "F5"],
    ["Intento no pensar-hi", "F8"]
  ]},

  // ---------- Bloc S: seguretat ----------
  S1: { t: "Has tingut pensaments de no voler continuar, de fer-te mal o de sentir que ets una càrrega?", o: [
    ["No", "S2"],
    ["Alguna vegada, de passada", "F6"],
    ["Sí, sovint o ara mateix", "F6"],
    ["Prefereixo no contestar", "F6"]
  ]},
  S2: { t: "Has deixat de gaudir de coses que abans t'agradaven, o ha canviat la teva gana o la teva son?", o: [
    ["Sí", "F5"],
    ["No", "F2"]
  ]},

  // ---------- Bloc D: relacions ----------
  D1: { t: "T'has sentit observat/da o jutjat/da?", o: [
    ["Sí, sovint al carrer o en llocs públics", "D2"],
    ["Sí, a la feina o als estudis", "E4"],
    ["Sí, amb gent propera", "D4"],
    ["No ho noto, però ho temo", "C5"]
  ]},
  D2: { t: "Què fas quan algú et mira?", o: [
    ["Ho ignoro i continuo", "F9"],
    ["M'incomoda, però ho aguanto", "C5"],
    ["Evito sortir o amago els símptomes (mans a la butxaca, cap cot...)", "D3"],
    ["Explico què tinc", "F9"]
  ]},
  D3: { t: "Amb quina freqüència evites situacions per això?", o: [
    ["Rarament", "C5"],
    ["Sovint", "D4"],
    ["Gairebé sempre", "D4"]
  ]},
  D4: { t: "Qui et fa costat quan et trobes malament?", o: [
    ["Família o parella", "D5"],
    ["Amics", "D5"],
    ["Quasi ningú", "F10"],
    ["Tinc gent, però no els demano ajuda", "D6"]
  ]},
  D5: { t: "Com ha afectat la distonia les teves relacions properes?", o: [
    ["Les ha fet més fortes", "F9"],
    ["Em comprenen, però no vull ser una càrrega", "D6"],
    ["Hi ha malentesos o em costa explicar-ho", "F11"],
    ["M'he distanciat", "F10"]
  ]},
  D6: { t: "Com et sents quan has de demanar ajuda?", o: [
    ["Normal, no em costa", "F9"],
    ["Com una càrrega", "S1"],
    ["Em costa i acabo no demanant-la", "E2"],
    ["M'avergonyeix", "F11"]
  ]},

  // ---------- Bloc E: vida quotidiana ----------
  E1: { t: "Quines activitats has deixat de fer per la distonia?", o: [
    ["Aficions o esport", "C5"],
    ["Plans amb amics o família", "D4"],
    ["Feina o estudis", "E4"],
    ["Sortir al carrer", "D1"]
  ]},
  E2: { t: "En quin tipus de tasques necessites ajuda?", o: [
    ["Higiene i vestir-me", "E3"],
    ["Menjar o cuinar", "E3"],
    ["Desplaçar-me o sortir de casa", "E3"],
    ["Escriure o utilitzar el mòbil o l'ordinador", "E3"]
  ]},
  E3: { t: "Com et fa sentir dependre d'altres persones?", o: [
    ["Ho porto bé", "F12"],
    ["Em frustra", "F11"],
    ["Em fa sentir una càrrega", "S1"],
    ["Voldria més autonomia", "F12"]
  ]},
  E4: { t: "Com t'afecta la distonia a la feina o als estudis?", o: [
    ["Rendeixo bé", "F9"],
    ["Em costa fer algunes tasques", "F13"],
    ["Em preocupa què pensin els altres o no ho he explicat", "F13"],
    ["He hagut de reduir o deixar la feina o els estudis", "C5"]
  ]},

  // ---------- Bloc I: informació ----------
  I1: { t: "Quina informació et falta més?", o: [
    ["Entendre què em passa", "F7"],
    ["Saber quan he de consultar el metge", "F7"],
    ["Conèixer els tractaments i les opcions", "F7"],
    ["Conèixer altres persones amb distonia", "F8"]
  ]}
};

// ============================================================
//  FINALS
//  cat: neutre | fisic | emocional | social | info | urgent
// ============================================================

const ADC  = ["Associació Distonia Catalunya", "https://distonia.cat/"];
const CUN  = ["Distonia (Clínica Universidad de Navarra)", "https://www.cun.es/enfermedades-tratamientos/enfermedades/distonia"];
const NINDS = ["Dystonia (NINDS)", "https://www.ninds.nih.gov/health-information/disorders/dystonia"];
const MEDLINE = ["MedlinePlus (en castellà)", "https://medlineplus.gov/spanish/"];

const FINALS = {
  F1: { titol: "Un dia estable", cat: "neutre",
    text: "Sembla que avui és un dia tranquil. Registra com et trobes i mantén les teves rutines. Conèixer bé la distonia també ajuda a sentir-te amb més control.",
    links: [ADC, CUN] },

  F2: { titol: "Un dia de càrrega", cat: "neutre",
    text: "Avui el cos o l'ànim van una mica carregats. Descansa, intenta reduir l'estrès i prova els teus trucs sensitius (per exemple, tocar-te la barbeta o la zona del coll). Apunta com et trobes per veure si es repeteix.",
    links: [] },

  F3: { titol: "Convé una revisió mèdica", cat: "fisic",
    text: "Els canvis que descrius val la pena comentar-los amb el teu neuròleg. Potser cal ajustar la medicació o el moment de les infiltracions de toxina botulínica. Apunta quan han començat i com han evolucionat per explicar-ho millor a la visita.",
    links: [CUN] },

  F4: { titol: "Alerta física", cat: "urgent",
    text: "Els símptomes que descrius poden necessitar atenció mèdica ara. Contacta avui amb el teu metge o amb urgències. Si et costa respirar o empassar, truca al 112.",
    links: [], tels: [["Trucar al 112", "112"]] },

  F5: { titol: "Suport emocional", cat: "emocional",
    text: "La frustració, la tristesa, la vergonya i l'aïllament són molt freqüents en la distonia, i no et passa només a tu. Parlar-ne ajuda: amb el teu metge de capçalera, amb un psicòleg o amb una persona de confiança. També pots contactar amb l'Associació Distonia Catalunya.",
    links: [ADC] },

  F6: { titol: "Gràcies per ser sincer/a", cat: "urgent",
    text: "No has de passar-ho sol/a. Truca ara al 024 (línia d'atenció a la conducta suïcida, gratuïta i oberta les 24 hores) o al 112 si és una urgència. I explica-ho a una persona de confiança que tinguis a prop.",
    links: [], tels: [["Trucar al 024", "024"], ["Trucar al 112", "112"]] },

  F7: { titol: "Informació i orientació", cat: "info",
    text: "Entendre què et passa ajuda a sentir més control. Aquí tens fonts fiables per informar-te sobre la distonia, els tractaments i quan cal consultar el metge.",
    links: [ADC, CUN, MEDLINE, NINDS] },

  F8: { titol: "No estàs sol/a", cat: "info",
    text: "Conèixer altres persones que viuen el mateix pot fer-te sentir molt acompanyat/da. L'Associació Distonia Catalunya et pot posar en contacte amb altres persones afectades i orientar-te.",
    links: [ADC] },

  F9: { titol: "Ho estàs gestionant amb força", cat: "neutre",
    text: "Sembla que tens recursos propis per afrontar-ho. Aprofita-ho: apunta què t'ajuda i, si et ve de gust, comparteix-ho amb altres persones afectades.",
    links: [ADC] },

  F10: { titol: "Tornar a connectar", cat: "social",
    text: "L'aïllament és habitual en la distonia, però es pot canviar a poc a poc. Pots començar per un contacte petit i segur: un missatge a algú de confiança o una trobada curta en un lloc còmode. Connectar amb altres persones afectades també ajuda.",
    links: [ADC] },

  F11: { titol: "Explicar què necessites", cat: "social",
    text: "Costa explicar què passa, i demanar ajuda pot semblar difícil. Pots preparar una frase curta per explicar la distonia (per exemple: «són contraccions involuntàries dels músculs, no controlo els moviments») i dir clarament quin tipus d'ajuda et va bé. Demanar ajuda no vol dir ser una càrrega.",
    links: [ADC] },

  F12: { titol: "Guanyar autonomia", cat: "fisic",
    text: "Hi ha recursos que poden ajudar-te a guanyar autonomia: teràpia ocupacional, productes de suport i adaptacions a la llar. Pregunta-ho al teu neuròleg o al servei de rehabilitació.",
    links: [] },

  F13: { titol: "Feina i estudis", cat: "social",
    text: "La distonia pot afectar la feina o els estudis, però hi ha adaptacions possibles. Pots parlar amb el teu centre de salut, amb el servei de prevenció de l'empresa o amb l'orientació del centre educatiu per saber quines adaptacions pots demanar i com explicar-ho al teu entorn.",
    links: [ADC] }
};

// Etiquetes de categoria (per mostrar i per a l'anàlisi)
const CATEGORIES = {
  neutre: "Benestar / estable",
  fisic: "Físic",
  emocional: "Emocional",
  social: "Social",
  info: "Informació",
  urgent: "Atenció urgent"
};

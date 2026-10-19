# Viure amb distonia · Informació, orientació i acompanyament

Web estàtica (HTML, CSS i JavaScript, sense servidor ni dades personals) feta per al Treball de Recerca de Batxillerat. Pensada per a persones amb distonia i per a qui les acompanya.

## Què conté

| Pàgina | Fitxer | Què fa |
|---|---|---|
| Inici | `index.html` | Portada amb accés a totes les seccions |
| Com et trobes? | `orientacio.html` | Qüestionari ramificat (33 preguntes, 13 finals) que dona una orientació |
| Registre diari | `registre.html` | Apuntar ànim, símptomes, dolor, cansament, estrès, son, zones afectades i notes; gràfic dels últims 30 dies; exportació a CSV |
| Sobre la distonia | `informacio.html` | Què és, tipus, símptomes, causes, diagnòstic, tractaments, emocions i fonts |
| Família i entorn | `entorn.html` | Consells per acompanyar i una targeta imprimible per explicar la distonia |
| Visita al metge | `visita.html` | Resum del registre i preguntes per al neuròleg, imprimible o en PDF |
| Recursos | `recursos.html` | Associació Distonia Catalunya, fonts mèdiques i telèfons d'ajuda (112, 024, 061) |

Fitxers de suport:

| Fitxer | Què conté |
|---|---|
| `style.css` | Tot el disseny (inclou mode fosc automàtic i mode «lletra gran») |
| `common.js` | El menú i el peu de totes les pàgines. Per afegir una pàgina al menú, edita la llista `PAGINES` |
| `lib.js` | Les escales del registre (`ESCALES`), les zones (`ZONES`) i els càlculs del resum |
| `veu.js` | La veu: llegir textos en veu alta, escoltar respostes i entendre números, opcions i «sí/no» en català |
| `arbre.js` | **Totes les preguntes, opcions i finals del qüestionari** |

## Veu

- **Llegir en veu alta:** botó «Llegir la pàgina en veu alta» a Inici, Sobre la distonia, Família i entorn i Recursos; «Escoltar la pregunta» al qüestionari. Ho fa el propi dispositiu i no s'envia res enlloc. Si el dispositiu no té veu en català, el navegador n'usarà una altra i la pronunciació pot ser pitjor.
- **Respondre parlant:** al qüestionari («Respondre parlant», o el mode automàtic de la pantalla d'inici) i al registre diari («Omplir les escales per veu», «Dictar la nota»). Abans d'entendre una opció, la web la repeteix i demana confirmació.
- **Privadesa:** per entendre la veu, el navegador envia l'àudio al seu servei de reconeixement (normalment Google o Microsoft). Aquesta web no el rep ni el guarda, i avisa abans del primer ús. Funciona sobretot a Chrome i Edge; a Firefox només es pot llegir en veu alta.
- **Limitacions:** si la persona té distonia a la veu, la mandíbula o la llengua, el reconeixement pot fallar. Per això la veu és sempre opcional i tot es pot fer amb els botons.

## Com publicar-la a GitHub Pages

1. Crea un repositori **públic** a [github.com](https://github.com).
2. Clica **Add file → Upload files** i arrossega **tots els fitxers** (`.html`, `.css`, `.js` i aquest `README.md`; si has descarregat el ZIP, descomprimeix-lo i arrossega els fitxers, no la carpeta) a l'arrel del repositori. Si ja n'hi ha de pujats amb el mateix nom, es substitueixen. Clica **Commit changes**.
3. Ves a **Settings → Pages**. A **Source** tria **Deploy from a branch**, a **Branch** tria `main` i `/ (root)`, i clica **Save**.
4. Espera 1-2 minuts. L'adreça serà `https://EL_TEU_USUARI.github.io/NOM_DEL_REPOSITORI/`.

Cada cop que canviïs un fitxer i facis *Commit*, la web s'actualitza sola.

## Com editar el qüestionari

A `arbre.js`, cada pregunta és un node:

```js
A1: { t: "Com estàs avui?", o: [
  ["Bé", "A2"],
  ["Malament", "A9"]
]},
```

- `A1` és el codi de la pregunta; `t`, el text; `o`, les opcions `["text de l'opció", "codi on porta"]`.
- Si el codi comença per `F` (F1, F2...), porta a un **final**, que es defineix a `FINALS`.

## Sobre les dades

La web no té servidor. Tot el que s'apunta (qüestionari i registre diari) es guarda **només al navegador de cada persona** i es pot descarregar com a CSV. Per tant, **tu no reps les dades dels altres usuaris**. Si vols recollir dades de diverses persones per a l'anàlisi del TDR, demana'ls el CSV o afegeix un enllaç a un formulari, i avisa'ls sempre del que recolliràs.

## Avís

Aquesta web és divulgativa i orientativa i no substitueix un professional sanitari. En una urgència: 112. Línia d'atenció a la conducta suïcida: 024.

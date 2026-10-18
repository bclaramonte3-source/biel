# Com et trobes avui? · Orientació sobre la distonia

Web estàtica (HTML + JavaScript, sense servidor) amb un arbre de preguntes ramificat que acaba en una orientació segons com se senti el pacient. Part pràctica del Treball de Recerca de Batxillerat.

## Fitxers

| Fitxer | Què conté |
|---|---|
| `index.html` | La pàgina: disseny, navegació, botó enrere, resultat i historial |
| `arbre.js` | **Totes les preguntes, opcions i finals.** És el fitxer que has d'editar si vols canviar el contingut |
| `README.md` | Aquest text |

## Com publicar-la a GitHub Pages

1. Entra a [github.com](https://github.com) i crea un compte si no en tens.
2. Clica **New repository**. Posa-li un nom (per exemple `distonia-orientacio`) i marca **Public**.
3. Clica **uploading an existing file** i puja `index.html`, `arbre.js` i `README.md`. Després, **Commit changes**.
4. Ves a **Settings → Pages**.
5. A *Build and deployment*, a **Source** tria **Deploy from a branch**. A **Branch** tria `main` i la carpeta `/ (root)`. Clica **Save**.
6. Espera 1-2 minuts. L'adreça serà:

   `https://EL_TEU_USUARI.github.io/distonia-orientacio/`

Cada cop que canviïs un fitxer al repositori i facis *Commit*, la web s'actualitza sola.

## Com editar l'arbre

A `arbre.js`, cada pregunta és un node:

```js
A1: { t: "Com estàs avui?", o: [
  ["Bé", "A2"],
  ["Malament", "A9"]
]},
```

- `A1` és el codi de la pregunta.
- `t` és el text de la pregunta.
- `o` és la llista d'opcions: `["text de l'opció", "codi on porta"]`.
- Si el codi comença per `F` (F1, F2...), l'opció porta a un **final**, que es defineix a `FINALS`.

## Sobre l'historial

La web no té servidor. Si l'usuari deixa marcada la casella, el resultat es guarda **només al seu navegador** (`localStorage`) i es pot descarregar com a CSV. Això vol dir que **tu no reps les dades dels altres usuaris**.

Si vols recollir dades de diverses persones per a l'anàlisi del TDR, una opció senzilla és demanar-los que et passin el CSV, o afegir al final un enllaç a un Google Forms. Avisa sempre els participants i no demanis dades personals.

## Avís

L'eina és orientativa i no substitueix un professional sanitari. En una urgència: 112. Línia d'atenció a la conducta suïcida: 024.

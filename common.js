// ============================================================
//  COMÚ A TOTES LES PÀGINES: menú, peu i botó de lletra gran
//  Per afegir o treure una pàgina del menú, edita la llista PAGINES.
// ============================================================
(function () {
  var PAGINES = [
    ["index.html", "Inici"],
    ["orientacio.html", "Com et trobes?"],
    ["registre.html", "Registre diari"],
    ["informacio.html", "Sobre la distonia"],
    ["entorn.html", "Família i entorn"],
    ["visita.html", "Visita al metge"],
    ["recursos.html", "Recursos"]
  ];
  var CLAU_MIDA = "distonia_lletra_gran";

  function llegeix(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function escriu(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sense emmagatzematge */ } }

  function aplicaMida() {
    var gran = llegeix(CLAU_MIDA) === "1";
    document.documentElement.classList.toggle("gran", gran);
    var b = document.getElementById("btn-mida");
    if (b) b.setAttribute("aria-pressed", gran ? "true" : "false");
  }

  var actual = location.pathname.split("/").pop() || "index.html";

  var cap = document.getElementById("capcalera");
  if (cap) {
    var llista = PAGINES.map(function (p) {
      var cur = p[0] === actual ? ' aria-current="page"' : "";
      return '<li><a href="' + p[0] + '"' + cur + ">" + p[1] + "</a></li>";
    }).join("");
    cap.innerHTML =
      '<a class="salta" href="#contingut">Salta al contingut</a>' +
      '<header class="cap"><div class="cap-in">' +
      '<a class="marca" href="index.html">Viure amb distonia</a>' +
      '<button class="btn-mida" id="btn-mida" type="button" aria-pressed="false">Lletra gran</button>' +
      "</div>" +
      '<nav aria-label="Menú principal"><ul>' + llista + "</ul></nav></header>";
    document.getElementById("btn-mida").addEventListener("click", function () {
      var gran = llegeix(CLAU_MIDA) !== "1";
      escriu(CLAU_MIDA, gran ? "1" : "0");
      aplicaMida();
    });
  }

  var peu = document.getElementById("peu");
  if (peu) {
    peu.className = "pie";
    peu.innerHTML =
      "<p>Aquesta web és divulgativa i orientativa, i no substitueix un professional sanitari. " +
      "En una urgència, truca al <strong>112</strong>. Línia d'atenció a la conducta suïcida: <strong>024</strong>.</p>" +
      "<p>Treball de Recerca de Batxillerat · Thos i Codina (Mataró)</p>";
  }

  aplicaMida();
})();

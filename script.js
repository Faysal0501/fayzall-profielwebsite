// Onderdelen van de rekenmachine ophalen uit de HTML.
const uitkomstVeld = document.querySelector("#uitkomst");
const berekeningVeld = document.querySelector("#berekening");
const rekenmachine = document.querySelector(".calculator");

let huidigeWaarde = "0";
let vorigeWaarde = null;
let gekozenOperator = null;
let wachtOpNieuwGetal = false;

function toonWaarde() {
  // In Nederland tonen we een komma als decimaalteken.
  uitkomstVeld.textContent = huidigeWaarde.replace(".", ",");
}

function voegCijferToe(cijfer) {
  if (huidigeWaarde === "Kan niet" || wachtOpNieuwGetal) {
    huidigeWaarde = cijfer;
    wachtOpNieuwGetal = false;
  } else if (huidigeWaarde === "0") {
    huidigeWaarde = cijfer;
  } else if (huidigeWaarde.length < 12) {
    huidigeWaarde += cijfer;
  }
  toonWaarde();
}

function voegKommaToe() {
  if (wachtOpNieuwGetal || huidigeWaarde === "Kan niet") {
    huidigeWaarde = "0.";
    wachtOpNieuwGetal = false;
  } else if (!huidigeWaarde.includes(".")) {
    huidigeWaarde += ".";
  }
  toonWaarde();
}

function bereken(eersteGetal, tweedeGetal, operator) {
  if (operator === "+") return eersteGetal + tweedeGetal;
  if (operator === "-") return eersteGetal - tweedeGetal;
  if (operator === "*") return eersteGetal * tweedeGetal;
  if (operator === "/") return tweedeGetal === 0 ? null : eersteGetal / tweedeGetal;
  return tweedeGetal;
}

function kiesOperator(operator) {
  const getal = Number(huidigeWaarde);
  if (!Number.isFinite(getal)) return;

  if (gekozenOperator && vorigeWaarde !== null && !wachtOpNieuwGetal) {
    const resultaat = bereken(vorigeWaarde, getal, gekozenOperator);
    if (resultaat === null) {
      huidigeWaarde = "Kan niet";
      toonWaarde();
      return;
    }
    huidigeWaarde = String(Number(resultaat.toFixed(8)));
    vorigeWaarde = Number(huidigeWaarde);
  } else {
    vorigeWaarde = getal;
  }

  gekozenOperator = operator;
  wachtOpNieuwGetal = true;
  const teken = { "+": "+", "-": "−", "*": "×", "/": "÷" }[operator];
  berekeningVeld.textContent = `${huidigeWaarde.replace(".", ",")} ${teken}`;
  toonWaarde();
}

function toonEindresultaat() {
  if (gekozenOperator === null || vorigeWaarde === null || wachtOpNieuwGetal) return;
  const tweedeGetal = Number(huidigeWaarde);
  const resultaat = bereken(vorigeWaarde, tweedeGetal, gekozenOperator);

  if (resultaat === null) {
    huidigeWaarde = "Kan niet";
  } else {
    huidigeWaarde = String(Number(resultaat.toFixed(8)));
  }

  berekeningVeld.textContent = "Uitkomst";
  vorigeWaarde = null;
  gekozenOperator = null;
  wachtOpNieuwGetal = true;
  toonWaarde();
}

function wisAlles() {
  huidigeWaarde = "0";
  vorigeWaarde = null;
  gekozenOperator = null;
  wachtOpNieuwGetal = false;
  berekeningVeld.innerHTML = "&nbsp;";
  toonWaarde();
}

rekenmachine.addEventListener("click", (event) => {
  const knop = event.target.closest("button");
  if (!knop) return;

  if (knop.dataset.number) voegCijferToe(knop.dataset.number);
  if (knop.dataset.operator) kiesOperator(knop.dataset.operator);
  if (knop.dataset.action === "decimal") voegKommaToe();
  if (knop.dataset.action === "equals") toonEindresultaat();
  if (knop.dataset.action === "clear") wisAlles();

  if (knop.dataset.action === "backspace" && !wachtOpNieuwGetal) {
    huidigeWaarde = huidigeWaarde.length > 1 ? huidigeWaarde.slice(0, -1) : "0";
    toonWaarde();
  }

  if (knop.dataset.action === "percent" && huidigeWaarde !== "Kan niet") {
    huidigeWaarde = String(Number(huidigeWaarde) / 100);
    toonWaarde();
  }
});

// Het jaartal onderaan wordt automatisch bijgewerkt.
document.querySelector("#jaar").textContent = new Date().getFullYear();

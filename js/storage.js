// ======================================
// Nyhetsradar
// storage.js
// Version 18.0
// ======================================

function save() {

  localStorage.setItem(
    "stocks",
    JSON.stringify(stocks)
  );

}

function exportStocks() {

  const data =
  JSON.stringify(
    stocks,
    null,
    2
  );

  const blob =
  new Blob(
    [data],
    { type: "application/json" }
  );

  const a =
  document.createElement("a");

  a.href =
  URL.createObjectURL(blob);

  a.download =
  "nyhetsradar-backup.json";

  a.click();

}

function importStocks(event) {

  const file =
  event.target.files[0];

  if (!file) return;

  const reader =
  new FileReader();

  reader.onload = function(e) {

    try {

      const imported =
      JSON.parse(
        e.target.result
      );

      if (!Array.isArray(imported)) {

        alert("Ogiltig backupfil");

        return;

      }

      if (
        !confirm(
          "Importera lista?\nNuvarande lista ersätts."
        )
      ) {

        return;

      }

      stocks = imported;

      save();

      render();

      event.target.value = "";

      alert("Import klar");

    }

    catch {

      alert(
        "Kunde inte läsa filen"
      );

    }

  };

  reader.readAsText(file);

}

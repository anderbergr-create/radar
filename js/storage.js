// ======================================
// Nyhetsradar Storage
// Version 18.0
// ======================================


// ----------------------------
// Stocks
// ----------------------------

function saveStocks() {
    localStorage.setItem(
        "stocks",
        JSON.stringify(stocks)
    );
}

function loadStocks() {

    const saved =
        localStorage.getItem("stocks");

    if (saved) {
        stocks = JSON.parse(saved);
    }

}


// ----------------------------
// Settings
// ----------------------------

function saveSettings() {

    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );

}

function loadSettings() {

    const saved =
        localStorage.getItem("settings");

    if (saved) {

        settings = JSON.parse(saved);

    }

}


// ----------------------------
// Export
// ----------------------------

function exportStocks() {

    const data =
        JSON.stringify(stocks, null, 2);

    const blob =
        new Blob(
            [data],
            {
                type: "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "nyhetsradar-backup.json";

    a.click();

    URL.revokeObjectURL(url);

}


// ----------------------------
// Import
// ----------------------------

function importStocks(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = function(e) {

        try {

            stocks =
                JSON.parse(e.target.result);

            saveStocks();

            render();

        }

        catch {

            alert("Felaktig backupfil.");

        }

        event.target.value = "";

    };

    reader.readAsText(file);

}

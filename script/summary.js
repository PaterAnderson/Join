
let dateArray = [];



if (!sessionStorage.getItem('user')) {

    window.location.href = '../index.html';

} 


function summaryStart() {

    showSummary();
    showGuest();
}

function showGuest() {

    document.getElementById('greet_name').innerText = sessionStorage.getItem('user');
}


const showSummary = () => {

    getAllDueDatesFromFirebase()

        .then(dueDates => {
            // Überprüfen, ob Daten erfolgreich abgerufen wurden
            if (!dueDates || dueDates.length === 0) {
                console.error('Keine Fälligkeitsdaten gefunden.');
                return;  // Keine Daten, also stoppen wir hier
            }

            dateArray = dueDates;

            const result = processDates(dateArray);
            document.getElementById('urgent_number').innerText = result.arrayPast.length + result.urgentArray.length;
            document.getElementById('greet_time').innerText = generateGreeting() + ",";

            showDateInSummaryUrgent(result.urgentArray[0], result.arrayPast.length);
        })
        .catch(error => {
            console.error("Fehler in showSummary:", error);
        });
};


// Konvertiere Datum aus dem Format "DD/MM/YYYY" in ein Date-Objekt
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day); // month - 1, weil JS Monate 0-basiert speichert
}

// Erstelle arrayPast mit allen Daten in der Vergangenheit, aber nicht dem aktuellen Datum
function getPastDates(dateArray, currentDate) {
    return dateArray.filter(dateStr => {
        const date = parseDate(dateStr);
        return date < currentDate && !(date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear());
    });
}

// Erstelle urgentArray mit allen Daten, die mit dem aktuellen Datum übereinstimmen
function getUrgentDates(dateArray, currentDate) {
    return dateArray.filter(dateStr => {
        const date = parseDate(dateStr);
        return (
            date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear()
        );
    });
}

// Wenn urgentArray leer ist, finde das nächstgelegene Datum
function getClosestDate(dateArray, currentDate) {
    let closestDate = null;
    let minDiff = Infinity;

    dateArray.forEach(dateStr => {
        const date = parseDate(dateStr);
        const diff = date - currentDate;

        // Überprüfen, ob das Datum in der Zukunft liegt
        if (diff >= 0 && diff < minDiff) {
            minDiff = diff;
            closestDate = dateStr;
        }
    });

    return closestDate;
}

// Hauptfunktion for for editing dateArray
function processDates(dateArray) {
    const currentDate = new Date(); // aktuelles Datum

    // Erstelle arrayPast
    const arrayPast = getPastDates(dateArray, currentDate);

    // Erstelle urgentArray
    let urgentArray = getUrgentDates(dateArray, currentDate);

    // Wenn urgentArray leer ist, finde das nächstgelegene Datum
    if (urgentArray.length === 0) {
        const closestDate = getClosestDate(dateArray, currentDate);
        if (closestDate) {
            urgentArray = dateArray.filter(dateStr => dateStr === closestDate);
        }
    }

    return { arrayPast, urgentArray };
}

function generateGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
        return "Good morning";
    } else if (hours < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

function showDateInSummaryUrgent(firstDate, pastLength) {

    if (firstDate != null) {
        // Zerlege das Datum in Tag, Monat und Jahr
        const [day, month, year] = firstDate.split('/').map(Number);

        // Erstelle ein Date-Objekt
        const date = new Date(year, month - 1, day); // Monate sind 0-indexiert in JavaScript

        // Erstelle eine Formatierungsoption für die Datumsausgabe
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Formatiere das Datum in der gewünschten Form
        const formattedDate = date.toLocaleDateString('en-US', options);

        document.getElementById('upcoming').innerText = formattedDate;
    }

    if ((firstDate == null) && (pastLength > 0)) {

        document.getElementById('upcoming').innerText = "in the past";
    }
}




let dateArray = [];
if (!sessionStorage.getItem('user')) window.location.href = '../index.html';


function summaryStart() {

    greetingStart();
    showSummary();

    getTaskCountsByKanbanId();
}

function greetingStart() {

    showUser();

    if (window.innerWidth <= 600) {

        if (sessionStorage.getItem('greeting') == 'login') {

            document.getElementById('greeting').style = "opacity: 1; display: flex";
            setTimeout(hideGreeting, 3000);

        } else showContent();

    } else {
        showContent();
        sessionStorage.setItem('greeting', '');
    }
}

function hideGreeting() {

    document.getElementById('greeting').style = "display: none";
    sessionStorage.setItem('greeting', '');
    showContent();
}

function showContent() {

    document.getElementById('join_360').style = "";
    document.getElementById('summary').style = "";
}

function showUser() {

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

function summaryOnclick() {

    window.location.href = '../html/board.html';
}


const getTaskCountsByKanbanId = async () => {

    try {
        const response = await fetch(`${BASE_URL}/tasks.json`, { method: "GET", headers: { "Content-Type": "application/json" } });

        if (response.ok) {

            const tasks = await response.json();
            const kanbanCounts = { 'to-do': 0, 'in-progress': 0, 'await-feedback': 0, 'done': 0 };

            for (const key in tasks) {

                const task = tasks[key];
                if (task.kanbanId && kanbanCounts.hasOwnProperty(task.kanbanId)) {
                    kanbanCounts[task.kanbanId]++;
                }
            }

            showKanbanCountsInSummary(kanbanCounts);

        } else console.error("Fehler beim Abrufen der Tasks:", response.status);

    } catch (error) { console.error("Fehler:", error) }
};

function showKanbanCountsInSummary(kanbanCounts) {

    document.querySelector('.to-do62-2').innerText = kanbanCounts['to-do'];
    document.querySelector('.done12-2').innerText = kanbanCounts['done'];
    document.querySelector('.progress-2').innerText = kanbanCounts['in-progress'];
    document.querySelector('.feedback-2').innerText = kanbanCounts['await-feedback'];
    document.querySelector('.board456-2').innerText = kanbanCounts['await-feedback'] + kanbanCounts['in-progress'] + kanbanCounts['done'] + kanbanCounts['to-do'];
}




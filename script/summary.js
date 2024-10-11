
let dateArray = [];
if (!sessionStorage.getItem('user')) window.location.href = '../index.html';


/**
 * 
 * summary onload start
 * 
 */
function summaryStart() {

    greetingStart();
    showSummary();

    getTaskCountsByKanbanId();
}


/**
 * 
 * function for greeting
 * 
 */
function greetingStart() {

    showUser();

    if (window.innerWidth <= 600) {

        if (sessionStorage.getItem('greeting') == 'login') {

            document.getElementById('greeting').style = "opacity: 1; display: flex";
            setTimeout(hideGreeting, 2700);

        } else showContent();

    } else {
        showContent();
        sessionStorage.setItem('greeting', '');
    }
}


/**
 * 
 * hide greeting
 * 
 */
function hideGreeting() {

    document.getElementById('greeting').style = "display: none";
    sessionStorage.setItem('greeting', '');
    showContent();
}


/**
 * 
 * show content
 * 
 */
function showContent() {

    document.getElementById('join_360').style = "";
    document.getElementById('summary').style = "";
}


/**
 * 
 * show user
 * 
 */
function showUser() {

    document.getElementById('greet_name').innerText = sessionStorage.getItem('user');
}


/**
 * 
 * show summary
 * 
 */
const showSummary = () => {

    getAllDueDatesFromFirebase()

        .then(dueDates => {

            if (!dueDates || dueDates.length === 0) { document.getElementById('upcoming').innerText = "no tasks" }

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


/**
 * 
 * Convert date from the format "DD/MM/YYYY" to a Date object
 * 
 */
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day); // month - 1, weil JS Monate 0-basiert speichert
}


/**
 * 
 * get past dates
 * 
 */
function getPastDates(dateArray, currentDate) {
    return dateArray.filter(dateStr => {
        const date = parseDate(dateStr);
        return date < currentDate && !(date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear());
    });
}


/**
 * 
 * get urgent dates
 * 
 */
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


/**
 * 
 * get closest date
 * 
 */
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


/**
 * 
 * process dates
 * 
 */
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


/**
 * 
 * generate greeting
 * 
 */
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


/**
 * 
 * show date in summary urgent
 * 
 */
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


/**
 * 
 * summary on click, redirect
 * 
 */
function summaryOnclick() {

    window.location.href = '../html/board.html';
}


/**
 * 
 * get task counts by kanbanId
 * 
 */
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


/**
 * 
 * show kanban counts in summary
 * 
 */
function showKanbanCountsInSummary(kanbanCounts) {

    document.querySelector('.to-do62-2').innerText = kanbanCounts['to-do'];
    document.querySelector('.done12-2').innerText = kanbanCounts['done'];
    document.querySelector('.progress-2').innerText = kanbanCounts['in-progress'];
    document.querySelector('.feedback-2').innerText = kanbanCounts['await-feedback'];
    document.querySelector('.board456-2').innerText = kanbanCounts['await-feedback'] + kanbanCounts['in-progress'] + kanbanCounts['done'] + kanbanCounts['to-do'];
}




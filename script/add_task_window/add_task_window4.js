
/**
 * 
 * Function called when Enter is pressed - create task click
 * 
 */
function enterPressedCreateTask(event) {

    if (event.key === "Enter") {
        createTaskClick();
    }
}


/**
 * 
 * most necessary entries are checked
 * 
 */
function checkInputsInInputs1() {

    const title = document.getElementById('title_input').value.trim();

    if (title == "") { titleEnterError(); return } else {

        checkNameOfTheTaskInFirebase(title).then((exists) => {

            if (exists) {
                titleEnterError();

            } else {
                checkInputsInInputs2(title)
            }
        }).catch((error) => { console.error("Fehler bei der Überprüfung des Tasks:", error); });
    }
}


/**
 * 
 * most necessary entries are checked
 * 
 */
function checkInputsInInputs2() {

    const dueDate = document.getElementById('input_due_date').value;
    if (validateDate(dueDate)) { checkInputsInInputs3() } else dateEnterError();
}


/**
 * 
 * most necessary entries are checked
 * 
 */
function checkInputsInInputs3() {

    showHideError('date_error', false);
    const title = document.getElementById('title_input').value.trim();
    const description = document.getElementById('text_area').value;
    const dueDate = document.getElementById('input_due_date').value;

    if (selectedCategory != "") {

        showHideError('category_error', false);
        createTaskAnimation();
        createTaskInFirebase(title, description, dueDate);

        setTimeout(() => { alert('task created!'); document.getElementById('task_added_to_board').classList.remove('task-added-to-board2'); }, 2000);

    } else categoryEnterError();
}


/**
 * format of date is checked
 * 
 * @param {string} date 
 */
function validateDate(date) {
    // Prüfen, ob das Format korrekt ist (dd/mm/yyyy)
    if (date.length !== 10 || date[2] !== '/' || date[5] !== '/') {
        return false;
    }

    // Tag, Monat und Jahr extrahieren
    let day = parseInt(date.substring(0, 2), 10);
    let month = parseInt(date.substring(3, 5), 10);

    // Überprüfen, ob Tag und Monat im gültigen Bereich sind
    if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12) {
        return false;
    }

    return true;
}


/**
 * 
 * messages for errors
 * 
 */
function titleEnterError() {

    showHideError('title_error', true);
    document.getElementById('title_input').placeholder = "Change or enter a name of the task!";
    document.getElementById('title_input').value = "";
}


/**
 * 
 * messages for errors
 * 
 */
function dateEnterError() {

    showHideError('date_error', true);
    document.getElementById('input_due_date').placeholder = "Enter a date!";
    document.getElementById('input_due_date').value = "";
}


/**
 * 
 * messages for errors
 * 
 */
function categoryEnterError() {

    showHideError('category_error', true);
}


/**
 * show or hide error messages
 * 
 * @param {string, boolean} date, show-hide
 */
function showHideError(id, show) {

    if (show) { document.getElementById(id).style = ""; } else document.getElementById(id).style = "display: none";
}


// Hauptfunktion, die alle Teilfunktionen aufruft
const checkNameOfTheTaskInFirebase = async (title) => {
    const taskPfad = encodeTaskTitle(title);  // Encodieren des Titels
    try {
        const response = await fetchTaskFromFirebase(taskPfad);  // Task abrufen
        return await checkFirebaseResponse(response, title);  // Antwort prüfen
    } catch (error) {
        console.error("Fehler:", error);
        return false;
    }
};


// Funktion zum Encodieren des Titels für die URL
const encodeTaskTitle = (title) => {
    return encodeURIComponent(title);
};


// Funktion zum Senden einer GET-Anfrage an Firebase
const fetchTaskFromFirebase = async (taskPfad) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskPfad}.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
};


// Funktion zur Überprüfung, ob die Antwort erfolgreich ist
const checkFirebaseResponse = async (response, title) => {

    if (response.ok) {
        const data = await response.json();
        if (data) {
            return true;
        } else {
            return false;
        }
    } else {
        console.error("Fehler beim Abrufen des Tasks:", response.status);
        return false;
    }
};

function createTaskAnimation() {

    document.getElementById('task_added_to_board').classList.add('task-added-to-board2');
}

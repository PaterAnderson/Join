
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

        setTimeout(() => { document.getElementById('task_added_to_board').classList.remove('task-added-to-board2') }, 2000);

    } else categoryEnterError();
}


/**
 * format of date is checked
 * 
 * @param {string} date 
 */
function validateDate(date) {
    // Überprüfen, ob das Datum das Format dd/mm/yyyy hat
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(date)) {
        return false;
    }

    // Datum in Tag, Monat und Jahr aufteilen
    const [day, month, year] = date.split('/').map(Number);

    // Überprüfen, ob das Jahr ein Schaltjahr ist
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Anzahl der Tage pro Monat
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Prüfen, ob der Monat zwischen 1 und 12 liegt und der Tag innerhalb des gültigen Bereichs für den Monat liegt
    return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
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


/**
 * 
 * Hauptfunktion, die alle Teilfunktionen aufruft
 * 
 */
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


/**
 * 
 * Funktion zum Encodieren des Titels für die URL
 * 
 */
const encodeTaskTitle = (title) => {
    return encodeURIComponent(title);
};


/**
 * 
 * Funktion zum Senden einer GET-Anfrage an Firebase
 * 
 */
const fetchTaskFromFirebase = async (taskPfad) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskPfad}.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
};


/**
 * 
 * Funktion zur Überprüfung, ob die Antwort erfolgreich ist
 * 
 */
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


/**
 * 
 * animation add task created
 * 
 */
function createTaskAnimation() {

    document.getElementById('task_added_to_board').classList.add('task-added-to-board2');
}


/**
 * 
 * clear add task form
 * 
 */
function clearAddTaskForm() {

    setTimeout(clearContactDropDownMenu, 200);
    setTimeout(clearSubtaskMenu, 200);
    setTimeout(clearTitleDescriptionDueDate, 200);
}


/**
 * 
 * clear contact drop down menu
 * 
 */
function clearContactDropDownMenu() {

    document.getElementById('contacts_list').value = "";
    selectedContacts = [];
    allContactNames = [];
    currentNumberOfSelectedContacts = 0;
    numberOfContactsDropdownMenu = 3;
    renderContacts();
    fetchAllContactNames();
    showContactsAsCircles();
}


/**
 * 
 * clear subtask menu
 * 
 */
function clearSubtaskMenu() {

    subtaskCollection = [];
    document.getElementById('render_subtasks').innerHTML = "";
    document.getElementById('subtask_input').value = "";
}


/**
 * 
 * clear title, description, due date 
 * 
 */
function clearTitleDescriptionDueDate() {

    showHideError('title_error', false);
    document.getElementById('title_input').placeholder = "Enter a title";

    showHideError('date_error', false);
    document.getElementById('input_due_date').placeholder = "dd/mm/yyyy";

    showHideError('category_error', false);

    document.getElementById('title_input').value = "";
    document.getElementById('text_area').value = "";
    document.getElementById('input_due_date').value = "";
}

/**
 * 
 * show frame36 - subtask input
 * 
 */
function showFrame36SubtaskInput() {

    if (document.getElementById('subtask_input').value.trim() !== "") { document.querySelector('.frame36').style = "" } else document.querySelector('.frame36').style = "display: none";
}


/**
 * 
 * hide frame36 - subtask input 
 * 
 */
function hideFrame36SubtaskInput() {

    document.querySelector('.frame36').style = "display: none";
}


/**
 * 
 * frame36, cancel clicked - subtask input
 * 
 */
function frame36Cancel() {

    document.getElementById('subtask_input').value = "";
    document.getElementById('subtask_input').blur();
    document.querySelector('.frame36').style = "display: none";
}


/**
 * 
 * open category
 * 
 */
function openCategory() {

    toggle2 = true;
    document.getElementById('list_of_category').classList.add('list-of-category2');
    setTimeout(() => document.getElementById('list_of_category_outside').style = "overflow: visible;", 200);

    document.getElementById('list_of_category_outside').classList.add('z2');
    document.getElementById('list_of_category_outside').classList.remove('z1');

    document.getElementById('assign_arrow_category').src = "../assets/icons/arrow_drop_up.png";
}


/**
 * 
 * close category
 * 
 */
function closeCategory() {

    toggle2 = false;
    document.getElementById('list_of_category').classList.remove('list-of-category2');
    document.getElementById('list_of_category_outside').style = "overflow: hidden;";

    setTimeout(changeZindexForListofCategory, 200);

    document.getElementById('assign_arrow_category').src = "../assets/icons/arrow_drop_down.png";
}


/**
 * 
 * change z index for list of category
 * 
 */
function changeZindexForListofCategory() {

    document.getElementById('list_of_category_outside').classList.remove('z2');
    document.getElementById('list_of_category_outside').classList.add('z1');
}


/**
 * 
 * function for switching the category view
 * 
 */
function toggleShowCategory() {

    if (toggle2) { closeCategory() } else openCategory();
}


/**
 * 
 * create category technical task
 * 
 */
function categoryTechnicalTask() {

    document.getElementById('selected category').innerText = "Technical Task";
    selectedCategory = "Technical Task";

    showHideError('category_error', false);
    closeCategory();
}


/**
 * 
 * create category user story
 * 
 */
function categoryUserStory() {

    document.getElementById('selected category').innerText = "User Story";
    selectedCategory = "User Story";

    showHideError('category_error', false);
    closeCategory();
}


/**
 * activate focusing for input
 * 
 * @param {string} id of input
 */
function focusInput(id) {
    if (document.getElementById(id) != null) document.getElementById(id).focus(); // Setzt den Fokus auf das Eingabefeld
}


/**
 * 
 * add subtask
 * 
 */
function addSubtask() {

    noEditArea();

    const subtask = document.getElementById('subtask_input');

    if (subtask.value.trim() != "") if (subtaskCollection.length < maxSelectedSubtasks) {

        subtaskCollection.push({ task: subtask.value, edit: false, done: false });

        if (subtaskCollection.length == maxSelectedSubtasks) subtask.placeholder = `${maxSelectedSubtasks} already exist!`;

        renderAllSubtasks();
        scrollSubtasksToEnd();
    }

    subtask.value = "";
}


/**
 * 
 * render all subtasks
 * 
 */
function renderAllSubtasks() {

    document.getElementById('render_subtasks').innerHTML = "";
    let index = 1;

    subtaskCollection.forEach((task) => {

        if (!task.edit) { document.getElementById('render_subtasks').innerHTML += subtaskTemplate(task.task, index) } else {

            document.getElementById('render_subtasks').innerHTML += subtaskEditTemplate(task.task, index);
        }

        index++;
    });
}


/**
 * 
 * scroll subtasks view to end
 * 
 */
function scrollSubtasksToEnd() {

    setTimeout(() => {

        const element = document.getElementById(`id_subtask${subtaskCollection.length}`);
        element.parentNode.scrollTop = element.parentNode.scrollHeight;
    }, 200);
}


/**
 * 
 * delete subtask from list
 * 
 */
function deleteSubtaskFromList(index) {

    subtaskCollection.splice(index - 1, 1);

    noEditArea();
    document.getElementById('subtask_input').placeholder = `Add  new subtask`;
}


/**
 * 
 * edit subtask from list
 * 
 */
function editSubtaskFromList(text, index) {

    subtaskCollection.forEach(subtask => { subtask.edit = false; });
    subtaskCollection[index - 1].edit = true;

    renderAllSubtasks();
    setTimeout(() => {

        document.getElementById(`input_on_edit${index}`).value = text;
        focusInput(`input_on_edit${index}`);

    }, 150);
}


/**
 * 
 * no edit view for all subtasks
 * 
 */
function noEditArea() {

    subtaskCollection.forEach(subtask => {
        subtask.edit = false;
    });

    renderAllSubtasks();
}


/**
 * 
 * enter pressed on edit subtask
 * 
 */
function enterPressedOnEditSubtask(event, text, ref) {

    if (event.key === "Enter") {

        event.preventDefault(); // Verhindert das Absenden des Formulars

        if (ref.value != "") {

            let subtaskToEdit = subtaskCollection.find(item => item.task === text);
            subtaskToEdit.task = ref.value;

            noEditArea();
        }
    }
}


/**
 * 
 * aplly change on subtask edit
 * 
 */
function applyChangeOnSubtaskEdit(text, index) {

    const inputValue = document.getElementById(`input_on_edit${index}`).value;

    if (inputValue != "") {

        let subtaskToEdit = subtaskCollection.find(item => item.task === text);
        subtaskToEdit.task = inputValue;
    }

    noEditArea();
}


/**
 * 
 * Function called when Enter is pressed - add subtask
 * 
 */
function enterPressed(event) {

    if (event.key === "Enter") {

        event.preventDefault(); // Verhindert das Absenden des Formulars
        addSubtask();
    }
}



/* ------------------------------------------------------------------------------------------ */



/**
 * 
 * This function moves the cursor to the end of the input after any input changes
 * 
 */
function handleInput(event) {
    const inputElement = event.target;
    let value = inputElement.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    // Format the value (DD/MM/YYYY)
    const formatValue = (val) => {
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
        if (val.length > 5) val = val.slice(0, 5) + '/' + val.slice(5);
        return val;
    };

    inputElement.value = formatValue(value);

    // Move cursor to the end of input after formatting
    setTimeout(() => inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length), 0);
}


/**
 * 
 * This function ensures the cursor always moves to the end of the input when clicking inside the field
 * 
 */
function moveCursorToEnd(event) {
    const inputElement = event.target;

    // Set cursor position to the end of the input
    setTimeout(() => inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length), 0);
}





/**
 * 
 * Format value as DD/MM/YYYY
 * 
 */
function formatValue(val) {
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    if (val.length > 5) val = val.slice(0, 5) + '/' + val.slice(5);
    return val;
}


/**
 * 
 * Move cursor to a specific position after the event loop
 * 
 */
function moveCursor(inputElement, pos) {
    setTimeout(() => inputElement.setSelectionRange(pos, pos), 0);
}


/**
 * 
 * Handle left arrow key press in the year field
 * 
 */
function handleLeftArrowYear(inputElement, value) {
    value = value.slice(0, 4); // Remove the year portion
    inputElement.value = formatValue(value);
    moveCursor(inputElement, 5); // Move cursor to end of month input
}


/**
 * 
 * Handle left arrow key press in the month field
 * 
 */
function handleLeftArrowMonth(inputElement, value) {
    value = value.slice(0, 2); // Remove the month portion
    inputElement.value = formatValue(value);
    moveCursor(inputElement, 2); // Move cursor to end of day input
}


/**
 * 
 * Handle left arrow key press in the day field
 * 
 */
function handleLeftArrowDay(inputElement) {
    inputElement.value = ""; // Clear the entire input
    moveCursor(inputElement, 0); // Move cursor to start
}


/**
 * 
 *  Main function to handle key down events
 * 
 */
function handleKeyDown(event) {

    const inputElement = event.target;
    const cursorPos = inputElement.selectionStart;
    let value = inputElement.value.replace(/[^0-9]/g, ''); // Get only numbers

    if (event.key === 'ArrowUp') event.preventDefault();
    if (event.key === 'ArrowLeft') {

        if (cursorPos > 5 && cursorPos <= 10) {
            handleLeftArrowYear(inputElement, value);
        } else if (cursorPos > 2 && cursorPos <= 5) {
            handleLeftArrowMonth(inputElement, value);
        } else if (cursorPos <= 2) {
            handleLeftArrowDay(inputElement);
        }
        event.preventDefault();
    }
}


/* ------------------------------------------------------------------------------------------ */


// start - document.getElementById('input_due_date').addEventListener('paste', function(event) { event.preventDefault() });



/**
 * 
 *  Main function for due date input
 * 
 */
function DDMMYYYY(value, event) {

    let cursorPosition = event.target.selectionStart;
    if (cursorPosition == 11) return value.slice(0, -1);

    let newValue = value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');

    if (!event.data) return value;

    if (cursorPosition == 3 || cursorPosition == 6) cursorPosition++;
    newValue = yearMonthDayAdjustment(value, newValue, cursorPosition, event);

    const dayOrMonth = (index) => index % 2 === 1 && index < 4;

    return newValue.split('').map((v, i) => dayOrMonth(i) ? v + '/' : v).join('');
}


/**
 * 
 *   year, month, day adjustment for due date input
 * 
 */
function yearMonthDayAdjustment(value, newValue, cursorPosition, event) {

    if (value.length >= 7 && cursorPosition >= 7 && cursorPosition < value.length) {

        newValue = newValue.slice(0, (cursorPosition - 2)) + newValue.slice((cursorPosition - 2) + 1);
        setCursor(event, cursorPosition);
    }

    if (value.length >= 4 && cursorPosition >= 4 && cursorPosition < 6 && cursorPosition < value.length) {

        newValue = newValue.slice(0, (cursorPosition - 1)) + newValue.slice((cursorPosition - 1) + 1);
        setCursor(event, cursorPosition);
    }

    if (value.length >= 1 && cursorPosition >= 1 && cursorPosition < 3 && cursorPosition < value.length) {

        newValue = newValue.slice(0, (cursorPosition)) + newValue.slice((cursorPosition) + 1);
        setCursor(event, cursorPosition);
    }

    return newValue;
}


/**
 * 
 *   set cursor for year, month, day adjustment
 * 
 */
function setCursor(event, cursorPosition) {

    event.target.style.caretColor = 'transparent';
    setTimeout(() => { event.target.setSelectionRange(cursorPosition, cursorPosition); event.target.style.caretColor = 'auto' }, 1);
}


/**
 * 
 *   handle key down for due date input
 * 
 */
function handleKeyDownDueDate(event, value) {

    if (event.target.selectionStart !== event.target.selectionEnd) {

        event.target.selectionStart = event.target.selectionEnd;
        event.target.setSelectionRange(event.target.selectionStart - 1, event.target.selectionStart - 1);
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {

        event.preventDefault();
        event.target.setSelectionRange(event.target.selectionStart - 1, event.target.selectionStart - 1);
    }

    if (event.key === ' ') {

        event.preventDefault();
        event.target.setSelectionRange(event.target.selectionStart + 1, event.target.selectionStart + 1);
    }

    if ((event.ctrlKey && event.key === 'v') || (event.key === 'F10' && event.shiftKey)) event.preventDefault();
}


/* ------------------------------------------------------------------------------------------ */



















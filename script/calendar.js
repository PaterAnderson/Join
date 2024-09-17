var picker;

function setDate() {
    var calendarDiv = createCalendarContainer(); // Create the calendar container with innerHTML
    initializeDatePicker(calendarDiv); // Initialize the date picker using the created div
}

function createCalendarContainer() {
    var container = document.getElementById('calendar-container');

    // Set innerHTML to create the calendar display div directly
    container.innerHTML = '<div id="calendar"></div>';

    // Return the created div for further use
    return document.getElementById('calendar');
}

function initializeDatePicker(calendarDiv) {

    picker = new Pikaday({
        field: calendarDiv, // Attach the calendar to the div, not an input field
        bound: false, // Allows the calendar to be displayed inline
        format: 'MM/DD/YYYY',
        firstDay: 1, // Monday as first day of the week
        i18n: {
            previousMonth: 'Previous',
            nextMonth: 'Next',
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        onSelect: function () { convertFormat(picker.getDate()) }
    });
}

function destroyDatePicker() {

    picker.destroy(); // Pikaday-Kalender zerstören
    picker = null; // Variable leeren, um spätere Fehler zu vermeiden
}

function convertFormat(date) {

    if (!date) { console.log("No date selected."); return }

    // Extract day, month, and year from the Date object
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    var year = date.getFullYear();

    var formattedDate = `${day}/${month}/${year}`;
    setTimeout(() => changeTheValueOfDueDate(formattedDate), 250)
    setTimeout(() => destroyDatePicker(), 400);
}

function changeTheValueOfDueDate(date) {

    document.getElementById('input_due_date').value = date;
    closeCalendar();
}

function calendarOnClick() {

    setDate();
    duePrioRef = document.getElementById('due_prio');
    calendarContainerRef = document.getElementById('calendar-container');

    duePrioRef.style = "opacity: 0";
    calendarContainerRef.classList.add('calendar-container2');
}

function closeCalendar() {

    duePrioRef = document.getElementById('due_prio');
    calendarContainerRef = document.getElementById('calendar-container');

    duePrioRef.style = "opacity: 1";
    calendarContainerRef.classList.remove('calendar-container2');
}
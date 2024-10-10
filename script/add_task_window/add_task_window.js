
let toggle1 = false;
let toggle2 = false;
let prio = 'medium';
let selectedCategory = "";

let maxSelectedSubtasks = 10;
let subtaskCollection = [];

let selectedContacts = [];
let allContactNames = [];
let maxSelectedContacts = 5;
let currentNumberOfSelectedContacts = 0;
let numberOfContactsDropdownMenu = 3;

if (!sessionStorage.getItem('user')) window.location.href = '../index.html';


/**
 * 
 * function is called at start
 * 
 */
function onloadstart() {

    fetchAllContactNames();
    renderContacts();

    document.getElementById('input_due_date').addEventListener('paste', function(event) { event.preventDefault() });    
}


/**
 * 
 * function is called when clicking on body   
 * 
 */
function bodyOnClick() {

    closeContactsList();
    closeCategory();
    noEditArea();
    closeCalendar();
}


/**
 * 
 * function is called when you click on create task
 * 
 */
function createTaskClick() {

    checkInputsInInputs1();
}


/**
 * 
 * fetch all contact names
 * 
 */
const fetchAllContactNames = async () => {

    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) { console.error("Fehler beim Laden der Kontakte:", response.status); return }

        const kontakte = await response.json();
        if (!kontakte || Object.keys(kontakte).length === 0) { numberOfContactsDropdownMenu = 1; return }

        // Extrahiere alle Kontaktnamen und füge für jeden Kontakt ein `checked: false` Attribut hinzu
        allContactNames = Object.values(kontakte).map(kontakt => ({
            name: kontakt.name,
            checked: false
        }));

    } catch (error) { console.error("Fehler beim Abrufen der Kontaktnamen:", error) }
};


/**
 * 
 * function is called when opening the contact list
 * 
 */
function openContactsList() {

    document.getElementById('list_of_contacts_outside').classList.remove('z-1');
    document.getElementById('list_of_contacts_outside').classList.add('z1');

    document.getElementById('contacts_list').placeholder = "";
    document.getElementById('list_of_contacts').classList.add('list-of-contacts2');
    document.getElementById('assign_arrow').src = "../assets/icons/arrow_drop_up.png";
    toggle1 = true;

    setTimeout(() => document.getElementById('list_of_contacts_outside').style = "overflow: visible;", 200);

    numberOfContactsDisplayedInDropdownMenu(numberOfContactsDropdownMenu);
}


/**
 * 
 * function is called when closing the contact list
 * 
 */
function closeContactsList() {

    setTimeout(() => {
        document.getElementById('list_of_contacts_outside').classList.remove('z1');
        document.getElementById('list_of_contacts_outside').classList.add('z-1');
    }, 200);

    document.getElementById('contacts_list').placeholder = "Select contacts to assign";

    document.getElementById('list_of_contacts').classList.remove('list-of-contacts2');
    document.getElementById('assign_arrow').src = "../assets/icons/arrow_drop_down.png";
    toggle1 = false;

    document.getElementById('list_of_contacts_outside').style = "";

    numberOfContactsDisplayedInDropdownMenu(3);
}


/**
 * 
 * function is called to close and open alternately
 * 
 */
function toggleShowContacts() {

    if (toggle1) { closeContactsList() } else { openContactsList(); focusInput('contacts_list') }
}


/**
 * function is called to change the size of dropdownmenu
 * 
 * @param {number} number 
 */
function numberOfContactsDisplayedInDropdownMenu(number) {

    if (number == 1 || number == 0) {

        document.getElementById('list_of_contacts').style = "display: flex; flex-direction: column; justify-content: end; height: 102px; transform: translateY(-104px)";

    } else if (number == 2) {

        document.getElementById('list_of_contacts').style = "display: flex; flex-direction: column; justify-content: end; height: 160px; transform: translateY(-45px)";

    } else {

        document.getElementById('list_of_contacts').style = "";
    }
};


/**
 * 
 * Funktion, um die Kontaktdaten vom Server abzurufen
 * 
 */
const fetchContacts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);

        if (!response.ok) {
            console.error("Fehler beim Laden der Kontakte:", response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
        return null;
    }
};


/**
 * Funktion, um die Initialen zu berechnen
 * 
 * @param {string} name
 */
const calculateInitials = (name) => {
    const [firstName, lastName] = name.split(' ');
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

/**
 * Funktion, um den Status eines Kontakts zu prüfen
 * 
 * @param {string} name
 */
const checkContactStatus = (kontakt) => {
    const matchingContact = allContactNames.find(c => c.name === kontakt.name);
    return matchingContact && matchingContact.checked ? "checked" : "";
};

/**
 * 
 * Funktion, um das HTML für einen einzelnen Kontakt zu erstellen
 * 
 */
const renderSingleContact = (kontakt, index, initialen, statusClass, statusSrc) => {
    return renderContactsTemplate(statusClass, index, kontakt, initialen, statusSrc);
};

/**
 * Funktion, um das HTML für alle Kontakte vorzubereiten
 * 
 * @param {string}
 */
const prepareHTMLForContacts = (kontakte) => {
    let htmlContent = "";
    let index = 1;

    Object.values(kontakte).forEach(kontakt => {
        const initialen = calculateInitials(kontakt.name);
        const statusClass = checkContactStatus(kontakt);
        const statusSrc = statusClass === "checked" ? "checked" : "unchecked";

        htmlContent += renderSingleContact(kontakt, index, initialen, statusClass, statusSrc);
        index++;
    });

    numberOfContactsDropdownMenu = index - 1;
    return htmlContent;
};

/**
 * 
 * Hauptfunktion zum Rendern der Kontakte
 * 
 */
const renderContacts = async () => {
    const kontakte = await fetchContacts();
    if (!kontakte) return;

    const container = document.getElementById("contactsContainer");
    const htmlContent = prepareHTMLForContacts(kontakte);

    container.innerHTML = htmlContent;
};


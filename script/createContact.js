const CONTACT_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${sessionStorage.getItem('user')}/contacts`;
let users = []; // Hier speichern wir alle unsere Kontakte




/* 
let overlayMenu;


function contactsPageStart() {

    changeBackgroundOfBodyByShowMenuForMobile();
}

function changeBackgroundOfBodyByShowMenuForMobile() {

    overlayMenu = document.querySelector('.overlay-menu');
    const observer = new MutationObserver(updateBodyBackground);
    observer.observe(overlayMenu, { attributes: true });

    updateBodyBackground();
}

function updateBodyBackground() {

    const body = document.body;
    const screenWidth = window.innerWidth;

    if (screenWidth < 600 && overlayMenu.classList.contains('show-overlay-menu')) {

        body.style.backgroundColor = '#F6F7F8';

    } else body.style.backgroundColor = '';
}
 */




let overlayMenu;
let mutationObserver;


function contactsPageStart() {

    changeBackgroundOfBodyByShowMenuForMobile();

    window.addEventListener('resize', updateBodyBackground);
}


function changeBackgroundOfBodyByShowMenuForMobile() {

    overlayMenu = document.querySelector('.overlay-menu');
    
    if (mutationObserver) {
        mutationObserver.disconnect(); // Sicherstellen, dass kein doppelter Observer läuft.
    }

    mutationObserver = new MutationObserver(updateBodyBackground);
    mutationObserver.observe(overlayMenu, { attributes: true, attributeFilter: ['class'] });

    updateBodyBackground();
}

function updateBodyBackground() {

    const body = document.body;
    const screenWidth = window.innerWidth;

    if (screenWidth <= 600 && overlayMenu.classList.contains('show-overlay-menu')) {

        body.style.backgroundColor = '#F6F7F8';
        document.querySelector('.edit-mobile').style = "";
        document.querySelector('.add-contact-mobile').style = "display: none";

    } else { 
        
        body.style.backgroundColor = ''; 
        document.querySelector('.edit-mobile').style = "display: none";
        document.querySelector('.add-contact-mobile').style = "";

        closeEditDeleteMobileDropdownMenu();
    }
}





















function getRandomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

function testPOST(event) {


    console.log('testPost');




    event.preventDefault(); // Verhindere das Standard-Formularverhalten (Seitenneu laden)
    const name = getInputValue("name");
    const email = getInputValue("email");
    const telefonnummer = getInputValue("phone");

    const nameWarning = document.getElementById("name-warning");
    nameWarning.style.display = "none"; // Verstecke die Warnung zu Beginn
    if (!isValidName(name)) {
        nameWarning.style.display = "block"; // Zeige die Warnung an
        nameWarning.textContent = "Bitte gib mindestens einen Vor- und Nachnamen ein.";
        return; // Stoppe die Funktion hier
    }
    if (isAllFieldsFilled(email, telefonnummer)) {
        const newContact = createContact(name, email, telefonnummer);
        addContact(newContact);
        postContactData(newContact);
    } else {
        console.error("Bitte fülle alle Felder aus.");
    }
    closeDialog();
}

function getInputValue(inputId) {
    return document.getElementById(inputId).value;
}

function isValidName(name) {
    return name.split(" ").length >= 2;
}

function isAllFieldsFilled(email, telefonnummer) {
    return email && telefonnummer;
}

function createContact(name, email, telefonnummer) {
    const newContactId = generateRandomId();
    return {
        id: newContactId,
        name: name,
        email: email,
        farbe: getRandomColor(),
        telefonnummer: telefonnummer
    };
}

function postContactData(contact) {
    postData(contact)
        .then(response => {
            console.log("Kontakt erfolgreich hinzugefügt:", response);
            document.getElementById("contact_form").reset();
            location.reload();
        })
        .catch(error => {
            console.error("Fehler beim Hinzufügen des Kontakts:", error);
        });
}

function generateRandomId() {
    return 'id-' + Math.random().toString(36).substr(2, 9); // Generiert eine zufällige ID
}

function addContact(contact) {
    if (!users.some(user => user.name === contact.name)) {
        users.push(contact);
    } else {
        console.log("Kontakt bereits vorhanden:", contact.name);
    }
}

async function postData(contact) {
    // Verwende die ID des Kontakts für den Pfad
    let response = await fetch(`${CONTACT_URL}/${contact.id}.json`, {
        method: "PUT", // Ändere dies auf PUT, um den Kontakt mit der ID zu erstellen
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contact)
    });

    const responseToJson = await response.json();
    return responseToJson;
}

async function updateContact(contact) {

    console.log("Aktualisiere Kontakt mit ID:", contact.id); // Testausgabe

    const contactPath = encodeURIComponent(contact.name);


    let response = await fetch(`${CONTACT_URL}/${contactPath}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contact)
    });

    const responseToJson = await response.json();
    console.log("Update Response:", responseToJson); // Testausgabe
    return responseToJson;
}

async function deleteContact(contactId) {

    closeDialog();
    closeMenu();

    try {
        const response = await sendDeleteRequest(contactId);
        handleDeleteResponse(response, contactId);
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}

async function sendDeleteRequest(contactId) {
    return await fetch(`${CONTACT_URL}/${contactId}.json`, {
        method: "DELETE",
    });
}

function handleDeleteResponse(response, contactId) {
    if (response.ok) {
        console.log(`Kontakt mit ID ${contactId} erfolgreich gelöscht.`);
        refreshContacts();
    } else {
        console.error("Fehler beim Löschen des Kontakts:", response.statusText);
    }
}

async function refreshContacts() {
    await getAllContacts("/contacts");
    renderContacts();
    closeDialog();
    closeMenu();
}


/**
 * edit contact, save clicked
 * 
 * @param {Array} contact 
 */
async function handleUpdateContact(contact) {
    updateContactValues(contact);
    const updatedContact = createUpdatedContact(contact);

    await updateContact(updatedContact);
    closeDialog();
    await refreshContacts();
}

function updateContactValues(contact) {
    contact.name = getInputValue("edit-name").trim();
    contact.email = getInputValue("edit-email").trim();
    contact.telefonnummer = getInputValue("edit-phone").trim();
}

function createUpdatedContact(contact) {
    const existingColor = contact.farbe; // Bestehende Farbe speichern
    return {
        ...contact,
        farbe: existingColor // Setze die vorhandene Farbe wieder ein
    };
}

async function refreshContacts() {
    await getAllContacts("/contacts");
    renderContacts();
    closeMenu();
}

function getInputValue(inputId) {
    return document.getElementById(inputId).value;
}

function resetInputFields() {
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("phone").value = '';
}

function showCreateMenu() {
    return `
        <div class="close" onclick="closeDialog(), stopProp(event)">
            <div class="close-button"></div>
        </div>
        <div>
            <img class="new-user" src="../assets/icons/contacts_add_contact_empty_profile.svg">
        </div>
        <div class="content">
            <div class="input-fields2" id="ContactForm">
                <div class="input-outside" onclick="focusInput('name')">
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="name" maxlength="30" type="text" required placeholder="Name" autocomplete="on" />
                    <img src="../assets/icons/contacts_edit_person.svg" alt="">
                </div>
                <div id="name-warning" class="warning-message"></div>
                <div class="input-outside" onclick="focusInput('email')">
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="email" maxlength="30" type="email" required placeholder="Email" autocomplete="on" />
                    <img src="../assets/icons/contacts_edit_mail.svg" alt="">
                </div>
                <div class="input-outside2" onclick="focusInput('phone')">
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="phone" maxlength="30" type="tel" required placeholder="Phone" autocomplete="on" />
                    <img src="../assets/icons/contacts_edit_call.svg" alt="">
                </div>
            </div>
        </div>
        <div class="buttons2">
            <div class="button-settings">
                <button onclick="resetInputFields()" type="button" class="cancel-button">Cancel
                    <img class="cancel2" src="../assets/icons/contacts_add_contact_cancel.svg">
                </button>
                <button type="submit" class="create-button">Create contact
                    <img class="create-img" src="../assets/icons/contacts_edit_check.svg">
                </button>
            </div>
        </div>
    `;
}


function editDeleteMobileButtonClicked() {

    document.querySelector('.edit-mobile-dropdown').style = "transform: translateX(0px)";
}


function closeEditDeleteMobileDropdownMenu() {

    document.querySelector('.edit-mobile-dropdown').style = "";
}


function editMobileClicked() {

    document.querySelector('.hover-container').click();
}
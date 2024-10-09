const CONTACT_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${sessionStorage.getItem('user')}/contacts`;


const TASKS_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${sessionStorage.getItem('user')}/tasks`;




//let users = []; // Hier speichern wir alle unsere Kontakte




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


/* 
function getRandomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}
 */

function getRandomColor() {

    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return randomColor;
}








/**
 * 
 *   funktion called from form button type submit, edit or create contact
 * 
 */
function testPOST(event) {


    console.log('testPost');


    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!isValidName(name) || name == "") { document.querySelector(".name-warning").textContent = "Please enter at least a first and last name."; return }
    if (!isValidEmail(email) || email == "") { document.querySelector(".mail-warning").textContent = "Invalid email address. Please enter a valid email."; return }
    if (!isValidPhone(phone) || phone == "") { document.querySelector(".phone-warning").textContent = "Please enter a valid phone number with 7 to 15 digits."; return }

    const newContact = createContact(name, email, phone);


    if (!contactAlreadyExists(newContact)) { document.querySelector(".name-warning").textContent = "Contact already exists. Please use a different contact."; return }



    postContactData(newContact);

    closeDialog();

}

function hideTextWarning(textField) {

    document.querySelector(textField).textContent = "";
}

function showCreatedContactInfo(name) {

    const contactContainer = document.querySelector('.contact-container');
    const contactsDiv = document.querySelectorAll('.single-contact');

    contactsDiv.forEach(contact => {

        if (contact.innerText.includes(name)) {

            const contactPosition = contact.offsetTop - 158;
            contactContainer.scrollTop = contactPosition;
            setTimeout(() => contact.click(), 1000);
        }
    });
}





//function getInputValue(inputId) {
//    return document.getElementById(inputId).value;
//}


function isValidName(name) {
    return name.split(" ").length >= 2;
}

function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPhone(phone) {

    const phonePattern = /^\+?[0-9]{7,15}$/;
    return phonePattern.test(phone);
}



//function isAllFieldsFilled(email, telefonnummer) {
//    return email && telefonnummer;
//}


/**
 * 
 *   create contact
 * 
 */
function createContact(name, email, phone) {

    let farbe;
    if (document.querySelector('.edit-or-add').src.includes('_210')) { farbe = getRandomColor() } else farbe = contactFarbe;

    return {
        name: name,
        email: email,
        farbe: farbe,
        telefonnummer: phone
    };
}




//function generateRandomId() {
//    return 'id-' + Math.random().toString(36).substr(2, 9); // Generiert eine zufällige ID
//}



function postContactData(contact) {

    postData(contact)
        .then(response => {
            console.log("Kontakt erfolgreich hinzugefügt:", response);

            //document.getElementById("contact_form").reset();
            //location.reload();

            onloadFunc();

            setTimeout(showCreatedContactInfo, 100, response.name);

            if (document.querySelector('.edit-or-add').src.includes('_210') || (document.querySelector('.edit-or-add').src.includes('_211') && (nameForEdit != contact.name))) {

                setTimeout(() => document.querySelector('.contact-created').classList.add('show-contact-created'), 1100);
                setTimeout(() => document.querySelector('.contact-created').classList.remove('show-contact-created'), 3000);
            }
        })
        .catch(error => { console.error("Fehler beim Hinzufügen des Kontakts:", error) });
}


/**
 * 
 * contact already exists ? - for edit or create contact
 * 
 */
function contactAlreadyExists(contact) {

    const editOrAdd = document.querySelector('.edit-or-add').src;

    if (!contacts.some(user => user.name === contact.name) || editOrAdd.includes('_211')) {

        //users.push(contact);
        return true;

    } else {
        console.log("Kontakt bereits vorhanden:", contact.name);
        return false;
    }
}


/**
 * 
 *   post data
 * 
 */
async function postData(contact) {

    const contactPath = encodeURIComponent(contact.name);

    let response = await fetch(`${CONTACT_URL}/${contactPath}.json`, {
        method: "PUT", 
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

/*--------------------------------------------------------*/

async function deleteContact(contactId) {

    closeDialog();
    closeMenu();

    try {
        const response = await sendDeleteRequest(contactId);
        handleDeleteResponse(response, contactId);

        await removeContactFromAssigned(contactId);

    } catch (error) { console.error("Fehler beim Löschen des Kontakts:", error) }
}

async function sendDeleteRequest(contactId) {

    return await fetch(`${CONTACT_URL}/${contactId}.json`, { method: "DELETE" });
}

function handleDeleteResponse(response, contactId) {

    if (response.ok) {
        console.log(`Kontakt mit ID ${contactId} erfolgreich gelöscht.`);
        refreshContacts();

    } else { console.error("Fehler beim Löschen des Kontakts:", response.statusText) }
}

/*--------------------------------------------------------*/

// console.log('tasks - ', tasks);

// console.log('assignedContacts - ', assignedContacts);

// console.log('updatedAssignedContacts - ', updatedAssignedContacts);




async function removeContactFromAssigned(contactId) {

    const tasksUrl = `${TASKS_URL}.json`;

    try {
        const tasksResponse = await fetch(tasksUrl);
        const tasks = await tasksResponse.json();
        if (!tasks) return;  // Keine Aufgaben vorhanden


        console.log('tasks - ', tasks);


        for (const [taskId, task] of Object.entries(tasks)) {

            const assignedContacts = task.assigned || [];


            console.log('assignedContacts - ', assignedContacts);


            const updatedAssignedContacts = assignedContacts.filter(contactObj => contactObj.contact !== contactId);


            console.log('updatedAssignedContacts - ', updatedAssignedContacts);


            // Wenn sich das 'assigned'-Array geändert hat, aktualisieren
            if (updatedAssignedContacts.length !== assignedContacts.length) { await updateTaskAssigned(taskId, updatedAssignedContacts) }
        }

        console.log(`Kontakt mit ID ${contactId} wurde aus allen 'assigned'-Listen entfernt.`);

    } catch (error) { console.error("Fehler beim Entfernen des Kontakts aus 'assigned'-Listen:", error) }
}

async function updateTaskAssigned(taskId, updatedAssignedContacts) {

    const taskUrl = `${TASKS_URL}/${taskId}/assigned.json`;

    try {
        await fetch(taskUrl, { method: "PUT", body: JSON.stringify(updatedAssignedContacts) });

        console.log(`Aufgabe ${taskId}: 'assigned'-Liste erfolgreich aktualisiert.`);

    } catch (error) { console.error(`Fehler beim Aktualisieren der Aufgabe ${taskId}:`, error) }
}











async function refreshContacts() {
    await getAllContacts("/contacts");
    renderContacts();
    closeDialog();
    closeMenu();
}



/* 
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
 */



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
    document.querySelector(".name-warning").textContent = "";
    document.querySelector(".mail-warning").textContent = "";
    document.querySelector(".phone-warning").textContent = "";
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
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this), hideTextWarning('.name-warning')" class="input" id="name" maxlength="20" type="text" placeholder="Name" autocomplete="on" />
                    <img src="../assets/icons/contacts_edit_person.svg" alt="">
                </div>
                <div id="name-warning" class="name-warning"></div>

                <div class="input-outside" onclick="focusInput('email')">
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this), hideTextWarning('.mail-warning')" class="input" id="email" maxlength="20" type="text" placeholder="Email" autocomplete="on" />
                    <img src="../assets/icons/contacts_edit_mail.svg" alt="">
                </div>
                <div class="mail-warning"></div>

                <div class="input-outside2" onclick="focusInput('phone')">
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this), hideTextWarning('.phone-warning')" class="input" id="phone" maxlength="20" type="tel" placeholder="Phone" autocomplete="on" />
                    <img src="../assets/icons/contacts_edit_call.svg" alt="">
                </div>
                <div class="phone-warning"></div>

            </div>
        </div>
        <div class="buttons2">
            <div class="button-settings">
                <button type="button" onclick="resetInputFields()" class="cancel-button">Cancel
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
    setTimeout(() => closeEditDeleteMobileDropdownMenu(), 100);
}

function deleteMobileClicked() {

    document.querySelectorAll('.hover-container')[1].click();
    setTimeout(() => closeEditDeleteMobileDropdownMenu(), 100);
}


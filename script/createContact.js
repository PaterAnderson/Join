const CONTACT_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${sessionStorage.getItem('user')}/contacts`;
const TASKS_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${sessionStorage.getItem('user')}/tasks`;

let overlayMenu;
let mutationObserver;


/**
 * 
 * function called by body onload
 * 
 */
function contactsPageStart() {

    changeBackgroundOfBodyByShowMenuForMobile();
    window.addEventListener('resize', updateBodyBackground);
}


/**
 * 
 * change background of body by show menu for mobile
 * 
 */
function changeBackgroundOfBodyByShowMenuForMobile() {

    overlayMenu = document.querySelector('.overlay-menu');

    if (mutationObserver) {
        mutationObserver.disconnect(); // Sicherstellen, dass kein doppelter Observer läuft.
    }

    mutationObserver = new MutationObserver(updateBodyBackground);
    mutationObserver.observe(overlayMenu, { attributes: true, attributeFilter: ['class'] });

    updateBodyBackground();
}


/**
 * 
 * update body background for mobile
 * 
 */
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


/**
 * 
 *  get random color
 * 
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


/**
 * 
 * hide text warning(error)
 * 
 */
function hideTextWarning(textField) {

    document.querySelector(textField).textContent = "";
}


/**
 * 
 * show created contact info
 * 
 */
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


/**
 * 
 * is vaild name ?
 * 
 */
function isValidName(name) {
    return name.split(" ").length >= 2;
}


/**
 * 
 * is vaild email ?
 * 
 */
function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


/**
 * 
 * is vaild phone number ?
 * 
 */
function isValidPhone(phone) {

    const phonePattern = /^\+?[0-9]{7,15}$/;
    return phonePattern.test(phone);
}


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


/**
 * 
 * post contact data 
 * 
 */
function postContactData(contact) {

    postData(contact)
        .then(response => {
            console.log("Kontakt erfolgreich hinzugefügt:", response);


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


/**
 * 
 * update contact
 * 
 */
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

/**
 * 
 * delete contact
 * 
 */
async function deleteContact(contactId) {

    closeDialog();
    closeMenu();

    try {
        const response = await sendDeleteRequest(contactId);
        handleDeleteResponse(response, contactId);

        await removeContactFromAssigned(contactId);

    } catch (error) { console.error("Fehler beim Löschen des Kontakts:", error) }
}


/**
 * 
 * send delete request
 * 
 */
async function sendDeleteRequest(contactId) {

    return await fetch(`${CONTACT_URL}/${contactId}.json`, { method: "DELETE" });
}


/**
 * 
 * handle delete response
 * 
 */
function handleDeleteResponse(response, contactId) {

    if (response.ok) {

        console.log(`Kontakt mit ID ${contactId} erfolgreich gelöscht.`);
        refreshContacts();

    } else { console.error("Fehler beim Löschen des Kontakts:", response.statusText) }
}

/*--------------------------------------------------------*/


/**
 * 
 * remove contact from all tasks in assigned
 * 
 */
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

    } catch (error) { console.error("Fehler beim Entfernen des Kontakts aus 'assigned'-Listen:", error) }
}


/**
 * 
 * update task assigned
 * 
 */
async function updateTaskAssigned(taskId, updatedAssignedContacts) {

    const taskUrl = `${TASKS_URL}/${taskId}/assigned.json`;

    try {
        await fetch(taskUrl, { method: "PUT", body: JSON.stringify(updatedAssignedContacts) });

        console.log(`Aufgabe ${taskId}: 'assigned'-Liste erfolgreich aktualisiert.`);

    } catch (error) { console.error(`Fehler beim Aktualisieren der Aufgabe ${taskId}:`, error) }
}

/*--------------------------------------------------------*/






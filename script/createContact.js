const CONTACT_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/guest/contacts";
let users = []; // Hier speichern wir alle unsere Kontakte

function getRandomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

function testPOST(event) {
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
    let response = await fetch(`${CONTACT_URL}/${contact.id}.json`, {
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

async function handleUpdateContact(contact) {
    updateContactValues(contact);
    const updatedContact = createUpdatedContact(contact);
    
    await updateContact(updatedContact);
    closeDialog();
    await refreshContacts();
}

function updateContactValues(contact) {
    contact.name = getInputValue("edit-name");
    contact.email = getInputValue("edit-email");
    contact.telefonnummer = getInputValue("edit-phone");
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
        <div class="close">
            <img onclick="closeDialog()" class="close-button" src="../assets/img/close.svg">
        </div>
        <div>
            <img class="new-user" src="../assets/img/emtpy_profile.svg">
        </div>
        <div class="content">
            <div class="input-fields" id="ContactForm">
                <div class="input-outside">
                    <input class="input" id="name" maxlength="30" type="text" required placeholder="Name" autocomplete="on" />
                    <img src="../assets/img/person.svg" alt="">
                </div>
                <div id="name-warning" class="warning-message"></div>
                <div class="input-outside2">
                    <input class="input" id="email" maxlength="30" type="email" required placeholder="Email" autocomplete="on" />
                    <img src="../assets/img/mail.svg" alt="">
                </div>
                <div class="input-outside2">
                    <input class="input" id="phone" maxlength="30" type="tel" required placeholder="Phone" autocomplete="on" />
                    <img src="../assets/img/call.svg" alt="">
                </div>
            </div>
        </div>
        <div class="buttons">
            <div class="button-settings">
                <button onclick="resetInputFields()" type="button" class="cancel-button">Cancel
                    <img class="cancel2" src="../assets/img/close.svg">
                </button>
                <button type="submit" class="create-button">Create contact
                    <img class="create-img" src="../assets/img/check.svg">
                </button>
            </div>
        </div>
    `;
}
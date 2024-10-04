function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

const BASE_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/guest";
let contacts = [];

async function getAllContacts(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  // Hier wird ein Array von Objekten erstellt, die die gewünschten Werte enthalten
  contacts = Object.values(responseToJson).map(user => ({
    id: user.id,
    name: user.name, // oder den tatsächlichen Schlüssel, der den Namen repräsentiert
    email: user.email,
    farbe: user.farbe,
    telefonnummer: user.telefonnummer
  }));

  console.log(contacts); // Ausgabe der Kontakte
}

async function onloadFunc() {
  await getAllContacts("/contacts");
  renderContacts(); // Rendern der Kontakte, nachdem sie geladen wurden
}

// Funktion zum Rendern der Kontakte
function renderContacts() {
  const contactsContainer = document.getElementById("contacts");
  contactsContainer.innerHTML = ""; // Vorherigen Inhalt leeren

  // Kontakte alphabetisch nach Name sortieren
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let currentLetter = ""; // Variable, um den aktuellen Buchstaben zu verfolgen

  // Erstellen Sie HTML-Inhalt für jeden Kontakt und fügen Sie ihn zum Container hinzu
  contacts.forEach(contact => {
    const firstLetter = contact.name.charAt(0).toUpperCase(); // Der erste Buchstabe des Namens

    // Wenn sich der Buchstabe geändert hat, eine Trennlinie hinzufügen
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter; // Buchstaben aktualisieren
      contactsContainer.innerHTML += showAlphabet(currentLetter); // Alphabet trennen
    }

    // Kontakt rendern
    contactsContainer.innerHTML += showContacts(contact);
  });
}

function loadContactInfo(contact) {
  const infoContainer = document.getElementById("menu");
  infoContainer.innerHTML = showContactInfo(contact);
}

// Funktion zur Anzeige des HTML-Codes für jeden Kontakt
function showContacts(contact) {
  let initials = contact.name.charAt(0) + contact.name.split(" ", 2)[1].charAt(0);

  return `
    <div id="background-${contact.id}" onclick='loadContactInfo(${JSON.stringify(contact)}), backgroundChange(this)' class="single-contact">
      <div class="center-content">
        <div style="background-color: ${contact.farbe};" class="contact-circle">${initials}</div>
        <div>
            <h2 class="profile-name">${contact.name}</h2>
            <a class="mail-design2" href="mailto:${contact.email}">${contact.email}</a>
        </div>
      </div>
    </div>
  `;
}

function showAlphabet(letter) {
  return `
    <div class="alphabet">
      <h2>${letter}</h2>
      <hr class="separator">
    </div>
  `;
}

function showContactInfo(contact) {
  let initials = contact.name.charAt(0) + contact.name.split(" ", 2)[1].charAt(0);
  // JSON-String des Kontakts erstellen und Anführungszeichen durch Escape-Zeichen schützen
  let contactStr = JSON.stringify(contact).replace(/"/g, "'").replace(/'/g, "\\'");

  return `
  <div class="info-box">
      <div style="background-color: ${contact.farbe};" class="big-contact-circle" id="contact-circle">${initials}</div>
      <div class="max-width">
          <h1 class="info-name">${contact.name}</h1>
          <div class="sub-buttons">
              <div class="hover-container" onclick="openEditDialog('${contactStr}'); showDialog()">
                  <img class="info-icons" src="../assets/img/edit.svg">
                  <span class="sub-text">Edit</span>
              </div>
              <div class="hover-container" onclick="deleteContact('${contact.id}')">
                  <img class="info-icons gap-8" src="../assets/img/delete.svg">
                  <span class="sub-text">Delete</span>
              </div>
          </div>
      </div>
  </div>
  <div class="contact-info">
      <p class="contact-text">Contact Information</p>
  </div>
  <div class="info-data">
      <p class="custom-text">Email</p>
      <a class="mail-design" href="mailto:${contact.email}">${contact.email}</a>
      <p class="custom-text">Phone</p>
      <a class="phone-design" href="tel:${contact.telefonnummer}">${contact.telefonnummer}</a>
  </div>
  `;
}

function showEditMenu(contact) {
  return `
      <div onclick="closeDialog()" class="close">
          <img class="close-button" src="../assets/img/close.svg">
      </div>
      <div>
          <img class="new-user" src="../assets/img/emtpy_profile.svg">
      </div>
      <div class="content">
          <div class="input-fields" id="ContactForm">
              <div class="input-outside">
                  <input class="input" id="edit-name" maxlength="30" type="text" required placeholder="Name" autocomplete="on" value="${contact.name}" />
                  <img src="../assets/img/person.svg" alt="">
              </div>
              <div class="input-outside2">
                  <input class="input" id="edit-email" maxlength="30" type="email" required placeholder="Email" autocomplete="on" value="${contact.email}" />
                  <img src="../assets/img/mail.svg" alt="">
              </div>
              <div class="input-outside2">
                  <input class="input" id="edit-phone" maxlength="30" type="tel" required placeholder="Phone" autocomplete="on" value="${contact.telefonnummer}" />
                  <img src="../assets/img/call.svg" alt="">
              </div>
          </div>
      </div>
      <div class="buttons">
          <div class="button-settings">
              <button class="delete-button" onclick="deleteContact('${contact.id}')">Delete</button>
              <button type="button" class="save-button" onclick='handleUpdateContact(${JSON.stringify(contact)})'>Save
                  <img class="create-img" src="../assets/img/check.svg">
              </button>
          </div>
      </div>
  `;
}


function openCreateDialog(text) {
  document.getElementById('dialog').classList.remove('d-none');
  document.getElementById('dialog').classList.add('fading-background');
  let CreateDialog = document.getElementById("contact_form");
  CreateDialog.innerHTML=showCreateMenu();
}

function openEditDialog(contactStr) {
  document.getElementById('dialog').classList.remove('d-none');
  let EditDialog = document.getElementById("contact_form");
  let contact = JSON.parse(contactStr.replace(/'/g, '"'));
  EditDialog.innerHTML = showEditMenu(contact);
}

function showDialog() {
  document.getElementById('dialog').classList.add('show-overlay-menu');
}

function closeDialog() {
  document.getElementById('dialog').classList.add('d-none');
  document.getElementById('dialog').classList.remove('show-overlay-menu');
  document.getElementById('dialog').classList.remove('fading-background');
}

function showMenu() {
  document.getElementById('menu').classList.add('show-overlay-menu');
}

function closeMenu() {
  document.getElementById('menu').classList.remove('show-overlay-menu');
}

function backgroundChange(clickedElement) {
  // Hier ist clickedElement die Instanz des geklickten Elements
  const allContainers = document.querySelectorAll("[id^='background-']");
  allContainers.forEach(container => {
    container.classList.remove('background-change');
  });
  clickedElement.classList.add('background-change');
}

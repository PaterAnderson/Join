
const BASE_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${sessionStorage.getItem('user')}`;
let contacts = [];
let contactFarbe;
let contactInitials;


/**
 * 
 * click on the screen
 * 
 */
function backgroundClick() {

  console.log('back click');


  closeDialog();
  closeEditDeleteMobileDropdownMenu();

  closeUserMenu();
}




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





function loadContactInfo(contact, contactRef) {





  const infoContainer = document.getElementById("menu");

  if (contactRef.classList.contains("background-change")) {

    backgroundChangeOff();
    infoContainer.innerHTML = "";
    closeMenu();

  } else {

    showMenu();
    backgroundChange(contactRef);
    infoContainer.innerHTML = showContactInfo(contact);
  }
}

function closeContactInfo() {

  closeMenu();
  backgroundChangeOff();
  const infoContainer = document.getElementById("menu");
  infoContainer.innerHTML = "";
}




function backgroundChangeOff(clickedElement) {
  // Hier ist clickedElement die Instanz des geklickten Elements
  const allContainers = document.querySelectorAll("[id^='background-']");
  allContainers.forEach(container => {
    container.classList.remove('background-change');
  });
}


// Funktion zur Anzeige des HTML-Codes für jeden Kontakt
function showContacts(contact) {
  let initials = contact.name.charAt(0) + contact.name.split(" ", 2)[1].charAt(0);

  return `
    <div id="background-${contact.id}" onclick='loadContactInfo(${JSON.stringify(contact)}, this)' class="single-contact">
      <div class="center-content">
        <div style="background-color: ${contact.farbe};" class="contact-circle">${initials}</div>
        <div>
            <h2 class="profile-name">${contact.name}</h2>
            <a class="mail-design2" ondblclick="location.href='mailto:${contact.email}'" onclick="markEmail(this, '${contact.farbe}'), stopProp(event)">${contact.email}</a>
        </div>
      </div>
    </div>
  `;
}


function markEmail(element, color) {

  element.style = `color: ${color}`;
  setTimeout(() => element.style = "", 250);
}


function stopProp(event) {

  event.stopPropagation();
}

function showAlphabet(letter) {
  return `
    <div class="alphabet">
      <h2>${letter}</h2>
      <img class="separator" src="../assets/icons/separator_contacts_list.svg">
    </div>
  `;
}

function showContactInfo(contact) {
  let initials = contact.name.charAt(0) + contact.name.split(" ", 2)[1].charAt(0);
  // JSON-String des Kontakts erstellen und Anführungszeichen durch Escape-Zeichen schützen
  let contactStr = JSON.stringify(contact).replace(/"/g, "'").replace(/'/g, "\\'");

  contactFarbe = contact.farbe;
  contactInitials = initials;


  console.log('show contact info' + contactStr);
  


  return `
  <div class="info-box">
      <div style="background-color: ${contact.farbe};" class="big-contact-circle" id="contact-circle">${initials}</div>
      <div class="max-width">
          <h1 class="info-name">${contact.name}</h1>
          <div class="sub-buttons">

              <div class="hover-container" onclick="openEditDialog('${contactStr}'), showDialog(), closeUserMenu(), stopProp(event)">
                  <img class="info-icons" src="../assets/icons/contacts_contact_edit.svg">
                  <span class="sub-text">Edit</span>
              </div>

              <div class="hover-container" onclick="deleteContact('${contact.name}')">
                  <img class="info-icons gap-8" src="../assets/icons/contacts_contact_delete.svg" style="width: 17px">
                  <span class="sub-text">Delete</span>
              </div>
          </div>
      </div>
  </div>
  <div class="contact-info">
      <p class="contact-text">Contact Information</p>
  </div>
  <div class="info-data">
      <p class="custom-text" style="margin-top: 34px">Email</p>
      <a class="mail-design" href="mailto:${contact.email}">${contact.email}</a>
      <p class="custom-text" style="margin-top: 28px">Phone</p>
      <a class="phone-design" href="tel:${contact.telefonnummer}">${contact.telefonnummer}</a>
  </div>
  `;
}



//<div>
//<img class="new-user" src="../assets/img/emtpy_profile.svg">
//</img></div>


function showEditMenu(contact) {
  return `
      <div onclick="closeDialog(), stopProp(event)" class="close">
            <div class="close-button"></div>
      </div>

      <div class="big-contact-edit">
        <div style="background-color: ${contactFarbe};" class="big-contact-circle b-c-c-m" id="contact-circle">${contactInitials}</div>
      </div>

      <div class="content">
          <div class="input-fields i-f-m" id="ContactForm">
              <div class="input-outside" onclick="focusInput('edit-name')">
                  <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="edit-name" maxlength="30" type="text" required placeholder="Name" autocomplete="on" value="${contact.name}" />
                  <img src="../assets/icons/contacts_edit_person.svg" alt="">
              </div>
              <div class="input-outside" onclick="focusInput('edit-email')">
                  <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="edit-email" maxlength="30" type="email" required placeholder="Email" autocomplete="on" value="${contact.email}" />
                  <img src="../assets/icons/contacts_edit_mail.svg" alt="">
              </div>
              <div class="input-outside2" onclick="focusInput('edit-phone')">
                  <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="edit-phone" maxlength="30" type="tel" required placeholder="Phone" autocomplete="on" value="${contact.telefonnummer}" />
                  <img src="../assets/icons/contacts_edit_call.svg" alt="">
              </div>
          </div>
      </div>
      <div class="buttons b-m">
          <div class="button-settings">
              <button class="delete-button" onclick="deleteContact('${contact.name}')">Delete</button>
              <button type="submit" class="save-button" >Save
                  <img class="create-img" src="../assets/icons/contacts_edit_check.svg">
              </button>
          </div>
      </div>
  `;
}

// onclick='handleUpdateContact(${JSON.stringify(contact)})'



function openCreateDialog(text) {
  document.getElementById('dialog').classList.remove('d-none');
  document.getElementById('dialog').classList.add('fading-background');
  let CreateDialog = document.getElementById("contact_form");
  CreateDialog.innerHTML = showCreateMenu();
}



function showFrame21x(x) {

  document.querySelector('.edit-or-add').src = `../assets/icons/contacts_frame_21${x}.svg`;

  if (x == 1) { document.querySelector('.flag').style = "" } else { 
    
    document.querySelector('.flag').style = "width: 467px" 
    document.querySelector('.edit-or-add').style = "";
  }

  if (x == 1 && window.innerWidth <= 1000) {

    document.querySelector('.flag').style = "width: 467px";
    document.querySelector('.edit-or-add').style = "top: 112px; right: 112px;";
  }
}



function openEditDialog(contactStr) {


  

  console.log('edit dialog' + contactStr);
  


  showFrame21x(1);

  document.getElementById('dialog').classList.remove('d-none');
  let editDialog = document.getElementById("contact_form");
  let contact = JSON.parse(contactStr.replace(/'/g, '"'));
  editDialog.innerHTML = showEditMenu(contact);
}

function showDialog() {
  document.getElementById('dialog_outer').classList.add('show-overlay-menu');
}

function closeDialog() {
  //document.getElementById('dialog').classList.add('d-none');
  document.getElementById('dialog_outer').classList.remove('show-overlay-menu');
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
 * input onfocus
 * 
 */
function editInputOnfocus(element) {

  element.parentElement.style = "border: 1px solid #29ABE2";
}


/**
 * 
 * input onblur
 * 
 */
function editInputOnblur(element) {

  element.parentElement.style = "";
}
const BASE_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${sessionStorage.getItem('user')}`;
let contacts = [];
let contactFarbe;
let contactInitials;
let nameForEdit;


/**
 * 
 * click on the screen
 * 
 */
function backgroundClick() {

  closeDialog();
  closeEditDeleteMobileDropdownMenu();

  closeUserMenu();
}


/**
 * 
 * get all contacts
 * 
 */
async function getAllContacts(path = "") {

  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  if (!responseToJson) { contacts = []; return }

  contacts = Object.values(responseToJson).map(user => ({

    name: user.name,
    email: user.email,
    farbe: user.farbe,
    telefonnummer: user.telefonnummer
  }));
}


/**
 * 
 * function called by body onload
 * 
 */
async function onloadFunc() {

  await getAllContacts("/contacts");
  renderContacts(); 
}


/**
 * 
 * render contacts
 * 
 */
function renderContacts() {

  const contactsContainer = document.getElementById("contacts");
  contactsContainer.innerHTML = ""; 

  contacts.sort((a, b) => a.name.localeCompare(b.name));  // Kontakte alphabetisch nach Name sortieren

  let currentLetter = ""; // Variable, um den aktuellen Buchstaben zu verfolgen

  // Erstellen Sie HTML-Inhalt für jeden Kontakt und fügen Sie ihn zum Container hinzu
  contacts.forEach(contact => {
    const firstLetter = contact.name.charAt(0).toUpperCase(); // Der erste Buchstabe des Namens

    // Wenn sich der Buchstabe geändert hat, eine Trennlinie hinzufügen
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter; // Buchstaben aktualisieren
      contactsContainer.innerHTML += showAlphabet(currentLetter); // Alphabet trennen
    }

    contactsContainer.innerHTML += showContacts(contact);
  });
}


/**
 * 
 * load(show) contact info 
 * 
 */
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


/**
 * 
 * close contact info
 * 
 */
function closeContactInfo() {

  closeMenu();
  backgroundChangeOff();
  const infoContainer = document.getElementById("menu");
  infoContainer.innerHTML = "";
}


/**
 * 
 * background change - off
 * 
 */
function backgroundChangeOff() {

  const allContainers = document.querySelectorAll(".single-contact");

  allContainers.forEach(container => {
    container.classList.remove('background-change');
  });
}


/**
 * 
 * briefly mark mail in the contact list when clicking
 * 
 */
function markEmail(element, color) {

  element.style = `color: ${color}; scale: 1.015`;
  setTimeout(() => element.style = "", 250);
}


/**
 * 
 * show contact info
 * 
 */
function showContactInfo(contact) {

  let initials = contact.name.charAt(0) + contact.name.split(" ", 2)[1].charAt(0);
  // JSON-String des Kontakts erstellen und Anführungszeichen durch Escape-Zeichen schützen
  let contactStr = JSON.stringify(contact).replace(/"/g, "'").replace(/'/g, "\\'");

  contactFarbe = contact.farbe;
  contactInitials = initials;
  if (!contact.telefonnummer) { phoneNumber = "-------" } else { phoneNumber = contact.telefonnummer }
  
  return showContactInfoTemplate(contact, contactStr, initials, phoneNumber);
}


/**
 * 
 * open create dialog - called from button add new contact
 * 
 */
function openCreateDialog() {

  document.getElementById('dialog').classList.remove('d-none');
  document.getElementById('dialog').classList.add('fading-background');
  let CreateDialog = document.getElementById("contact_form");
  CreateDialog.innerHTML = showCreateMenu();
}


/**
 * 
 * show frame 210 or 211 - for edit or add contact
 * 
 */
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


/**
 * 
 * open edit dialog - called from button edit contact
 * 
 */
function openEditDialog(contactStr) {

  showFrame21x(1);

  document.getElementById('dialog').classList.remove('d-none');
  let editDialog = document.getElementById("contact_form");
  let contact = JSON.parse(contactStr.replace(/'/g, '"'));

  nameForEdit = contact.name;
  editDialog.innerHTML = showEditMenu(contact);
}


/**
 * 
 * show dialog
 * 
 */
function showDialog() {

  document.getElementById('dialog_outer').classList.add('show-overlay-menu');
}


/**
 * 
 * close dialog
 * 
 */
function closeDialog() {

  document.getElementById('dialog_outer').classList.remove('show-overlay-menu');
  document.getElementById('dialog').classList.remove('fading-background');
}


/**
 * 
 * show overlay menu
 * 
 */
function showMenu() {

  document.getElementById('menu').classList.add('show-overlay-menu');
}


/**
 * 
 * close overlay menu
 * 
 */
function closeMenu() {

  document.getElementById('menu').classList.remove('show-overlay-menu');
}


/**
 * 
 * background change for .single-contact
 * 
 */
function backgroundChange(clickedElement) {

  const allContainers = document.querySelectorAll(".single-contact");

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
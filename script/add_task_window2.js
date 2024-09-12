
/**
 * 
 * The main function remains the entry point but delegates the tasks to smaller helper functions.
 * 
 */
const searchContacts = async () => {
    const query = getQuery();

    if (query.length === 0) {
        handleEmptyQuery();
        return;
    }

    try {
        const kontakte = await fetchContacts2();
        const filteredContacts = filterContacts(kontakte, query);
        renderFilteredContacts(filteredContacts);
    } catch (error) {
        handleFetchError(error);
    }
};


// Hilfsfunktionen
/**
 * 
 * Retrieves the user input and converts it to lowercase.
 * 
 */
const getQuery = () => {
    return document.getElementById("contacts_list").value.trim().toLowerCase();
};


/**
 * 
 * Renders all contacts if the search query is empty.
 * 
 */
const handleEmptyQuery = () => {
    setTimeout(() => numberOfContactsDisplayedInDropdownMenu(3), 300);
    renderContacts();
};


/**
 * 
 * Fetches the contacts and throws an error if the request fails.
 * 
 */
const fetchContacts2 = async () => {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Kontakte: ${response.status}`);
    }
    return await response.json();
};


/**
 * 
 * Filters the contacts based on the search query.
 * 
 */
const filterContacts = (kontakte, query) => {
    return Object.values(kontakte).filter(kontakt =>
        kontakt.name.toLowerCase().includes(query)
    );
};


/**
 * 
 * Builds the HTML for the filtered contacts.
 * 
 */
const renderFilteredContacts = (filteredContacts) => {
    const container = document.getElementById("contactsContainer");
    let htmlContent = "";
    let index = 1;

    filteredContacts.forEach(kontakt => {
        const initialen = getInitialen(kontakt);
        const { addClass, addSrc } = getContactStatus(kontakt);

        htmlContent += searchContactsTemplate(addClass, index, kontakt, initialen, addSrc);
        index++;
    });

    numberOfContactsDropdownMenu = index - 1;
    setTimeout(() => numberOfContactsDisplayedInDropdownMenu(numberOfContactsDropdownMenu), 300);
    container.innerHTML = htmlContent;
};


/**
 * 
 * Calculates the initials for a contact.
 * 
 */
const getInitialen = (kontakt) => {
    return `${kontakt.name.charAt(0)}${kontakt.name.split(' ')[1].charAt(0)}`;
};


/**
 * 
 * Determines if the contact should be marked as "checked."
 * 
 */
const getContactStatus = (kontakt) => {
    const matchingContact = allContactNames.find(c => c.name === kontakt.name);
    if (matchingContact && matchingContact.checked) {
        return { addClass: "checked", addSrc: "checked" };
    }
    return { addClass: "", addSrc: "unchecked" };
};


/**
 * 
 * Handles fetch errors.
 * 
 */
const handleFetchError = (error) => {
    console.error("Fehler beim Abrufen der Kontakte:", error);
};


/**
 * 
 * go through the list of all contacts in allContactNames, check if the current contact exists in selectedContacts
 * 
 */
const updateCheckedStatus = () => {
    // Durchlaufe die Liste aller Kontakte in allContactNames
    allContactNames.forEach(contact => {
        // Überprüfe, ob der aktuelle Kontakt in selectedContacts vorhanden ist
        const isSelected = selectedContacts.some(selected => selected.contact === contact.name);

        if (isSelected) {
            // Wenn ja, setze checked auf true
            contact.checked = true;
        } else {
            // Andernfalls setze checked auf false
            contact.checked = false;
        }
    });
};


/**
 * 
 * add contact to task
 * 
 */
function addContactToTask(index, selectedContact, color) {

    const checked = document.getElementById(`contact_checkbox${index}`);
    const nameDiv = document.getElementById(`initials_and_name_div${index}`);

    if (checked.src.includes("unchecked")) {

        if (currentNumberOfSelectedContacts < maxSelectedContacts) {

            checked.src = "../assets/icons/checked_button_contacts_list.png";
            nameDiv.classList.add("checked");

            selectedContacts.push({ contact: selectedContact, color: color });
            showContactsAsCircles();

            currentNumberOfSelectedContacts++;
        }

    } else deleteContactFromTask(selectedContact, checked, nameDiv);

    updateCheckedStatus();
}


/**
 * 
 * delete contact from task
 * 
 */
function deleteContactFromTask(selectedContact, checked, nameDiv) {

    checked.src = "../assets/icons/unchecked_button_contacts_list.png";
    nameDiv.classList.remove("checked");

    selectedContacts = selectedContacts.filter(contact => contact.contact !== selectedContact);

    showContactsAsCircles();

    currentNumberOfSelectedContacts--;
}


/**
 * 
 * show contacts as circles
 * 
 */
function showContactsAsCircles() {

    const circlesRef = document.getElementById('circles_contacts_div');
    let htmlCirclesContent = "";

    selectedContacts.forEach(contactObj => {

        const initialen = `${contactObj.contact.charAt(0)}${contactObj.contact.split(' ')[1].charAt(0)}`;

        htmlCirclesContent += `
    
        <div style="background-color: ${contactObj.color}; margin-right: 8px" class="initials-circle for-center">${initialen}</div>
    `;
    });

    circlesRef.innerHTML = htmlCirclesContent;
}


/**
 * 
 * stop propagation
 * 
 */
function stopProp(event) {

    event.stopPropagation();
}


/**
 * 
 * prio button1 activate
 * 
 */
function prioButton1() {

    if (prio == 'urgent') { resetPrioButtons() } else {

        document.getElementById('prio_button1').classList.add('urgent-bg');
        document.getElementById('prio_button1').classList.remove('white-bg');

        document.getElementById('prio_button2').classList.remove('medium-bg');
        document.getElementById('prio_button2').classList.add('white-bg');

        document.getElementById('prio_button3').classList.remove('low-bg');
        document.getElementById('prio_button3').classList.add('white-bg');

        document.getElementById('img_prio_button1').src = "../assets/icons/urgent2.png";
        document.getElementById('img_prio_button2').src = "../assets/icons/medium.png";
        document.getElementById('img_prio_button3').src = "../assets/icons/low.png";
        prio = 'urgent';
    }
}


/**
 * 
 * prio button2 activate
 * 
 */
function prioButton2() {

    if (prio == 'medium') { resetPrioButtons() } else {

        document.getElementById('prio_button1').classList.remove('urgent-bg');
        document.getElementById('prio_button1').classList.add('white-bg');

        document.getElementById('prio_button2').classList.add('medium-bg');
        document.getElementById('prio_button2').classList.remove('white-bg');

        document.getElementById('prio_button3').classList.remove('low-bg');
        document.getElementById('prio_button3').classList.add('white-bg');

        document.getElementById('img_prio_button1').src = "../assets/icons/urgent.png";
        document.getElementById('img_prio_button2').src = "../assets/icons/medium2.png";
        document.getElementById('img_prio_button3').src = "../assets/icons/low.png";
        prio = 'medium';
    }
}


/**
 * 
 * prio button3 activate
 * 
 */
function prioButton3() {

    if (prio == 'low') { resetPrioButtons() } else {

        document.getElementById('prio_button1').classList.remove('urgent-bg');
        document.getElementById('prio_button1').classList.add('white-bg');

        document.getElementById('prio_button2').classList.remove('medium-bg');
        document.getElementById('prio_button2').classList.add('white-bg');

        document.getElementById('prio_button3').classList.add('low-bg');
        document.getElementById('prio_button3').classList.remove('white-bg');

        document.getElementById('img_prio_button1').src = "../assets/icons/urgent.png";
        document.getElementById('img_prio_button2').src = "../assets/icons/medium.png";
        document.getElementById('img_prio_button3').src = "../assets/icons/low2.png";
        prio = 'low';
    }
}


/**
 * 
 * reset prio buttons
 * 
 */
function resetPrioButtons() {

    prio = '';
    document.getElementById('prio_button1').classList.remove('urgent-bg');
    document.getElementById('prio_button1').classList.add('white-bg');

    document.getElementById('prio_button2').classList.remove('medium-bg');
    document.getElementById('prio_button2').classList.add('white-bg');

    document.getElementById('prio_button3').classList.remove('low-bg');
    document.getElementById('prio_button3').classList.add('white-bg');

    document.getElementById('img_prio_button1').src = "../assets/icons/urgent.png";
    document.getElementById('img_prio_button2').src = "../assets/icons/medium.png";
    document.getElementById('img_prio_button3').src = "../assets/icons/low.png";
}


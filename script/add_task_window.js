
let toggle1 = false;
let toggle2 = false;
let prio = 'medium';
let selectedCategory = "";
let numberOfSubtasks = 0;
let subtask1Text = "";
let subtask2Text = "";
let selectedContacts = [];
let allContactNames = [];
let maxSelectedContacts = 5;
let currentNumberOfSelectedContacts = 0;


function onloadstart() {

    renderContacts()

    fetchAllContactNames();
}

function bodyOnClick() {

    closeContactsList();
    closeCategory();

    onBlurSubtasks();

    closeEditSubtask1();
    closeEditSubtask2();
}

function createTaskClick() {


    console.log('create task click');

}

const fetchAllContactNames = async () => {
    try {
        const response = await fetch(`${BASE_URL}/kontakte.json`);

        if (!response.ok) {
            console.error("Fehler beim Laden der Kontakte:", response.status);
            return;
        }

        const kontakte = await response.json();

        // Extrahiere alle Kontaktnamen und füge für jeden Kontakt ein `checked: false` Attribut hinzu
        allContactNames = Object.values(kontakte).map(kontakt => ({
            name: kontakt.name,
            checked: false
        }));

    } catch (error) {
        console.error("Fehler beim Abrufen der Kontaktnamen:", error);
    }
};






function openContactsList() {

    document.getElementById('contacts_list').placeholder = "";

    document.getElementById('list_of_contacts').classList.add('list-of-contacts2');
    document.getElementById('assign_arrow').src = "../assets/icons/arrow_drop_up.png";
    toggle1 = true;

    setTimeout(() => document.getElementById('list_of_contacts_outside').style = "overflow: visible;", 200);
}

function closeContactsList() {

    document.getElementById('contacts_list').placeholder = "Select contacts to assign";

    document.getElementById('list_of_contacts').classList.remove('list-of-contacts2');
    document.getElementById('assign_arrow').src = "../assets/icons/arrow_drop_down.png";
    toggle1 = false;

    document.getElementById('list_of_contacts_outside').style = "";
}

function toggleShowContacts() {

    if (toggle1) { closeContactsList() } else { openContactsList(); focusInput('contacts_list') }
}






const renderContacts = async () => {

    try {
        const response = await fetch(`${BASE_URL}/kontakte.json`);

        if (!response.ok) {
            console.error("Fehler beim Laden der Kontakte:", response.status);
            return;
        }

        const kontakte = await response.json();
        const container = document.getElementById("contactsContainer"); // Der Container, in dem die Kontakte gerendert werden

        // Bereite das HTML für alle Kontakte vor
        let htmlContent = "";
        let index = 1;

        // Kontakte durchlaufen und das HTML zusammenstellen
        Object.values(kontakte).forEach(kontakt => {
            // Initialen berechnen (erster Buchstabe des Vornamens und Nachnamens)
            const initialen = `${kontakt.name.charAt(0)}${kontakt.name.split(' ')[1].charAt(0)}`;

            let addClass = "";
            let addSrc = "unchecked";

            // Überprüfen, ob der aktuelle Kontakt in allContactNames vorhanden ist und checked auf true steht
            const matchingContact = allContactNames.find(c => c.name === kontakt.name);

            if (matchingContact && matchingContact.checked) {

                addClass = "checked";
                addSrc = "checked";
            }

            // HTML für jeden Kontakt
            htmlContent += `
                <div class="initials-and-name-div ${addClass}" onclick="addContactToTask(${index}, '${kontakt.name}', '${kontakt.farbe}'), stopProp(event)" id="initials_and_name_div${index}">
                    <div style="background-color: ${kontakt.farbe}" class="initials-circle for-center">
                        ${initialen}
                    </div>
                    <div>${kontakt.name}</div>
                    <img src="../assets/icons/${addSrc}_button_contacts_list.png" class="contact-checkbox" id="contact_checkbox${index}">
                </div>
            `;

            index++;
        });

        // Setze den HTML-Inhalt des Containers
        container.innerHTML = htmlContent;
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
    }
};



const searchContacts = async () => {
    const query = document.getElementById("contacts_list").value.trim().toLowerCase();

    if (query.length === 0) {
        // Wenn die Suchanfrage leer ist, rendere alle Kontakte
        renderContacts();
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/kontakte.json`);

        if (!response.ok) {
            console.error("Fehler beim Laden der Kontakte:", response.status);
            return;
        }

        const kontakte = await response.json();
        const container = document.getElementById("contactsContainer");

        // Filtere Kontakte nach Suchbegriff
        const filteredContacts = Object.values(kontakte).filter(kontakt =>
            kontakt.name.toLowerCase().includes(query)
        );

        // Bereite das HTML für die gefilterten Kontakte vor
        let htmlContent = "";
        let index = 1;

        filteredContacts.forEach(kontakt => {
            const initialen = `${kontakt.name.charAt(0)}${kontakt.name.split(' ')[1].charAt(0)}`;

            let addClass = "";
            let addSrc = "unchecked";

            // Überprüfen, ob der aktuelle Kontakt in allContactNames vorhanden ist und checked auf true steht
            const matchingContact = allContactNames.find(c => c.name === kontakt.name);

            if (matchingContact && matchingContact.checked) {

                addClass = "checked";
                addSrc = "checked";
            }

            htmlContent += `
                <div class="initials-and-name-div ${addClass}" onclick="addContactToTask(${index}, '${kontakt.name}', '${kontakt.farbe}'), stopProp(event)" id="initials_and_name_div${index}">
                    <div style="background-color: ${kontakt.farbe}" class="initials-circle for-center">
                        ${initialen}
                    </div>
                    <div>${kontakt.name}</div>
                    <img src="../assets/icons/${addSrc}_button_contacts_list.png" class="contact-checkbox" id="contact_checkbox${index}">
                </div>
            `;

            index++;
        });

        container.innerHTML = htmlContent;
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
    }
};





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

function deleteContactFromTask(selectedContact, checked, nameDiv) {

    checked.src = "../assets/icons/unchecked_button_contacts_list.png";
    nameDiv.classList.remove("checked");

    selectedContacts = selectedContacts.filter(contact => contact.contact !== selectedContact);

    showContactsAsCircles();

    currentNumberOfSelectedContacts-- ;
}

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






function stopProp(event) {

    event.stopPropagation();
}

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

function openCategory() {

    toggle2 = true;
    document.getElementById('list_of_category').classList.add('list-of-category2');
    setTimeout(() => document.getElementById('list_of_category_outside').style = "overflow: visible;", 200);

    document.getElementById('list_of_category_outside').classList.add('z2');
    document.getElementById('list_of_category_outside').classList.remove('z1');

    document.getElementById('assign_arrow_category').src = "../assets/icons/arrow_drop_up.png";
}

function closeCategory() {

    toggle2 = false;
    document.getElementById('list_of_category').classList.remove('list-of-category2');
    document.getElementById('list_of_category_outside').style = "overflow: hidden;";

    setTimeout(changeZindexForListofCategory, 200);

    document.getElementById('assign_arrow_category').src = "../assets/icons/arrow_drop_down.png";
}

function changeZindexForListofCategory() {

    document.getElementById('list_of_category_outside').classList.remove('z2');
    document.getElementById('list_of_category_outside').classList.add('z1');
}

function toggleShowCategory() {

    if (toggle2) { closeCategory() } else openCategory();
}

function categoryTechnicalTask() {

    document.getElementById('selected category').innerText = "Technical Task";
    selectedCategory = "Technical Task";

    closeCategory();
}

function categoryUserStory() {

    document.getElementById('selected category').innerText = "User Story";
    selectedCategory = "User Story";

    closeCategory();
}

function onFocusSubtasks() {

    document.getElementById('subtask_add_div').style = "display: none";
    document.getElementById('close_check').style = "";
}

function onBlurSubtasks() {

    if (document.getElementById('subtask_input').value == "") {

        document.getElementById('subtask_add_div').style = "";
        document.getElementById('close_check').style = "display: none";
    }
}

function closeSubtasks() {

    document.getElementById('subtask_input').value = "";

    document.getElementById('subtask_add_div').style = "";
    document.getElementById('close_check').style = "display: none";
}

function focusInput(id) {
    if (document.getElementById(id) != null) document.getElementById(id).focus(); // Setzt den Fokus auf das Eingabefeld
}

function addSubtask() {

    const subtask = document.getElementById('subtask_input');
    const subtask1 = document.getElementById('subtask1');
    const subtask2 = document.getElementById('subtask2');

    if (subtask.value.trim() != "") {

        if (numberOfSubtasks == 0) {
            createSubtask1(subtask, subtask1);
        } else {
            if (numberOfSubtasks == 1) createSubtask2(subtask, subtask2);
        }

        subtask.value = "";
        if (numberOfSubtasks == 2) { closeSubtasks(); subtask.placeholder = "2 subtasks already exist!" }
    }
}

function createSubtask1(subtask, subtask1) {

    document.getElementById('subtask1_text').innerHTML = '<li></li>' + subtask.value;
    numberOfSubtasks = 1;
    subtask1Text = subtask.value;
    subtask1.style = "";
}

function createSubtask2(subtask, subtask2) {

    document.getElementById('subtask2_text').innerHTML = '<li></li>' + subtask.value;
    numberOfSubtasks = 2;
    subtask2Text = subtask.value;
    subtask2.style = "";
}

// Funktion, die bei Enter aufgerufen wird
function enterPressed(event) {

    if (event.key === "Enter") {

        event.preventDefault(); // Verhindert das Absenden des Formulars
        addSubtask();
    }
}




function deleteSubtask1() {

    if (numberOfSubtasks == 1) {

        numberOfSubtasks = 0;
        subtask1Text = "";
        subtask1.style = "display: none";

    } else {

        numberOfSubtasks = 1;
        subtask1Text = subtask2Text;
        subtask2Text = "";
        document.getElementById('subtask1_text').innerHTML = '<li></li>' + subtask1Text;
        subtask2.style = "display: none";


        document.getElementById('edit_delete2').style = '';
        document.getElementById('delete_check2').style = 'display: none';
    }

    document.getElementById('subtask_input').placeholder = "Add  new subtask";
}




function deleteSubtask2() {

    numberOfSubtasks = 1;
    subtask2Text = "";
    subtask2.style = "display: none";

    document.getElementById('subtask_input').placeholder = "Add  new subtask";
}

function editSubtask1() {

    const subtask1 = document.getElementById('subtask1');


    document.getElementById('subtask1_text').innerHTML = '<input onkeydown="enterPressedEditSubtask1(event)" id="input_on_edit" class="input-on-edit font3" maxlength="21" spellcheck="false" autocomplete="off">';

    document.getElementById('input_on_edit').value = subtask1Text;

    focusInput('input_on_edit');


    document.getElementById('edit_delete').style = 'display: none';
    document.getElementById('delete_check').style = '';
    subtask1.style = "background: white; border-bottom: 1px solid #005DFF; border-radius: 0;";
}

function editInput1ChangeSubtaskText1() {

    if (document.getElementById('input_on_edit') != null) {

        const newText = document.getElementById('input_on_edit').value;
        if (newText.trim() != "") subtask1Text = newText;
    }
}

function closeEditSubtask1() {

    const subtask1 = document.getElementById('subtask1');

    if (numberOfSubtasks != 0) {

        editInput1ChangeSubtaskText1();

        setTimeout(() => {
            document.getElementById('subtask1_text').innerHTML = '<li></li>' + subtask1Text;

            document.getElementById('edit_delete').style = '';
            document.getElementById('delete_check').style = 'display: none';
            subtask1.style = "";
        }, 100);
    }
}

function deleteSubtask1onEdit() {

    closeEditSubtask1();
    setTimeout(deleteSubtask1, 100);
}

function enterPressedEditSubtask1(event) {

    if (event.key === "Enter") {

        event.preventDefault(); // Verhindert das Absenden des Formulars
        closeEditSubtask1();
    }
}

function editSubtask2() {

    const subtask2 = document.getElementById('subtask2');


    document.getElementById('subtask2_text').innerHTML = '<input onkeydown="enterPressedEditSubtask2(event)" id="input_on_edit2" class="input-on-edit font3" maxlength="21" spellcheck="false" autocomplete="off">';

    document.getElementById('input_on_edit2').value = subtask2Text;

    focusInput('input_on_edit2');


    document.getElementById('edit_delete2').style = 'display: none';
    document.getElementById('delete_check2').style = '';
    subtask2.style = "background: white; border-bottom: 1px solid #005DFF; border-radius: 0;";
}

function editInput2ChangeSubtaskText2() {

    if (document.getElementById('input_on_edit2') != null) {

        const newText = document.getElementById('input_on_edit2').value;
        if (newText.trim() != "") subtask2Text = newText;
    }
}

function closeEditSubtask2() {

    const subtask2 = document.getElementById('subtask2');

    if ((numberOfSubtasks != 0) && (numberOfSubtasks != 1)) {

        editInput2ChangeSubtaskText2();

        setTimeout(() => {
            document.getElementById('subtask2_text').innerHTML = '<li></li>' + subtask2Text;

            document.getElementById('edit_delete2').style = '';
            document.getElementById('delete_check2').style = 'display: none';
            subtask2.style = "";
        }, 100);
    }
}

function deleteSubtask2onEdit() {

    closeEditSubtask2();
    setTimeout(deleteSubtask2, 100);
}

function enterPressedEditSubtask2(event) {

    if (event.key === "Enter") {

        event.preventDefault(); // Verhindert das Absenden des Formulars
        closeEditSubtask2();
    }
}











function insertCurrentDate() {

    const today = new Date();

    tag = today.getDate(); // Tag des Monats (1-31)
    month = today.getMonth() + 1; // Monat (0-11), also +1, um den aktuellen Monat zu bekommen
    year = today.getFullYear(); // Jahr (vierstellig)

    document.getElementById('day').value = tag;
    document.getElementById('month').value = month;
    document.getElementById('year').value = year;
}

function DDMMYYYY(value, event) {
    let newValue = value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');

    const dayOrMonth = (index) => index % 2 === 1 && index < 4;

    // on delete key.  
    if (!event.data) {
        return value;
    }

    return newValue.split('').map((v, i) => dayOrMonth(i) ? v + '/' : v).join('');;
}





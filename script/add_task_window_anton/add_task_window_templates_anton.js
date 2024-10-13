let editTask;

function subtaskTemplate(text, index) {

    return `
    
    <div id="id_subtask${index}" ondblclick="editSubtaskFromList('${text}', ${index}), stopProp(event)"
        onclick="noEditArea(), stopProp(event)" class="subtask-text-div2 font3 m-g-8px2">


        <div class="div-for-subtask-text"> <li></li> ${text} </div>


        <div class="edit-delete" id="edit_delete">

            <img onclick="editSubtaskFromList('${text}', ${index}), stopProp(event)" class="edit-subtask-icon"
            src="../assets/icons/edit_subtasks.png">

            <div class="subtask-separator"></div>

            <img onclick="deleteSubtaskFromList('${index}'), stopProp(event)" class="delete-subtask-icon"
            src="../assets/icons/delete_subtasks.png">

        </div>

    </div>

    `;
}

function subtaskEditTemplate(text, index) {

    return `
    
    <div id="id_subtask${index}" onclick="editSubtaskFromList('${text}', ${index}), stopProp(event)" class="subtask-text-div2-edit font3 m-g-8px2">


        <div class="div-for-subtask-text"><input onkeydown="enterPressedOnEditSubtask(event, '${text}', this)" id="input_on_edit${index}" class="input-on-edit font3" maxlength="21" spellcheck="false" autocomplete="off"></div>


        <div id="delete_check" class="delete-check">

            <div class="div24 for-center" onclick="deleteSubtaskFromList('${index}'), stopProp(event)">
                <img class="delete-subtask-icon2" src="../assets/icons/delete_subtasks.png">
            </div>

            <div class="subtask-separator2"></div>

            <div class="div24 for-center" onclick="applyChangeOnSubtaskEdit('${text}', ${index}), stopProp(event)">
                <img class="check-subtask-icon" src="../assets/icons/check_subtasks.png">
            </div>

        </div>

    </div>
                    
    `;
}

function renderContactsTemplate(addClass, index, kontakt, initialen, addSrc) {

    if(editTask){
        let taskName = document.getElementById('title_input').value
        return `
    
        <div class="initials-and-name-div ${addClass}" onclick="addContactToTask(${index}, '${kontakt.name}', '${kontakt.farbe}'), stopProp(event)" id="initials_and_name_div${index}">
            <div style="background-color: ${kontakt.farbe}" class="initials-circle for-center">
                ${initialen}
            </div>
            <div>${kontakt.name}</div>
            <img src="../assets/icons/${addSrc}_button_contacts_list.png" class="contact-checkbox" id="contact_checkbox${index}">
        </div>
        
        `; 

    }else{

        return `
    
        <div class="initials-and-name-div ${addClass}" onclick="addContactToTask(${index}, '${kontakt.name}', '${kontakt.farbe}'), stopProp(event)" id="initials_and_name_div${index}">
            <div style="background-color: ${kontakt.farbe}" class="initials-circle for-center">
                ${initialen}
            </div>
            <div>${kontakt.name}</div>
            <img src="../assets/icons/${addSrc}_button_contacts_list.png" class="contact-checkbox" id="contact_checkbox${index}">
        </div>
        
        `;
    }
}

function searchContactsTemplate(addClass, index, kontakt, initialen, addSrc) {

    return `

    <div class="initials-and-name-div ${addClass}" onclick="addContactToTask(${index}, '${kontakt.name}', '${kontakt.farbe}'), stopProp(event)" id="initials_and_name_div${index}">
        <div style="background-color: ${kontakt.farbe}" class="initials-circle for-center">
            ${initialen}
        </div>
        <div>${kontakt.name}</div>
        <img src="../assets/icons/${addSrc}_button_contacts_list.png" class="contact-checkbox" id="contact_checkbox${index}">
    </div>

    `;
}




function showContacts(contact) {

    let initials = contact.name.charAt(0) + contact.name.split(" ", 2)[1].charAt(0);

    return `
      <div onclick='loadContactInfo(${JSON.stringify(contact)}, this)' class="single-contact">
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

function showAlphabet(letter) {

    return `
      <div class="alphabet">
        <h2>${letter}</h2>
        <img class="separator" src="../assets/icons/separator_contacts_list.svg">
      </div>
    `;
}

function showContactInfoTemplate(contact, contactStr, initials, phoneNumber) {

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
        <a class="phone-design" href="tel:${contact.telefonnummer}">${phoneNumber}</a>
    </div>
    `;
}

function showEditMenu(contact) {

    if (!contact.telefonnummer) { phoneNumber = "" } else { phoneNumber = contact.telefonnummer }

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
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="name" maxlength="30" type="text" placeholder="Name" autocomplete="on" value="${contact.name}" />
                    <img src="../assets/icons/contacts_edit_person.svg" alt="">
                </div>
                <div id="name-warning" class="name-warning"></div>
  
                <div class="input-outside" onclick="focusInput('edit-email')">
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="email" maxlength="30" type="email" placeholder="Email" autocomplete="on" value="${contact.email}" />
                    <img src="../assets/icons/contacts_edit_mail.svg" alt="">
                </div>
                <div class="mail-warning"></div>
  
  
                <div class="input-outside2" onclick="focusInput('edit-phone')">
                    <input onblur="editInputOnblur(this)" onfocus="editInputOnfocus(this)" class="input" id="phone" maxlength="30" type="tel" placeholder="Phone" autocomplete="on" value="${phoneNumber}" />
                    <img src="../assets/icons/contacts_edit_call.svg" alt="">
                </div>
                <div class="phone-warning"></div>
  
            </div>
        </div>
        <div class="buttons b-m">
            <div class="button-settings">
                <button type="button" class="delete-button" onclick="deleteContact('${contact.name}'), stopProp(event)">Delete</button>
                <button type="submit" class="save-button" onclick="stopProp(event)">Save
                    <img class="create-img" src="../assets/icons/contacts_edit_check.svg">
                </button>
            </div>
        </div>
    `;
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


/**
 * 
 * refresh contacts
 * 
 */
async function refreshContacts() {

    await getAllContacts("/contacts");
    renderContacts();
    //closeDialog();
    closeMenu();
}


/**
 * 
 * reset input fields
 * 
 */
function resetInputFields() {
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("phone").value = '';
    document.querySelector(".name-warning").textContent = "";
    document.querySelector(".mail-warning").textContent = "";
    document.querySelector(".phone-warning").textContent = "";
}


/**
 * 
 * edit delete mobile button clicked
 * 
 */
function editDeleteMobileButtonClicked() {

    document.querySelector('.edit-mobile-dropdown').style = "transform: translateX(0px)";
}


/**
 * 
 * close edit delete mobile dropdown menu
 * 
 */
function closeEditDeleteMobileDropdownMenu() {

    document.querySelector('.edit-mobile-dropdown').style = "";
}


/**
 * 
 * edit mobile clicked 
 * 
 */
function editMobileClicked() {

    document.querySelector('.hover-container').click();
    setTimeout(() => closeEditDeleteMobileDropdownMenu(), 100);
}


/**
 * 
 * delete mobile clicked
 * 
 */
function deleteMobileClicked() {

    document.querySelectorAll('.hover-container')[1].click();
    setTimeout(() => closeEditDeleteMobileDropdownMenu(), 100);
}





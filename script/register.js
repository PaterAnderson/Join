const BASE_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/";

let noticeIndex;


/**
 * 
 *   function called at start
 * 
 */
function registerStart() {

    checkReturnToIndexHTML();
}


/**
 * 
 *   check whether redirection to index.html is necessary
 * 
 */
function checkReturnToIndexHTML() {

    const startedJoin = sessionStorage.getItem('started');

    if (!startedJoin) {

        window.location.href = '../index.html';

    } else document.getElementById('main_div').classList.remove('display-none');
}


/**
 * 
 *   forward to login.html
 * 
 */
function returnToLogin() {

    window.location.href = '../html/login.html';
}


/**
 * 
 *   button toggle between active and inactive
 * 
 */
function toggleActivateButton() {

    const registerButton = document.getElementById('register_sign_up_button');

    if (registerButton.disabled) { registerButton.disabled = false } else registerButton.disabled = true;
}


/**
 * 
 *   function that is called, button sign up is pressed
 * 
 */
function registerSubmit() {

    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm_password').value.trim();
    const user = document.getElementById('user').value.trim();
    const email = document.getElementById('email').value.trim();

    if (password != "" && confirmPassword != "" && user != "" && email != "") {

        if (password == confirmPassword) {

            checkEmailAndUserForRegister(user, email, password);

        } else {

            writeNotice("Your passwords don't match. Please try again.");
            noticeIndex = 2;
            document.getElementById('input_border3').style = "border: 1px solid #FF8190";
            document.getElementById('input_border4').style = "border: 1px solid #FF8190";
        }
    }
}


/**
 *   write notice under password input
 * 
 *   @param {string} notice 
 */
function writeNotice(notice) {

    document.getElementById('password_notice').innerText = notice;
    document.getElementById('password_notice').classList.remove('display-none');
}


/**
 *   add new user
 * 
 *   @param {string} user 
 *   @param {string} email 
 *   @param {string} password 
 */
function addNewUser(user, email, password) {

    putData(`${user}`, { email: email, password: password, user: user });

    createContactWithUserDetails(user, email);

    animationSuccess();
    setTimeout(() => { closeAnimationSuccess(); window.location.href = '../html/login.html' }, 2500);
}


/**
 * 
 *   create a contact with user details
 * 
 */
function createContactWithUserDetails(user, email) {

    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const newContact = {
        name: user,
        email: email,
        farbe: randomColor,
    };

    postContactData(newContact);
}


/**
 * 
 *   post contact data - call of postData
 * 
 */
function postContactData(contact) {

    postData(contact).then(response => {

        console.log("Kontakt erfolgreich hinzugefügt:", response);


        alert('----')

    }).catch(error => { console.error("Fehler beim Hinzufügen des Kontakts:", error) });
}


/**
 * 
 *   post data
 * 
 */
async function postData(contact) {

    const contactPath = encodeURIComponent(contact.name);
    const CONTACT_URL = `https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/users/${contactPath}/contacts`;


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
 *   animation for sign up successfully
 * 
 */
function animationSuccess() {

    document.getElementById('overlay').classList.remove('display-none');
    document.getElementById('success').classList.add('success2');
}


/**
 * 
 *   close animation for sign up successfully
 * 
 */
function closeAnimationSuccess() {

    document.getElementById('overlay').classList.add('display-none');
    document.getElementById('success').classList.remove('success2');

    document.getElementById('password').value = "";
    document.getElementById('confirm_password').value = "";
    document.getElementById('user').value = "";
    document.getElementById('email').value = "";
}


/**
 * 
 *   input for user on focus, reset border of input, hide notice under password input
 * 
 */
function inputForUserOnFocus() {

    document.getElementById('input_border1').style = "";
    document.getElementById('input_border2').style = "";

    if (noticeIndex == 1) document.getElementById('password_notice').classList.add('display-none');
}


/**
 * 
 *   input for email on focus, reset border of input, hide notice under password input
 * 
 */
function inputForEmailOnFocus() {

    document.getElementById('input_border1').style = "";
    document.getElementById('input_border2').style = "";

    if (noticeIndex == 1) document.getElementById('password_notice').classList.add('display-none');
}


/**
 * 
 *   input for password on focus, reset border of input, hide notice under password input
 * 
 */
function inputForPasswordOnFocus() {

    const password = document.getElementById('password');
    password.value = "";

    document.getElementById('input_border3').style = "";
    document.getElementById('input_border4').style = "";

    if (noticeIndex == 2) document.getElementById('password_notice').classList.add('display-none');
}


/**
 * 
 *   input for confirm password on focus, reset border of input, hide notice under password input
 * 
 */
function inputForConfirmPasswordOnFocus() {

    const confirmPassword = document.getElementById('confirm_password');
    confirmPassword.value = "";

    document.getElementById('input_border3').style = "";
    document.getElementById('input_border4').style = "";

    if (noticeIndex == 2) document.getElementById('password_notice').classList.add('display-none');
}


/**
 *   put data on firebase

 * 
 *   @param {string} path 
 *   @param {Array} data 
 */
async function putData(path = "", data = {}) {

    let response = await fetch(BASE_URL + path + ".json", {

        method: "PUT",
        header: {
            "Content-Type": "aplication/json"
        },

        body: JSON.stringify(data)
    });

    responseToJson = await response.json();
}


/**
 *   check email and user for register
 * 
 *   @param {string} user 
 *   @param {string} email 
 *   @param {string} password 
 */
async function checkEmailAndUserForRegister(user, email, password) {

    try {
        // Hole die Daten von Firebase
        let response = await fetch(BASE_URL + ".json");

        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }

        let responseToJson = await response.json();

        // Durchsuche die JSON-Daten nach existierenden Benutzern oder E-Mails
        let isUserOrEmailExist = false;

        for (const key in responseToJson) {

            if (responseToJson[key].user == user) isUserOrEmailExist = true;
            if (responseToJson[key].email == email) isUserOrEmailExist = true;
        }

        writeMessageOrRegisterNewUser(user, email, password, isUserOrEmailExist);

    } catch (error) { console.error('Fehler beim Abrufen oder Verarbeiten der Daten:', error) }
}


/**
 *   write message or register new user
 * 
 *   @param {string} user 
 *   @param {string} email 
 *   @param {string} password 
 *   @param {boolean} isUserOrEmailExist 
 */
function writeMessageOrRegisterNewUser(user, email, password, isUserOrEmailExist) {

    if (isUserOrEmailExist) {

        writeNotice("User or email already exists.");
        noticeIndex = 1;

        document.getElementById('input_border1').style = "border: 1px solid #FF8190";
        document.getElementById('input_border2').style = "border: 1px solid #FF8190";

    } else {

        addNewUser(user, email, password);
    }
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
 * privacy policy click, from register
 * 
 */
function privacyPolicyClick() {

    sessionStorage.setItem('user', 'Guest');
    sessionStorage.setItem('textSubpages', 'no menu');
    if (window.innerWidth <= 600 || /Mobi|Android/i.test(navigator.userAgent)) { window.open('../html/privacy_policy_login.html', '_self') } else window.open('../html/privacy_policy_login.html', '_blank');
}


/**
 * 
 * legal notice click, from register
 * 
 */
function legalNoticeClick() {

    sessionStorage.setItem('user', 'Guest');
    sessionStorage.setItem('textSubpages', 'no menu');
    if (window.innerWidth <= 600 || /Mobi|Android/i.test(navigator.userAgent)) { window.open('../html/legal_notice_login.html', '_self') } else window.open('../html/legal_notice_login.html', '_blank');
}



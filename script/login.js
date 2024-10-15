const BASE_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/";

sessionStorage.setItem('kanbanId', '');


/**
 * 
 *   body onload, first check whether redirection to index.html is necessary
 * 
 */
function loginStart() {

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
 *   function called when form onsubmit
 *  
 */
function loginSubmit() {

    email = document.getElementById('email').value;
    password = document.getElementById('password').value;

    if (!isValidEmail(email)) {showNotice(); return}
    if (email != "" && password != "") checkEmailAndPasswordForLogin(email, password);
}


/**
 * 
 * is vaild email ?
 * 
 */
function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


/**
 *   check email and password for log in
 * 
 *   @param {string} email 
 *   @param {string} password 
 */
async function checkEmailAndPasswordForLogin(email, password) {

    try {
        // Hole die Daten von Firebase
        let response = await fetch(BASE_URL + "/users" + ".json");

        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }

        let responseToJson = await response.json();

        // Durchsuche die JSON-Daten nach existierenden Benutzern oder E-Mails

        for (const key in responseToJson) {

            if ((responseToJson[key].email === email) && (responseToJson[key].password === password)) userLoginStart(key);
        }

        showNotice();

    } catch (error) { console.error('Fehler beim Abrufen oder Verarbeiten der Daten:', error) }
}


/**
 * 
 *   show notice under password input
 * 
 */
function showNotice() {

    document.getElementById('password_notice').classList.remove('display-none');

    document.getElementById('input_outside1').style = "border: 1px solid #FF8190";
    document.getElementById('input_outside2').style = "border: 1px solid #FF8190";
}


/**
 * 
 *   if input focused - hide notice, reset border for inputs 
 * 
 */
function inputIsOnFocus() {

    document.getElementById('password_notice').classList.add('display-none');

    document.getElementById('input_outside1').style = "";
    document.getElementById('input_outside2').style = "";
}


/**
 *   delete content of password input if focused
 * 
 *   @param {this} passwordRef 
 */
function deleteContent(passwordRef) {

    passwordRef.value = "";
}


/**
 * 
 *   if allowed by check box 'remember me' calling saving passwords
 * 
 */
function savePassword() {

    const rememberMe = document.getElementById('rememberMe');
    if (rememberMe.checked) {

        if ('PasswordCredential' in window) {

            const form = document.querySelector('form');
            const cred = new PasswordCredential({ id: form.elements.email.value, password: form.elements.password.value });

            navigator.credentials.store(cred).then(function () {
                //console.log('Credentials stored successfully!');
            }).catch(function (error) { console.error('Error storing credentials:', error) });
        }
    }
}


/**
 * 
 *   forward to register.html
 * 
 */
function toRegister() {

    window.location.href = '../html/register.html';
}


/**
 * 
 *   forward to summary.html with guest user 
 * 
 */
function guestLoginStart() {

    sessionStorage.setItem('textSubpages', '');
    sessionStorage.setItem('greeting', 'login');
    sessionStorage.setItem('user', 'Guest');
    window.location.href = '../html/summary.html';
}


/**
 *   if allowed by check box 'remember me' calling saving passwords, forward to summary.html with logged in user
 * 
 *   @param {string} user 
 */
function userLoginStart(user) {

    savePassword();

    sessionStorage.setItem('textSubpages', '');
    sessionStorage.setItem('greeting', 'login');
    sessionStorage.setItem('user', user);
    window.location.href = '../html/summary.html';
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
 * privacy policy click, from login
 * 
 */
function privacyPolicyClick() {

    sessionStorage.setItem('user', 'Guest');
    sessionStorage.setItem('textSubpages', 'no menu');
    if (window.innerWidth <= 600 || /Mobi|Android/i.test(navigator.userAgent)) { window.open('../html/privacy_policy_login.html', '_self') } else window.open('../html/privacy_policy_login.html', '_blank');
}


/**
 * 
 * legal notice click, from login
 * 
 */
function legalNoticeClick() {

    sessionStorage.setItem('user', 'Guest');
    sessionStorage.setItem('textSubpages', 'no menu');
    if (window.innerWidth <= 600 || /Mobi|Android/i.test(navigator.userAgent)) { window.open('../html/legal_notice_login.html', '_self') } else window.open('../html/legal_notice_login.html', '_blank');
}



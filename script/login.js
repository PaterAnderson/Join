
const BASE_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * 
 *   first check whether redirection to index.html is necessary
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

    checkEmailAndPasswordForLogin(email, password);
};


/**
 *   check email and password for log in
 * 
 *   @param {string} email 
 *   @param {string} password 
 */
async function checkEmailAndPasswordForLogin(email, password) {

    try {
        // Hole die Daten von Firebase
        let response = await fetch(BASE_URL + ".json");

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
            const cred = new PasswordCredential({
                id: form.elements.email.value,
                password: form.elements.password.value
            });

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

    sessionStorage.setItem('user', 'guest');


    alert('guest login!');
}


/**
 *   if allowed by check box 'remember me' calling saving passwords, forward to summary.html with logged in user
 * 
 *   @param {string} user 
 */
function userLoginStart(user) {

    savePassword();
    sessionStorage.setItem('user', user);


    alert('user login!' + ' ' + user);


    window.location.href = '../html/login.html';
}




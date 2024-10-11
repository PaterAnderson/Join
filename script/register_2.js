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





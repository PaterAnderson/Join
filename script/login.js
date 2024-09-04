
function loginStart() {

    checkReturnToIndexHTML();
}

function checkReturnToIndexHTML() {

    const startedJoin = sessionStorage.getItem('started');

    if (!startedJoin) {

        window.location.href = '../index.html';

    } else document.getElementById('main_div').classList.remove('display-none');
}

// Funktion, die beim Formular-Submit aufgerufen wird
function loginSubmit() {

    savePassword();
    //window.location.href = '../html/summary.html';
};

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
                //          console.log('Credentials stored successfully!');
                //          form.submit(); // Formular nach dem Speichern abschicken
            }).catch(function (error) {
                console.error('Error storing credentials:', error);
            });
        }
    }
}

function toRegister() {

    window.location.href = '../html/register.html';
}


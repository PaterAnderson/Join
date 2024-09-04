
function loginStart() {

    const startedJoin = sessionStorage.getItem('started');

    if (!startedJoin) {

        window.location.href = '../index.html';

    } else document.getElementById('main_div').classList.remove('display-none');
}

// Funktion, die beim Formular-Submit aufgerufen wird
function loginSubmit() {


    console.log('login submit');




};



function toggleAutocomplete() {



    console.log('remember me');


}

function toRegister() {

    window.location.href = '../html/register.html';
}


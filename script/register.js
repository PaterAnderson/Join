
function registerStart() {

    const startedJoin = sessionStorage.getItem('started');

    if (!startedJoin) {

        window.location.href = '../index.html';

    } else document.getElementById('main_div').classList.remove('display-none');
}

function returnToLogin() {

    window.location.href = '../html/login.html';
}

const BASE_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/";

function registerStart() {

    checkReturnToIndexHTML();


}

function checkReturnToIndexHTML() {

    const startedJoin = sessionStorage.getItem('started');

    if (!startedJoin) {

        window.location.href = '../index.html';

    } else document.getElementById('main_div').classList.remove('display-none');
}

function returnToLogin() {

    window.location.href = '../html/login.html';
}

function registerSubmit() {


    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;



    if (password == confirmPassword) {



        const user = document.getElementById('user').value;
        const email = document.getElementById('email').value;


        putData(`/${user}`, { "email": email });
        putData(`/${user}`, { "password": password });

        

    } else {

        document.getElementById('password_notice').classList.remove('display-none');
    }    
}

function inputForPasswordOnFocus() {

    const password = document.getElementById('password');
    password.value = "";

    document.getElementById('password_notice').classList.add('display-none');

    
}

function inputForConfirmPasswordOnFocus() {

    const confirmPassword = document.getElementById('confirm_password');
    confirmPassword.value = "";

    document.getElementById('password_notice').classList.add('display-none');

    
}

async function putData(path = "", data = {}) {

    let response = await fetch(BASE_URL + path + ".json", {

        method: "PUT",

        header: {

            "Content-Type": "aplication/json"
        },

        body: JSON.stringify(data)

    });

    responseToJson = await response.json();

    console.log(responseToJson);
}

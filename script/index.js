
/**
 * 
 *   start animation. redirect to login.
 * 
 */
function joinStart() {

    setTimeout(() => document.getElementById('capa').classList.add('capa-div2'), 1000);
    setTimeout(() => document.getElementById('capa1').classList.add('capa2'), 1000);
    setTimeout(() => document.getElementById('capa2').classList.add('capa2-mobile'), 1000);

    if (document.documentElement.clientWidth <= 600) {

        setTimeout(() => document.getElementById('capa1').classList.add('capa3'), 1000);
        setTimeout(() => document.getElementById('capa2').classList.add('capa3-mobile'), 1000);
        setTimeout(() => document.body.classList.add('animation-index'), 1000);
        setTimeout(() => document.body.style = "background-color: #f5f6f7ff", 2000);
    }

    setTimeout(() => window.location.href = 'html/login.html', 2000);
    sessionStorage.setItem('started', true);
}


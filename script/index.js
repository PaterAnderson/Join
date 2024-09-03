
/**
 * 
 *   start animation. redirect to login.
 * 
 */
function joinStart() {

    setTimeout(() => document.getElementById('capa').classList.add('capa2'), 1000);
    setTimeout(() => window.location.href = 'html/login.html', 2000);
}


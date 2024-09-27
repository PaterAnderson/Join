
if (!sessionStorage.getItem('user')) window.location.href = '../index.html';


/**
 * 
 * open user menu
 * 
 */
function openUserMenu(){
    document.getElementById('user-nav').classList.toggle('d-none');
    //document.getElementById('user-icon').classList.toggle('icon-color-after-click');
}


/**
 * 
 * close user menu
 * 
 */
function closeUserMenu(){
    document.getElementById('user-nav').classList.add('d-none');
    //document.getElementById('user-icon').classList.add('icon-color-after-click');
}


/**
 * 
 * stop propagation
 * 
 */
function stopProp(event) {

    event.stopPropagation();
}


/**
 * 
 * funkction for user icon initials
 * 
 */
function userIconName(){
    document.getElementById('user-icon').innerText = calculateInitialsHeader(sessionStorage.getItem('user'));    
}


/**
 * Function to calculate the initials
 * 
 * @param {string} name
 */
const calculateInitialsHeader = (name) => {
    const [firstName, lastName] = name.split(' ');
    if (!lastName) return `${firstName.charAt(0)}`;
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};
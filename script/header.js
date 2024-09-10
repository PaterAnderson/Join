function openUserMenu(){
    document.getElementById('user-nav').classList.toggle('d-none')
    document.getElementById('user-icon').classList.toggle('icon-color-after-click')
}

function userIconName(){
    document.getElementById('user-icon').innerText = 'SM'
}
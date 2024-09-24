/**
 * 
 * function called when arrow click
 * 
 */
function arrowClick() {

    window.history.back();
}


/**
 * 
 * function called when starting
 * 
 */
function privacyPolicyStart() {

    if (sessionStorage.getItem('textSubpages') == "no menu") {

        document.querySelector('.menu-table').style.display = 'none';
        //document.querySelector('.legal-div').style.display = 'none';
        document.querySelector('.header-profile ').style.display = 'none';
    }

    document.body.style.display = 'block';
}


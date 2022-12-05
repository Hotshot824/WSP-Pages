function hideLoginBtn(status) {
    if (status) {
        document.querySelector('.nav-base.btn-outline-success').classList.remove('d-lg-block');
        document.querySelector('.nav-base.btn-success').classList.remove('d-lg-block');
        document.querySelector('.nav-base.btn-danger').classList.add('d-lg-block');
        document.querySelector('.navbar-nav').querySelector('#logOut').classList.remove('d-none');
        document.querySelector('.navbar-nav').querySelector('#signIn').classList.add('d-none');
        document.querySelector('.navbar-nav').querySelector('#signUp').classList.add('d-none');
    } else {
        document.querySelector('.nav-base.btn-danger').classList.remove('d-lg-block');
        // console.log(document.querySelector('.navbar-nav').querySelector('#logOut'));
    }
}

function hideFeedback(status) {
    if(status) {
        document.querySelector('#contactForm').classList.remove('d-none');
        document.querySelector('#feedbackSignIn').classList.add('d-none');
    } else {
        document.querySelector('#contactForm').classList.add('d-none');
        document.querySelector('#feedbackSignIn').classList.remove('d-none');
    }
}

function loginStatus(status) {
    if (status) {
        hideLoginBtn(status);
        hideFeedback(status)
    } else {
        hideLoginBtn(status);
        hideFeedback(status)
    }
}

export { loginStatus }
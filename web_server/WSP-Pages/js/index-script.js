import * as login from './login.js'
import * as style from './style.js'

window.addEventListener('DOMContentLoaded', () => {
    previewImgHeight();
});

// Window resize
window.addEventListener('resize', () => {
    previewImgHeight();
});

function previewImgHeight() {
    // Preview image height size
    let previewImg = document.querySelectorAll(".preview-img");
    for (let i = 0; i < previewImg.length; i++) {
        previewImg[i].style.height = previewImg[i].width + "px";
    }
}

var patientID;

// check login
async function checkLogin() {
    await login.signInCheck()
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            if (response['patientID']) {
                patientID = response['patientID'];
                document.querySelector('#loginText').innerHTML = patientID;
                document.querySelector('#loginText').classList.remove('d-none');
                style.loginStatus(true);
                return;
            }
            style.loginStatus(false);
            return;
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
}
window.addEventListener('load', () => {
    checkLogin();
})

document.querySelector('#signUpForm').addEventListener('submit', async (event) => {
    let form = document.querySelector('#signUpForm');
    await login.signUp(event, form)
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            if (response['error_status']) {
                alert(response['error_status']);
                return;
            }
            alert("Account created successfully!")
            document.querySelector('#modalSignUp').querySelector('.btn-close').click();
            let input = document.querySelector('#modalSignUp').querySelectorAll('input');
            for (let i = 0; i < input.length; i++) {
                input[i].value = null;
            }
            document.querySelector('#modalSignUp').querySelector('.form-check-input').checked = false;
            document.querySelector('#signIn').click();
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
})

document.querySelector('#signInForm').addEventListener('submit', async (event) => {
    let form = document.querySelector('#signInForm');
    await login.signIn(event, form)
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            if (response['error_status']) {
                alert(response['error_status']);
                return;
            }

            alert("Sign In successfully!");
            checkLogin();

            document.querySelector('#modalSignIn').querySelector('.btn-close').click();
            let input = document.querySelector('#modalSignIn').querySelectorAll('input');
            for (let i = 0; i < input.length; i++) {
                input[i].value = null;
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
})

// logout, clear cookie.
async function logOutFuc() {
    login.logOut()
        .then((response) => {
            if (alert("Bye! " + patientID)) { }
            else {
                location.reload();
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
}
let logOut = document.querySelectorAll('#logOut')
for (let i = 0; i < logOut.length; i++) {
    logOut[i].addEventListener('click', logOutFuc)
}

async function sendFeedback(event) {
    let form = document.querySelector('#contactForm');
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['stay_in'] = login.getStayIn();
        console.log(formDataObiect);
        await fetch("/php/feedback.php", {
            method: "POST",
            body: JSON.stringify(formDataObiect)
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                if (alert(response['status'])) { }
                else window.location.assign("#page-top");
                document.querySelector('#message').value = "";
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            })
    }
}
document.querySelector('#submitBtn').addEventListener("click", (e) => sendFeedback(e));
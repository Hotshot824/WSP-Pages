import * as style from './style.js';
import * as login from '../../js/login.js';

var patientID;

function exitPaint(event) {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = "Write something clever here..";
}
window.addEventListener('beforeunload', exitPaint);

// check login
async function checkLogin() {
    await login.signInCheck()
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            if (response['patientID']) {
                patientID = response['patientID'];
                style.loginStatus(true);
                style.chartStatus(true);
                style.areatextPosition('Hello ' + patientID + '!');
                return true;
            }
            style.loginStatus(false);
            style.chartStatus(false);
            document.querySelector('#signIn').click();
            return false;
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
}
window.addEventListener('load', async () => {
    checkLogin()
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
document.querySelector('#logOut').addEventListener('click', async (event) => {
    login.logOut()
        .then((response) => {
            if (alert("Bye! " + patientID)) {}
            else {
                window.removeEventListener("beforeunload", exitPaint);
                location.reload();
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
})
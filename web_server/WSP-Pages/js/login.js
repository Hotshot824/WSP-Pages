import { loginStatus } from '../paint/js/style.js';
import { sha256 } from './hash.js';

function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getCookie(name) {
    let strcookie = document.cookie;
    strcookie = strcookie.replace(/\s*/g, "");
    let arrcookie = strcookie.split(";");
    for (var i = 0; i < arrcookie.length; i++) {
        let arr = arrcookie[i].split("=");
        if (arr[0] == name) {
            return arr[1];
        }
    }
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function getStayIn() {
    if (getCookie('stay_in') == "on") {
        return true;
    } 
    return false
}

async function signInCheck() {
    let data = {
        "stay_in": getStayIn()
    }
    if (getCookie('PHPSESSID') != "") {
        let response = await fetch("../php/sign_in_check.php", {
            method: "POST",
            body: JSON.stringify(data)
        })
        return response;
    }
    return;
}

async function logOut() {
    let response = await fetch("../php/log_out.php", {
        method: "GET",
    })
    return response;
}

// Sign Up
document.querySelector('#signUpForm').addEventListener('submit', async (event) => {
    let form = document.querySelector('#signUpForm');
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['password'] = sha256(formDataObiect['password']);
        let response = (async () => {
            return await fetch("../php/sign_up.php", {
                method: "POST",
                body: JSON.stringify(formDataObiect)
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })
        })();

        await response.then((response) => {
            console.log(response);
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

        });
    }
})

// Sign In
document.querySelector('#signInForm').addEventListener('submit', async (event) => {
    let form = document.querySelector('#signInForm');
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['password'] = sha256(formDataObiect['password']);
        let response = (async () => {
            return await fetch("../php/sign_in.php", {
                method: "POST",
                body: JSON.stringify(formDataObiect)
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })
        })();

        await response.then((response) => {
            if (response['error_status']) {
                alert(response['error_status']);
                return;
            }

            alert("Password, true!");
            loginStatus(true);
            document.querySelector('#chartBtn').classList.remove("d-none");

            document.querySelector('#modalSignIn').querySelector('.btn-close').click();
            let input = document.querySelector('#modalSignIn').querySelectorAll('input');
            for (let i = 0; i < input.length; i++) {
                input[i].value = null;
            }

        });
    }
})

export { getCookie, delCookie, signInCheck, getStayIn, logOut, randomString }
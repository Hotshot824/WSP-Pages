import * as style from '../paint/js/style.js';
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

function delGlobalCookie(name) {
    document.cookie = name + "=;path=/;expires=" + (new Date(0)).toGMTString();
}

function getStayIn() {
    if (getCookie('stay_in') == "on") {
        return true;
    }
    return false
}

async function signInCheck() {
    let data = {
        'type': 'checklogin',
        'stay_in': getStayIn()
    }
    if (getCookie('PHPSESSID') != "") {
        let response = await fetch("/interface.php", {
            method: "POST",
            body: JSON.stringify(data)
        })
        return response;
    }
    return;
}

async function logOut() {
    delGlobalCookie('stay_in');
    let response = await fetch("/interface.php?type=logout", {
        method: "GET",
    })
    return response;
}

// Sign Up
async function signUp(event, form) {
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['password'] = sha256(formDataObiect['password']);
        formDataObiect['type'] = 'signup';
        return await fetch("/interface.php", {
            method: "POST",
            body: JSON.stringify(formDataObiect)
        })
    }
}

// Sign In
async function signIn(event, form) {
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['password'] = sha256(formDataObiect['password']);
        formDataObiect['type'] = 'signin';
        if (formDataObiect['stayIn'] == 'on') {
            document.cookie = "stay_in=on;path=/;";
        }
        return await fetch("/interface.php", {
            method: "POST",
            body: JSON.stringify(formDataObiect)
        })
    }
}

export { getCookie, delGlobalCookie, signUp, signIn, signInCheck, getStayIn, logOut, randomString }
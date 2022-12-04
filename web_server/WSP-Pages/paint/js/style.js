function toastPosition() {
    let toastContainer = document.querySelector('.toast-container')
    toastContainer.style.transform = 'translate(' + (window.innerWidth - 310) + 'px,' + (70) + 'px)';
}

function areatextPosition(string = null) {
    let frontAreatext = document.querySelector('.front-areatext')
    if (string) {
        frontAreatext.innerHTML = string;
    }
    
    let text_width = frontAreatext.offsetWidth;
    let text_height = frontAreatext.offsetHeight;
    frontAreatext.style.transform = 'translate(' + (window.innerWidth - (text_width + 15)) + 'px,' + (window.innerHeight - (text_height + 15)) + 'px)';
}

function loginStatus(status) {
    if (status) {
        document.querySelector('#signUp').classList.add("d-none");
        document.querySelector('#signIn').classList.add("d-none");
        document.querySelector('#logOut').classList.remove("d-none");
    } else {
        document.querySelector('#signUp').classList.remove("d-none");
        document.querySelector('#signIn').classList.remove("d-none");
        document.querySelector('#logOut').classList.add("d-none");
    }
}

function chartStatus(status) {
    if (status) {
        document.querySelector('#chart').classList.remove("d-none");
        document.querySelector('#chartBtn').classList.remove("d-none");
    } else {
        document.querySelector('#chart').classList.add("d-none");
        document.querySelector('#chartBtn').classList.add("d-none");
    }
}

export {toastPosition, areatextPosition, loginStatus, chartStatus};
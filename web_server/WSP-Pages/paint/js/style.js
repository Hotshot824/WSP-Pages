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

export {toastPosition, areatextPosition};
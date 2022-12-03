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

// Check image type
function checkFiletype(file) {
    if (file.type.match('image/jpg|image/jpeg|image/png')) {
        return false;
    }
    return true;
}
// Check image size
function checkFilesize(file) {
    if (file.size < 5242880) {
        return false;
    }
    return true;
}

async function sendFeedback(message) {
    let data = {
        "message": message,
    }
    console.log(data);
    await fetch("../php/feedback.php", {
        method: "POST",
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            if (alert(response['status'])) {}
            else window.location.assign("#page-top");
            document.querySelector('#message').value = "";
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
}
document.querySelector('#submitBtn').addEventListener("click", (event) => {
    event.preventDefault();
    let message = document.querySelector('#message').value;

    if (message.length >= 256) {
        alert("Text is limited to 256 characters!");
    } if (message.length <= 10) {
        alert('Text Minimum is 10 characters!')
    } else {
        sendFeedback(message)
    }
});

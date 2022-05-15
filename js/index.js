window.addEventListener('DOMContentLoaded', () => {
    preview_img_height();
});

// Window resize
window.addEventListener('resize', () => {
    preview_img_height();
});

function preview_img_height() {
    // Preview image height size
    let preview_img = document.querySelectorAll(".preview_img");
    for (let i = 0; i < preview_img.length; i++) {
        preview_img[i].style.height = preview_img[i].width + "px";
    }
}

// Predict upload button
document.querySelector('#upload-button').addEventListener('click', () => {

    let inputtag = document.querySelector('#upload-predict-img');

    inputtag.click();

    inputtag.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];

        let reader = new FileReader();
        let imgtag = document.querySelector("#predict-img");
        imgtag.title = selectedFile.name;
        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);

        (async (temp) => {
            let formData = new FormData();
            formData.append("file", temp);

            document.querySelector('#edge-img').src = "./assets/img/preview/cat.gif";
            document.querySelector('#overlay-img').src = "./assets/img/preview/cat.gif";
            
            await fetch('php/predict_upload.php', {
                method: "POST",
                body: formData
            });
        })(selectedFile);
    });
});


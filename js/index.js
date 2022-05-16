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

// Predict image upload button
document.querySelector('#predictImgBtn').addEventListener('click', () => {
    let inputtag = document.querySelector('#inputPredictImg');

    inputtag.click();
    inputtag.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];

        let reader = new FileReader();
        let imgtag = document.querySelector("#predictImg");
        imgtag.title = selectedFile.name;
        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    });
});

// Label image upload button
document.querySelector('#labelImgBtn').addEventListener('click', () => {
    let inputtag = document.querySelector('#inputLabelImg');

    inputtag.click();
    inputtag.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];

        let reader = new FileReader();
        let imgtag = document.querySelector("#labelImg");
        imgtag.title = selectedFile.name;
        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    });
});

// Label original image upload button
document.querySelector('#LimageImgBtn').addEventListener('click', () => {
    let inputtag = document.querySelector('#inputLimageImg');

    inputtag.click();
    inputtag.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];

        let reader = new FileReader();
        let imgtag = document.querySelector("#LimageImg");
        imgtag.title = selectedFile.name;
        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    });
});

// Predict original image button
document.querySelector('#uploadButton').addEventListener('click', () => {
    let tagInput = document.querySelector('#inputPredictImg');
    let selectedFile = tagInput.files[0];

    if (tagInput.files.length == 0) {
        alert("No files selected!")
    } else if (checkFiletype(selectedFile)) {
        alert("Upload file must be .jpg .jpge .png type!")
    } else if (checkFilesize(selectedFile)) {
        alert("Upload file must less 5MB!")
    } else {
        (async (temp) => {
            let formData = new FormData();
            formData.append("file", temp);

            let imgpreview = "./assets/img/preview/pre_img.gif"
            document.querySelector('#edge-img').src = imgpreview;
            document.querySelector('#overlay-img').src = imgpreview;

            await fetch('php/predict_upload.php', {
                method: "POST",
                body: formData
            })
                .then((response) => {
                    return response.text();
                })
                .then((response) => {
                    alert(response)
                    let imgpreview = "./wound/upload/"
                    document.querySelector('#edge-img').src = imgpreview + "edge.png";
                    document.querySelector('#overlay-img').src = imgpreview + "superposition.png";
                    console.log(response);
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })

        })(selectedFile);
    }
});

// Check image type
function checkFiletype(file) {
    if (file.type.match('image/jpg|image/jpge|image/png')) {
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

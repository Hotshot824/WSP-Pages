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
document.querySelector('#predictImgUploadBtn').addEventListener('click', () => {
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

// Predict button
document.querySelector('#predictBtn').addEventListener('click', () => {
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
            formData.append("inputPredictImg", temp);

            let imgpreview = "./assets/img/preview/pre_img.gif"
            document.querySelector('#edgeImg').src = imgpreview;
            document.querySelector('#overlayImg').src = imgpreview;

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
                    document.querySelector('#edgeImg').src = imgpreview + "edge.png";
                    document.querySelector('#overlayImg').src = imgpreview + "superposition.png";
                    console.log(response);
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })

        })(selectedFile);
    }
});

// IOU image upload button
document.querySelector('#iouImgUploadBtn').addEventListener('click', () => {
    let inputtag = document.querySelector('#inputIouImg');

    inputtag.click();
    inputtag.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];

        let reader = new FileReader();
        let imgtag = document.querySelector("#iouImg");
        imgtag.title = selectedFile.name;
        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    });
});

// IOU Label upload button
document.querySelector('#iouLabelUploadBtn').addEventListener('click', () => {
    let inputtag = document.querySelector('#inputIouLabel');

    inputtag.click();
    inputtag.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];

        let reader = new FileReader();
        let imgtag = document.querySelector("#iouLabel");
        imgtag.title = selectedFile.name;
        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    });
});

// IOU button
document.querySelector('#iouButton').addEventListener('click', () => {
    let iouImg = document.querySelector('#inputIouImg');
    let iouImgFile = iouImg.files[0];
    let iouLabel = document.querySelector('#inputIouLabel');
    let iouLabelFile = iouLabel.files[0];

    if (iouImg.files.length == 0 || iouLabel.files.length == 0){
        alert("IOU need two files, Original image and Leabel!")
    } else if (checkFiletype(iouImgFile) || checkFiletype(iouLabelFile)) {
        alert("Upload file must be .jpg .jpge .png type!")
    } else if (checkFilesize(iouImgFile) || checkFilesize(iouImgFile)) {
        alert("Upload file must less 5MB!")
    } else {
        (async (img, label) => {
            let formData = new FormData();
            formData.append("image", img);
            formData.append("label", label);

            // console.log(formData.get('image'));
            // console.log(formData.get('label'));
            let imgpreview = "./assets/img/preview/pre_img.gif"
            document.querySelector('#iouResultImg').src = imgpreview;

            await fetch('php/iou_upload.php', {
                method: "POST",
                body: formData
            })
                .then((response) => {
                    return response.text();
                })
                .then((response) => {
                    alert(response)
                    let imgpreview = "./wound/upload/"
                    document.querySelector('#iouResultImg').src = imgpreview + "111context.png";
                    console.log(response);
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })

        })(iouImgFile, iouLabelFile);
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

// area button
document.querySelector('#aeraButton').addEventListener('click', () => {
    let imgpreview = "./paint-main/upload/111context.png";
    document.querySelector('#areaImg').src = imgpreview;

    alert("AreaShow")
});
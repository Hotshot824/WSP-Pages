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
document.querySelector('#predict-img').addEventListener('click', () => {
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
    });
});


document.querySelector('#upload-button').addEventListener('click', () => {
    let selectedFile = document.querySelector('#upload-predict-img').files[0];
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
});

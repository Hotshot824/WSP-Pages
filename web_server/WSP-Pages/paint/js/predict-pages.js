function previewImgHeight() {
    // Preview image height size
    let previewImg = document.querySelectorAll(".preview-img");
    for (let i = 0; i < previewImg.length; i++) {
        // console.log(previewImg[i].width);
        previewImg[i].style.height = previewImg[i].width + "px";
    }
}
function preview_img_height(number) {
    // Preview image height size
    let preview_img = document.querySelector(".preview_img");
    preview_img.style.height = preview_img.width + "px";
}

window.addEventListener('DOMContentLoaded', function () {
    preview_img_height();
});

window.addEventListener('resize', function () {
    preview_img_height();
});
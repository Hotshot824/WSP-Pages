$(document).ready(function () {
    $("#brushTool").click(function () {
        $("#brushToast").toast("show");
    });

    $("#areaTool").click(function () {
        $("#areaToast").toast("show");
    });

    $("#clearTool").click(function () {
        $("#clearToast").toast("show");
    });
});

var upperBtnHtml = 0;
$("#upperBtn").click(function () {
    $("#navbar").slideToggle();
    if (upperBtnHtml == 0) {
        $("#upperBtn").html("▼");
        upperBtnHtml++;
    } else {
        $("#upperBtn").html("▲");
        upperBtnHtml--;
    }
});

// Color table
// let colorArray = ['#FFA500', '#FFFF00', '#FF0000', '#8B00FF', '#0000FF', '#66FFE6', '#006400', '#00FF00', '#000000', '#FFFFFF'];
let colorArray = ['#000000', '#FFFFFF'];
for (let i = 0; i < colorArray.length; i++) {
    let str = '';
    str += `<div class="colorItem" style="background:${colorArray[i]}"></div>`;
    $('#colorAfter').after(str);
}
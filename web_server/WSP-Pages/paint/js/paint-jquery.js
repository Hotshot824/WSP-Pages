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
// let colorArray = ['#000000', '#FFFFFF'];
// for (let i = 0; i < colorArray.length; i++) {
//     let str = '';
//     if (colorArray[i] == '#FFFFFF') {
//         str += `<div class="colorItem" style="background:${colorArray[i]}">✓</div>`;
//         $('#colorAfter').after(str);
//     } else {
//         str += `<div class="colorItem" style="background:${colorArray[i]}">✓</div>`;
//         $('#colorAfter').after(str);
//     }
// }

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// UI/UX datail
$("#nav-predict-tab").click(function () {
    $('.btn-close').each(function (i, obj) {
        obj.click();
    });

    // hide scrpt
    toolbar_hide();
    $('.front-areatext').addClass('d-none');
});

$("#nav-home-tab").click(function () {
    toolbar_hide();
    $('.front-areatext').removeClass('d-none');
});

function toolbar_hide() {
    let nav_home_tab = document.querySelector('#nav-home-tab');
    let toolBtnGroup = document.querySelector('#toolBtnGroup');
    if (nav_home_tab.classList.contains('active')) {
        if (toolBtnGroup.classList.contains('active')) {
            $("#toolBtnGroup").removeClass('active');
            $("#toolBtnGroup").animate({ width: 'toggle' }, "slow");
            $('#rulerBtn').show(500);
        } else {
        }
    } else {
        if (toolBtnGroup.classList.contains('active')) {
        } else {
            $("#toolBtnGroup").addClass('active');
            $("#toolBtnGroup").animate({ width: 'toggle' }, "slow");
            $('#rulerBtn').hide(500);
        }
    }
};
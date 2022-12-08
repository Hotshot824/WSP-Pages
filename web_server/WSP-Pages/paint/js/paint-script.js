import { Paint } from './paint.js';
import * as style from './style.js';
import * as chart from './chart.js';
import * as login from '../../js/login.js';

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d', { willReadFrequently: true });
let paint = new Paint(canvas, ctx);

// randon tmpfile path
paint.temp_key = login.getCookie('PHPSESSID') + login.randomString(2);

// mouse click status
let state;
let toolbarBtnlist = ['#brushBtn', '#eraserBtn', '#bucketBtn', '#rulerBtn', '#areaBtn', '#selectBtn'];

function isNumeric(val) {
    return /^-?\d+$/.test(val);
}

function hexToRgba(hex, opacity) {
    return {
        r: parseInt("0x" + hex.slice(1, 3)),
        g: parseInt("0x" + hex.slice(3, 5)),
        b: parseInt("0x" + hex.slice(5, 7)),
        a: opacity
    }
}

function rgbToValue(rgb) {
    rgb = rgb.substring(4, rgb.length - 1)
        .replace(/ /g, '')
        .split(',');
    return rgb;
}

function rgbToHex(r, g, b) {
    r = Number(r);
    g = Number(g);
    b = Number(b);
    let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

function changeActive(idName) {
    for (let i in toolbarBtnlist) {
        document.querySelector(toolbarBtnlist[i]).classList.remove('active');
    }
    if (idName != null) {
        document.querySelector(idName).classList.add('active');
    }
};

function getCoordinate(e) {
    paint.lastX = e.offsetX * paint.canvas.width / paint.canvas.clientWidth | 0;
    paint.lastY = e.offsetY * paint.canvas.height / paint.canvas.clientHeight | 0;
}

function getTouchCoordinate(e) {
    paint.left = paint.canvas.getBoundingClientRect().left;
    paint.top = paint.canvas.getBoundingClientRect().top;
    paint.lastX = parseInt(e.touches[0].clientX - paint.left)
    paint.lastY = parseInt(e.touches[0].clientY - paint.top)
}

window.addEventListener('mousedown', () => {
    $("#message").popover('hide');
});

window.addEventListener('load', () => {
    console.log("#####  version 1.1.16  #####");
    console.log("#####  fix undo empty  #####");

    // paint.init()
    // paint.loaded()

    paint.saveHistory("brushbtn");
    // init
    $("#message").popover('show');
    style.toastPosition();
    style.areatextPosition("Hello");
});

window.addEventListener('resize', () => {
    style.toastPosition();
    style.areatextPosition();
    chart.startChart();
});

document.querySelector('#nav-predict-tab').addEventListener('click', () => {
    state = null;
});

// Mouse event
paint.canvas.addEventListener('mousedown', (e) => {
    if (state != 'ruler' && paint.scaleCount != 1) {
        paint.scaleCount = 1;
    }
    getCoordinate(e)
    switch (state) {
        case 'brush':
            paint.isDrawing = true;
            break;
        case 'bucket':
            paint.bucketFloodFill(paint.lastX, paint.lastY, hexToRgba(paint.color, 255));
            document.querySelector('#brushBtn').click();
            break;
        case 'ruler':
            if (paint.getScale(e) == true) {
                document.querySelector('#scaleText').innerHTML = 'OK';
                state = null;
                changeActive(null);

                // scale ready animate
                document.querySelector('#scaleText').innerHTML = 'None';
                document.querySelector('#scaleText').style = 'color: gary;';
                document.querySelector('#rulerBtn').classList.add("btn-danger");
                document.querySelector('#rulerBtn').classList.remove("btn-outline-secondary");
            };
            break;
        case 'area':
            let area = paint.floodFill(paint.lastX, paint.lastY, 250, true);
            paint.floodFill(paint.lastX, paint.lastY, 255, false);

            let str = area + "c㎡"
            alert(str);
            style.areatextPosition(str);
            // upload image for frontend area compute
            paint.frontendAreaUpload(area)

            state = null;
            changeActive(null);
            break;
        case 'select':
            paint.isDrawing = true;
            break;
    }
});

paint.canvas.addEventListener('mousemove', (e) => {
    // paint.changeColor();
    paint.changeStroke();

    switch (state) {
        case 'brush':
            paint.startDrawing(e);
            break;
        case 'select':
            paint.getSelectArea(e);
            break;
    }
});

paint.canvas.addEventListener('mouseout', () => paint.isDrawing = false);

paint.canvas.addEventListener('mouseup', () => {
    if (state) {
        paint.saveHistory();
        paint.isDrawing = false;
    }
});

window.addEventListener("mousewheel", (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        paint.scroll_big_small(e);
    }
}, { passive: false });

var store = {
    scale: 1
};
// Touch event
paint.canvas.addEventListener('touchstart', (e) => {
    if (state != 'ruler' && paint.scaleCount != 1) {
        paint.scaleCount = 1;
    }
    getTouchCoordinate(e)
    switch (state) {
        case 'brush':
            paint.isDrawing = true;
            break;
        case 'bucket':
            paint.bucketFloodFill(paint.lastX, paint.lastY, hexToRgba(paint.color, 255));
            document.querySelector('#brushBtn').click();
            break;
        case 'area':
            paint.floodFill(paint.lastX, paint.lastY, 250, true);
            paint.floodFill(paint.lastX, paint.lastY, 255, false);

            // upload image for frontend area compute
            paint.frontendAreaUpload()

            state = null;
            changeActive(null);
            break;
        case 'select':
            paint.isDrawing = true;
            break;
        default:
            store.pageX1 = e.touches[0].clientX;
            store.pageY1 = e.touches[0].clientY;
            break;
    }
});

paint.canvas.addEventListener('touchmove', (e) => {
    paint.changeStroke();

    if (e.targetTouches.length == 1) {
        switch (state) {
            case 'brush':
                paint.touchStartDrawing(e, paint.left, paint.top);
                break;
            case 'select':
                paint.getSelectAreaMobile(e);
                break;
            default:
                break;
        }
    }
});

paint.canvas.addEventListener('touchend', (e) => {
    if (state) {
        paint.isDrawing = false;
        paint.saveHistory("touchend");
    } else {
        console.log(e);
        store.pageX2 = e.changedTouches[0].clientX;
        store.pageY2 = e.changedTouches[0].clientY;
        console.log(store);
    }
});

// Save Image
document.querySelector('#saveImageBtn').addEventListener('click', () => paint.saveImage());

// Open Image
let openImageInput = document.querySelector('#openImageInput');
document.querySelector('#openImageBtn').addEventListener('click', () => {
    openImageInput.click();
    document.querySelector('#nav-home-tab').click()
});
openImageInput.addEventListener('change', () => {
    paint.displayImg();
    paint.length = 0;
    document.querySelector('#scaleText').innerHTML = 'None';
    document.querySelector('#scaleText').style = 'color: gary;';
    document.querySelector('#rulerBtn').classList.remove("btn-danger");
    document.querySelector('#rulerBtn').classList.add("btn-outline-secondary");
    // document.querySelector('.front-areatext').innerHTML = '';
});


// Brush toolbar
document.querySelector('#brushBtn').addEventListener('click', () => {
    changeActive('#brushBtn');
    state = 'brush';
    paint.color = '#FFFFFF'
});

document.querySelector('#eraserBtn').addEventListener('click', () => {
    changeActive('#eraserBtn');
    state = 'brush';
    paint.color = '#e8e8e8'
});

document.querySelector('#bucketBtn').addEventListener('click', () => {
    changeActive('#bucketBtn');
    state = 'bucket';
    paint.color = '#FFFFFF'
});

// Area toolbar
document.querySelector('#rulerBtn').addEventListener('click', () => {
    paint.length = window.prompt("Enter real lenght(c㎡) for to scale calculate the area\nthan choose two point in the uploda image.");
    if (!isNumeric(paint.length)) {
        alert('Input has to a number!')
    } else if (paint.length == null) {
        alert('Please input a number!');
    } else {
        changeActive('#rulerBtn');
        state = 'ruler';
    }
});

document.querySelector('#areaBtn').addEventListener('click', () => {
    if (paint.length != 0) {
        changeActive('#areaBtn');
        alert('Click wound compute area!')
        state = 'area';
    } else {
        alert('No scale, Please give scale first!')
    }
});

document.querySelector('#selectBtn').addEventListener('click', () => {
    changeActive('#selectBtn');
    paint.img.src = paint.canvas.toDataURL();
    state = 'select';
});

document.querySelector('#cutBtn').addEventListener('click', () => {
    if (paint.selectflag == 1) {
        paint.cutSelectArea();
        paint.selectflag = 0;
        paint.backPredictFlag = true;
    }
});

// undo, redo, clear toolbar 
document.querySelector('#undo').addEventListener('click', () => paint.undo(state));
document.querySelector('#redo').addEventListener('click', () => paint.redo(state));
document.querySelector('#clearAll').addEventListener('click', () => paint.clearAll());

// predict btn, upload original image to backend then predict.
document.querySelector('#predictAreaBtn').addEventListener('click', () => {
    if (paint.length == 0) {
        alert('No scale, Please give scale first!');
    } else if (paint.backPredictFlag != true) {
        alert('This is same images!');
    } else {
        document.querySelector('#nav-predict-tab').click();
        let close = document.querySelectorAll('.btn-close');
        for (let i = 0; i < close.length; i++) {
            close[i].click();
        }
        paint.backend_predict();
        paint.backPredictFlag = false;

        // clean old iou image
        document.querySelector('#iouImg').src = "../assets/img/preview/pre_bg.jpg";
        document.querySelector('#iouText').innerHTML = 'IOU';
        document.querySelector('#areaText').innerHTML = 'Area';
    }
});

// iou btn, upload cavans image to backend with predcit result do iou calculate.
document.querySelector('#iouBtn').addEventListener('click', () => {
    if (paint.iouFlag) {
        document.querySelector('#nav-predict-tab').click();
        let close = document.querySelectorAll('.btn-close');
        for (let i = 0; i < close.length; i++) {
            close[i].click();
        }
        paint.backend_iou_upload();
    } else {
        alert("Error Operation.");
    }
});

document.querySelector('#iouImg').addEventListener('click', () => {
    document.querySelector('#nav-home-tab').click();
});

document.querySelector('#chartBtn').addEventListener('click', async () => {
    document.querySelector('#nav-predict-tab').click();
    await chart.startChart();
    window.location.href = '#chart';
});

document.querySelector('#historyRemove').addEventListener('click', () => {
    if (confirm('Are you sure to delete this data?')) {
        chart.removeHistory();
    }
});

document.querySelector('#historyComment').addEventListener('click', (event) => {
    if (document.querySelector('#historyCommentText').value == "") {
        console.log(document.querySelector('#historyCommentText').value);
        alert("Comment cannot be empty!");
        event.stopPropagation();
    } else {
        chart.sotreComment();
    }
});

// document.querySelector('#testBtn').addEventListener('click', () => {
//     console.log(paint.temp_key);
// });
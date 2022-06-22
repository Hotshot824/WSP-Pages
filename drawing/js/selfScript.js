import { Paint } from './Paint.js';

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let painting = new Paint(canvas, ctx);

// state, 0==brush, 1==eraser, 2==bucket 3==ruler, 4==select
let state;
let toolbarBtnlist = ['#brushBtn', '#eraserBtn', '#bucketBtn', '#rulerBtn', '#areaBtn', '#selectBtn'];

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
    if (idName != NaN) {
        document.querySelector(idName).classList.add('active');
    }
};

const colorItem = document.querySelectorAll('.colorItem');
for (let i = 0; i < colorItem.length; i++) {
    colorItem[i].addEventListener('click', (e) => {
        let rgb = rgbToValue(e.target.style.backgroundColor);
        let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        painting.color = hex;
        colorItem.forEach((item) => {
            const check = item;
            check.textContent = '';
            if (e.target.className === 'colorItem') {
                e.target.textContent = '✓';
            }
        })

    });
}

window.addEventListener('load', function () {
    document.querySelector('#brushBtn').click()
    // painting.init()
    // painting.loaded()
    painting.saveHistory();
});

window.addEventListener('resize', function () {
    // painting.init()
    // painting.loaded()
});


// Mouse event
painting.canvas.addEventListener('mousedown', (e) => {
    switch (state) {
        case 'brush':
            painting.isDrawing = true;
            painting.lastX = e.offsetX * painting.canvas.width / painting.canvas.clientWidth | 0;
            painting.lastY = e.offsetY * painting.canvas.height / painting.canvas.clientHeight | 0;
            break;
        case 'bucket':
            painting.lastX = e.offsetX * painting.canvas.width / painting.canvas.clientWidth | 0;
            painting.lastY = e.offsetY * painting.canvas.height / painting.canvas.clientHeight | 0;
            painting.bucketFloodFill(painting.lastX, painting.lastY, hexToRgba(painting.color, 255));
            document.querySelector('#brushBtn').click();
            break;
        case 'ruler':
            if (painting.getScale(e) == true) {
                document.querySelector('#scaleText').innerHTML = 'OK';
            };
            break;
        case 'area':
            break;
        case 'select':
            painting.isDrawing = true;
            painting.lastX = e.offsetX * painting.canvas.width / painting.canvas.clientWidth | 0;
            painting.lastY = e.offsetY * painting.canvas.height / painting.canvas.clientHeight | 0;
            break;
    }
});

painting.canvas.addEventListener('mousemove', (e) => {
    // painting.changeColor();
    painting.changeStroke();

    switch (state) {
        case 'brush':
            painting.startDrawing(e);
            break;
        case 'select':
            painting.getSelectArea(e);
            break;
    }
});

painting.canvas.addEventListener('mouseout', () => painting.isDrawing = false);

painting.canvas.addEventListener('mouseup', () => {
    painting.isDrawing = false;
    painting.saveHistory();
});

// Touch event
painting.canvas.addEventListener('touchstart', (e) => {
    switch (state) {
        case 'brush':
            painting.isDrawing = true;
            painting.left = painting.canvas.getBoundingClientRect().left;
            painting.top = painting.canvas.getBoundingClientRect().top;
            painting.lastX = e.touches[0].clientX - painting.left;
            painting.lastY = e.touches[0].clientY - painting.top;
            break;
        case 'bucket':
            painting.isDrawing = true;
            painting.left = painting.canvas.getBoundingClientRect().left;
            painting.top = painting.canvas.getBoundingClientRect().top;
            painting.lastX = e.touches[0].clientX - painting.left;
            painting.lastY = e.touches[0].clientY - painting.top;
            painting.bucketFloodFill(painting.lastX, painting.lastY, hexToRgba(painting.color, 255));
            document.querySelector('#brushBtn').click();
            break;
        case 'ruler':
            if (painting.getScale(e) == true) {
                document.querySelector('#scaleText').innerHTML = 'OK';
            };
            break;
        case 'area':
            break;
        case 'select':
            painting.isDrawing = true;
            painting.left = painting.canvas.getBoundingClientRect().left;
            painting.top = painting.canvas.getBoundingClientRect().top;
            painting.lastX = e.touches[0].clientX - painting.left;
            painting.lastY = e.touches[0].clientY - painting.top;
            break;
    }
});

painting.canvas.addEventListener('touchmove', (e) => {
    if (e.targetTouches.length == 1) {
        // painting.changeColor();
        painting.changeStroke();
        painting.touchStartDrawing(e, painting.left, painting.top);
    }
});


painting.canvas.addEventListener('touchend', () => {
    painting.isDrawing = false;
    painting.saveHistory();
});

// Save Image
document.querySelector('#saveImageBtn').addEventListener('click', () => painting.saveImage());

// Open Image
let openImageInput = document.querySelector('#openImageInput');
document.querySelector('#openImageBtn').addEventListener('click', () => {
    openImageInput.click();
});
openImageInput.addEventListener('change', () => {
    painting.displayImg();
});


// Brush toolbar
document.querySelector('#brushBtn').addEventListener('click', () => {
    changeActive('#brushBtn');
    state = 'brush';
});

document.querySelector('#eraserBtn').addEventListener('click', () => {
    changeActive('#eraserBtn');
    state = 'brush';
    painting.color = '#e8e8e8'
});

document.querySelector('#bucketBtn').addEventListener('click', () => {
    changeActive('#bucketBtn');
    state = 'bucket';
});

// Area toolbar
document.querySelector('#rulerBtn').addEventListener('click', () => {
    changeActive('#rulerBtn');
    state = 'ruler';

    painting.length = window.prompt("輸入長度");
});

document.querySelector('#areaBtn').addEventListener('click', () => {
    changeActive('#areaBtn');
    state = 'area';
});

document.querySelector('#selectBtn').addEventListener('click', () => {
    changeActive('#selectBtn');
    painting.img.src = painting.canvas.toDataURL();
    state = 'select';
});

document.querySelector('#cutBtn').addEventListener('click', () => {
    if (painting.selectflag == 1) {
        painting.cutSelectArea();
        painting.selectflag = 0;
    }
});

// Undo, Redo, Clear Tool 
document.querySelector('#undo').addEventListener('click', () => painting.undo());
document.querySelector('#redo').addEventListener('click', () => painting.redo());
document.querySelector('#clearAll').addEventListener('click', () => painting.clearAll());

document.querySelector('#predictAreaBtn').addEventListener('click', () => painting.areaUpload());
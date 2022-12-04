import { Paint } from './paint.js';
import * as style from './style.js';
import * as chart from './chart.js';
import * as login from '../../js/login.js';

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let painting = new Paint(canvas, ctx);

// randon tmpfile path
let temp_key = login.randomString(20);

// mouse click status
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

// bucket and frontend area calculate algorithm.
function floodFill(x, y, color, area) {
    let pixels_num = 0
    let pixel_stack = [{ x: x, y: y }];
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let linear_cords = (y * canvas.width + x) * 4;
    let original_color = {
        r: pixels.data[linear_cords],
        g: pixels.data[linear_cords + 1],
        b: pixels.data[linear_cords + 2],
        a: pixels.data[linear_cords + 3]
    };

    while (pixel_stack.length > 0) {
        let new_pixel = pixel_stack.shift();
        let x = new_pixel.x;
        let y = new_pixel.y;

        // console.log(x + ", " + y);

        linear_cords = (y * canvas.width + x) * 4;
        while (y >= 0 &&
            (pixels.data[linear_cords] == original_color.r &&
                pixels.data[linear_cords + 1] == original_color.g &&
                pixels.data[linear_cords + 2] == original_color.b &&
                pixels.data[linear_cords + 3] == original_color.a)) {
            linear_cords -= canvas.width * 4;
            y--;
        }
        linear_cords += canvas.width * 4;
        y++;

        let reached_left = false;
        let reached_right = false;
        while (y++ < canvas.height &&
            (pixels.data[linear_cords] == original_color.r &&
                pixels.data[linear_cords + 1] == original_color.g &&
                pixels.data[linear_cords + 2] == original_color.b &&
                pixels.data[linear_cords + 3] == original_color.a)) {
            pixels.data[linear_cords + 3] = color;
            pixels_num++;

            if (x > 0) {
                if (pixels.data[linear_cords - 4] == original_color.r &&
                    pixels.data[linear_cords - 4 + 1] == original_color.g &&
                    pixels.data[linear_cords - 4 + 2] == original_color.b &&
                    pixels.data[linear_cords - 4 + 3] == original_color.a) {
                    if (!reached_left) {
                        pixel_stack.push({ x: x - 1, y: y });
                        reached_left = true;
                    }
                } else if (reached_left) {
                    reached_left = false;
                }
            }

            if (x < canvas.width - 1) {
                if (pixels.data[linear_cords + 4] == original_color.r &&
                    pixels.data[linear_cords + 4 + 1] == original_color.g &&
                    pixels.data[linear_cords + 4 + 2] == original_color.b &&
                    pixels.data[linear_cords + 4 + 3] == original_color.a) {
                    if (!reached_right) {
                        pixel_stack.push({ x: x + 1, y: y });
                        reached_right = true;
                    }
                } else if (reached_right) {
                    reached_right = false;
                }
            }

            linear_cords += canvas.width * 4;
        }
    }

    if (area == true) {
        let perpixel = Math.pow(Math.pow((painting.x2 - painting.x1), 2) + Math.pow((painting.y2 - painting.y1), 2), 0.5);
        let pixel_scale = painting.length / perpixel;
        let str = (pixels_num * (pixel_scale * pixel_scale)).toFixed(2) + "c㎡"
        alert(str);
        // document.querySelector('.front-areatext').innerHTML = str;
        style.areatextPosition(str);
        style.toastPosition();
    }
    pixels_num = 0;
    ctx.putImageData(pixels, 0, 0);
}

function changeActive(idName) {
    for (let i in toolbarBtnlist) {
        document.querySelector(toolbarBtnlist[i]).classList.remove('active');
    }
    if (idName != NaN) {
        document.querySelector(idName).classList.add('active');
    }
};

function getCoordinate(e) {
    painting.lastX = e.offsetX * painting.canvas.width / painting.canvas.clientWidth | 0;
    painting.lastY = e.offsetY * painting.canvas.height / painting.canvas.clientHeight | 0;
}

function getTouchCoordinate(e) {
    painting.left = painting.canvas.getBoundingClientRect().left;
    painting.top = painting.canvas.getBoundingClientRect().top;
    painting.lastX = parseInt(e.touches[0].clientX - painting.left)
    painting.lastY = parseInt(e.touches[0].clientY - painting.top)
}

window.addEventListener('mousedown', () => {
    $("#message").popover('hide');
});

window.addEventListener('load', () => {
    console.log("#####  version 1.1.16  #####");
    console.log("#####  fix undo empty  #####");

    // painting.init()
    // painting.loaded()

    painting.saveHistory("brushbtn");
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

document.querySelector('#nav-predict-tab').addEventListener('click', () => {
    state = null;
});

// Mouse event
painting.canvas.addEventListener('mousedown', (e) => {
    getCoordinate(e)
    switch (state) {
        case 'brush':
            painting.isDrawing = true;
            break;
        case 'bucket':
            painting.bucketFloodFill(painting.lastX, painting.lastY, hexToRgba(painting.color, 255));
            document.querySelector('#brushBtn').click();
            break;
        case 'ruler':
            if (painting.getScale(e) == true) {
                document.querySelector('#scaleText').innerHTML = 'OK';
                document.querySelector('#brushBtn').click()

                // scale ready animate
                document.querySelector('#rulerBtn').classList.add("btn-danger");
                document.querySelector('#rulerBtn').classList.remove("btn-outline-secondary");
            };
            break;
        case 'area':
            floodFill(painting.lastX, painting.lastY, 250, true);
            floodFill(painting.lastX, painting.lastY, 255, false);

            // upload image for frontend area compute
            if (painting.frontUploadFlag != 0) {
                painting.frontendAreaUpload()
            }

            document.querySelector('#brushBtn').click()
            break;
        case 'select':
            painting.isDrawing = true;
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
    if (state) {
        painting.isDrawing = false;
        painting.saveHistory();
    }
});



// Touch event
painting.canvas.addEventListener('touchstart', (e) => {
    getTouchCoordinate(e)
    switch (state) {
        case 'brush':
            painting.isDrawing = true;
            break;
        case 'bucket':
            painting.bucketFloodFill(painting.lastX, painting.lastY, hexToRgba(painting.color, 255));
            document.querySelector('#brushBtn').click();
            break;
        case 'area':
            floodFill(painting.lastX, painting.lastY, 250, true);
            floodFill(painting.lastX, painting.lastY, 255, false);

            // upload image for frontend area compute
            if (painting.frontUploadFlag != 0) {
                painting.frontendAreaUpload()
            }

            document.querySelector('#brushBtn').click()
            break;
        case 'select':
            painting.isDrawing = true;
            break;
    }
});

painting.canvas.addEventListener('touchmove', (e) => {
    if (e.targetTouches.length == 1) {
        switch (state) {
            case 'brush':
                painting.touchStartDrawing(e, painting.left, painting.top);
                break;
            case 'select':
                painting.getSelectAreaMobile(e);
                break;
        }
    }
});


painting.canvas.addEventListener('touchend', () => {
    painting.isDrawing = false;
    painting.saveHistory("touchend");
});

// Save Image
document.querySelector('#saveImageBtn').addEventListener('click', () => painting.saveImage());

// Open Image
let openImageInput = document.querySelector('#openImageInput');
document.querySelector('#openImageBtn').addEventListener('click', () => {
    openImageInput.click();
    document.querySelector('#nav-home-tab').click()
});

openImageInput.addEventListener('change', () => {
    painting.frontUploadFlag = 1;
    painting.displayImg();
    document.querySelector('#brushBtn').click();
    document.querySelector('.front-areatext').innerHTML = '';
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
    painting.length = window.prompt("Enter real lenght(c㎡) for to scale calculate the area\nthan choose two point in the uploda image. ");
    if (painting.length != null) {
        changeActive('#rulerBtn');
        state = 'ruler';
    }
});

document.querySelector('#areaBtn').addEventListener('click', () => {
    if (painting.length != 0) {
        changeActive('#areaBtn');
        alert('Click wound compute area!')
        state = 'area';
    } else {
        alert('No scale, Please give scale first!')
    }
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
        painting.backPredictFlag = true;
    }
});

// undo, redo, clear toolbar 
document.querySelector('#undo').addEventListener('click', () => painting.undo(state));
document.querySelector('#redo').addEventListener('click', () => painting.redo(state));
document.querySelector('#clearAll').addEventListener('click', () => painting.clearAll());

// predict btn, upload original image to backend then predict.
document.querySelector('#predictAreaBtn').addEventListener('click', () => {
    if (painting.length == 0) {
        alert('No scale, Please give scale first!');
    } else if (painting.backPredictFlag != true) {
        alert('This is same images!');
    } else {
        document.querySelector('#nav-predict-tab').click();
        let close = document.querySelectorAll('.btn-close');
        for (let i = 0; i < close.length; i++) {
            close[i].click();
        }
        painting.backend_predict(temp_key);
        painting.backPredictFlag = false;
    }
});

// iou btn, upload cavans image to backend with predcit result do iou calculate.
document.querySelector('#iouBtn').addEventListener('click', () => {
    if (painting.iouFlag) {
        document.querySelector('#nav-predict-tab').click();
        let close = document.querySelectorAll('.btn-close');
        for (let i = 0; i < close.length; i++) {
            close[i].click();
        }
        painting.backend_iou_upload(temp_key);
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

// document.querySelector('#testBtn').addEventListener('click', async () => {
//     let session_id = getCookie('PHPSESSID');
//     let data = {
//         "session_id": session_id,
//     }
//     await fetch("../php/get_area.php", {
//         method: "POST",
//         body: JSON.stringify(data)
//     })
//         .then((response) => {
//             return response.json();
//         })
//         .then((response) => {
//             console.log(response);
//         })
// });

// document.querySelector('#test2Btn').addEventListener('click', async () => {
//     let session_id = getCookie('PHPSESSID');
//     let data = {
//         "session_id": session_id,
//     }
//     await fetch("../php/test.php", {
//         method: "POST",
//         body: JSON.stringify(data)
//     })
//         .then((response) => {
//             return response.json();
//         })
//         .then((response) => {
//             console.log(response);
//         })
// });
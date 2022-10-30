import { Paint } from './Paint.js';
import { sha256 } from '../../js/hash.js';

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let painting = new Paint(canvas, ctx);

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
        document.querySelector('.front-areatext').innerHTML = str;
        toastPosition();
    }
    pixels_num = 0;
    ctx.putImageData(pixels, 0, 0);
}

function toastPosition() {
    let toastContainer = document.querySelector('.toast-container')
    toastContainer.style.transform = 'translate(' + (window.innerWidth - 310) + 'px,' + (70) + 'px)';

    let frontAreatext = document.querySelector('.front-areatext')
    let text_width = frontAreatext.offsetWidth;
    let text_height = frontAreatext.offsetHeight;
    frontAreatext.style.transform = 'translate(' + (window.innerWidth - (text_width + 15)) + 'px,' + (window.innerHeight - (text_height + 15)) + 'px)';
}

window.addEventListener('mousedown', () => {
    $("#message").popover('hide');
});

window.addEventListener('load', () => {
    // painting.init()
    // painting.loaded()
    // previewImgHeight()

    // paint version log
    console.log("##### version 1.01 #####")

    $("#message").popover('show');
    // $(".dropdown-menu").show();

    document.querySelector('#brushBtn').click();
    painting.saveHistory("brushbtn");

    toastPosition();
});

window.addEventListener('resize', () => {
    // painting.init()
    // painting.loaded()
    previewImgHeight();
    toastPosition();
});

window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = "Write something clever here..";
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
    painting.isDrawing = false;
    painting.saveHistory();
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
    changeActive('#rulerBtn');
    state = 'ruler';
    painting.length = window.prompt("Enter real lenght(c㎡) for to scale calculate the area\nthan choose two point in the uploda image. ");
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
    }
});

// Undo, Redo, Clear Tool 
document.querySelector('#undo').addEventListener('click', () => painting.undo(state));
document.querySelector('#redo').addEventListener('click', () => painting.redo(state));
document.querySelector('#clearAll').addEventListener('click', () => painting.clearAll());

// Predict btn
document.querySelector('#predictAreaBtn').addEventListener('click', () => {
    if (painting.length != 0) {
        document.querySelector('#nav-predict-tab').click()
        let close = document.querySelectorAll('.btn-close');
        for (let i = 0; i < close.length; i++) {
            close[i].click();
        }
        painting.backend_upload();
    } else {
        alert('No scale, Please give scale first!');
    }
});


// Iou btn
document.querySelector('#iouBtn').addEventListener('click', () => {
    document.querySelector('#nav-predict-tab').click()
    let close = document.querySelectorAll('.btn-close');
    for (let i = 0; i < close.length; i++) {
        close[i].click();
    }
    painting.backend_iou_upload();
});

document.querySelector('#iou_img').addEventListener('click', () => {
    document.querySelector('#nav-home-tab').click();
});

// Signup
document.querySelector('#signupForm').addEventListener('submit', async (event) => {
    let form = document.querySelector('#signupForm');
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['password'] = sha256(formDataObiect['password']);
        let response = (async () => {
            return await fetch("../php/sql_signup.php", {
                method: "POST",
                body: JSON.stringify(formDataObiect)
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })
        })();

        await response.then((response) => {
            if (!response['sql_connection']){
                alert(response['sql_connection_error']);
                return;
            } 

            if (!response['invite_code']){
                alert("Error: Incorrect invitation code!");
                return;
            } 

            if (!response['exist']){
                alert("Account created successfully!");
            } else{
                alert("Account already existed!");
                return;
            }

            document.querySelector('#modalSignup').querySelector('.btn-close').click();
            let input = document.querySelector('#modalSignup').querySelectorAll('input');
            for (let i = 0; i < input.length; i++){
                input[i].value = null;
            }
            document.querySelector('#signupAgree').checked = false;
        });
    }
})

// Test btn
document.querySelector('#testBtn').addEventListener('click', async () => {
})
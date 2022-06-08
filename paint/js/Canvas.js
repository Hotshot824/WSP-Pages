//####################################################################################
//###                             以下為Benson新增                                  ###
//####################################################################################

// state, 0==Brush, 1==eraser, 2==Bucket 3==ruler
var state = 0;
var areaPixelsNum = 0;

// 切換顯示
var iconList = ['.paintBucket', '.paintBrush', '.eraser', '.ruler', '.area'];
function iconChange(className) {
    for (let i in iconList) {
        if (className == iconList[i]) {
            $(iconList[i]).removeClass('unchoose');
        } else {
            $(iconList[i]).addClass('unchoose');
        }
    }
}

// 油漆桶功能
$('.paintBucket').click(function () {
    state = 2;

    // 切換按鈕外觀
    canvas.style = "cursor:cell;"
    iconChange('.paintBucket');
});

//面積功能
$('.area').click(function () {
    state = 4;

    //切換按鈕外觀
    if (realScale != 0 && pixelScale != 0) {
        canvas.style = "cursor:crosshair;"
        alert('點擊傷口標籤獲得傷口面積')
        iconChange('.area');
    } else {
        alert('No scale, Please give scale first!')
    }
});

//比例尺功能
var realScale = 0;
var pixelScale = 0;
$('.ruler').click(function () {
    state = 3;

    canvas.style = "cursor:crosshair;"
    //切換按鈕外觀
    iconChange('.ruler');

    realScale = window.prompt("請輸入長度, 然後在圖片上點擊兩點");
    document.querySelector('#scaleText').innerHTML = realScale + '/' + pixelScale.toFixed(2);
});

var count = 1;
var x1, y1, x2, y2;
var scalePC = { x1: x1, y1: y1, x2: x2, y2: y2 };
function scaleGet(x, y) {
    if (count == 1) {
        scalePC.x1 = x;
        scalePC.y1 = y;
        count++;
    }
    else {
        scalePC.x2 = x;
        scalePC.y2 = y;
        alert("輸入完畢, 此2點之間的距離為" + realScale);
        count = 1;
        let perpixel = Math.pow(Math.pow((scalePC.x2 - scalePC.x1), 2) + Math.pow((scalePC.y2 - scalePC.y1), 2), 0.5);
        pixelScale = realScale / perpixel;
        document.querySelector('#scaleText').innerHTML = realScale + '/' + pixelScale.toFixed(2);
        document.querySelector('.paintBrush').click()
        // console.log(scalePC.x1, scalePC.y1, scalePC.x2, scalePC.y2, perpixel, pixelScale);
    }

}

//測試笑臉
function testDrawing() {
    ctx.beginPath();
    ctx.arc(475, 475, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(510, 475);
    ctx.arc(475, 475, 35, 0, Math.PI, false);   // Mouth (clockwise)
    ctx.moveTo(465, 465);
    ctx.arc(460, 465, 5, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(495, 465);
    ctx.arc(490, 465, 5, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke();
}

function hexToRgba(hex, opacity) {
    return {
        r: parseInt("0x" + hex.slice(1, 3)),
        g: parseInt("0x" + hex.slice(3, 5)),
        b: parseInt("0x" + hex.slice(5, 7)),
        a: opacity
    }
}

function boundartyFill(x, y, color) {
    pixel_stack = [{ x: x, y: y }];
    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var linear_cords = (y * canvas.width + x) * 4;
    original_color = {
        r: pixels.data[linear_cords],
        g: pixels.data[linear_cords + 1],
        b: pixels.data[linear_cords + 2],
        a: pixels.data[linear_cords + 3]
    };

    while (pixel_stack.length > 0) {
        new_pixel = pixel_stack.shift();
        x = new_pixel.x;
        y = new_pixel.y;

        // console.log( x + ", " + y );

        linear_cords = (y * canvas.width + x) * 4;
        while (y-- >= 0 &&
            !(pixels.data[linear_cords] == color.r &&
                pixels.data[linear_cords + 1] == color.g &&
                pixels.data[linear_cords + 2] == color.b &&
                pixels.data[linear_cords + 3] == color.a)) {
            linear_cords -= canvas.width * 4;
        }
        linear_cords += canvas.width * 4;
        y++;

        var reached_left = false;
        var reached_right = false;
        while (y++ < canvas.height &&
            !(pixels.data[linear_cords] == color.r &&
                pixels.data[linear_cords + 1] == color.g &&
                pixels.data[linear_cords + 2] == color.b &&
                pixels.data[linear_cords + 3] == color.a)) {
            pixels.data[linear_cords] = color.r;
            pixels.data[linear_cords + 1] = color.g;
            pixels.data[linear_cords + 2] = color.b;
            pixels.data[linear_cords + 3] = color.a;

            if (x > 0) {
                if (!(pixels.data[linear_cords - 4] == color.r &&
                    pixels.data[linear_cords - 4 + 1] == color.g &&
                    pixels.data[linear_cords - 4 + 2] == color.b &&
                    pixels.data[linear_cords - 4 + 3] == color.a)) {
                    if (!reached_left) {
                        pixel_stack.push({ x: x - 1, y: y });
                        reached_left = true;
                    }
                } else if (reached_left) {
                    reached_left = false;
                }
            }

            if (x < canvas.width - 1) {
                if (!(pixels.data[linear_cords + 4] == color.r &&
                    pixels.data[linear_cords + 4 + 1] == color.g &&
                    pixels.data[linear_cords + 4 + 2] == color.b &&
                    pixels.data[linear_cords + 4 + 3] == color.a)) {
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
    ctx.putImageData(pixels, 0, 0);
}

function floodFill(x, y, color, area) {
    pixel_stack = [{ x: x, y: y }];
    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var linear_cords = (y * canvas.width + x) * 4;
    original_color = {
        r: pixels.data[linear_cords],
        g: pixels.data[linear_cords + 1],
        b: pixels.data[linear_cords + 2],
        a: pixels.data[linear_cords + 3]
    };

    while (pixel_stack.length > 0) {
        new_pixel = pixel_stack.shift();
        x = new_pixel.x;
        y = new_pixel.y;

        // console.log(x + ", " + y);

        linear_cords = (y * canvas.width + x) * 4;
        while (y-- >= 0 &&
            (pixels.data[linear_cords] == original_color.r &&
                pixels.data[linear_cords + 1] == original_color.g &&
                pixels.data[linear_cords + 2] == original_color.b &&
                pixels.data[linear_cords + 3] == original_color.a)) {
            linear_cords -= canvas.width * 4;
        }
        linear_cords += canvas.width * 4;
        y++;

        var reached_left = false;
        var reached_right = false;
        while (y++ < canvas.height &&
            (pixels.data[linear_cords] == original_color.r &&
                pixels.data[linear_cords + 1] == original_color.g &&
                pixels.data[linear_cords + 2] == original_color.b &&
                pixels.data[linear_cords + 3] == original_color.a)) {
            pixels.data[linear_cords + 3] = color;
            areaPixelsNum++;

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
        alert((areaPixelsNum * (pixelScale * pixelScale)).toFixed(2) + "c㎡");
    }
    areaPixelsNum = 0;
    ctx.putImageData(pixels, 0, 0);
}

//####################################################################################
//###                                   END                                        ###
//####################################################################################

$(document).ready(function () {
    //區塊滑動
    var n = 0; //記算點按次數(upper)
    var i = 0; //記算點按次數(lower)

    $("#upperControlKey").click(function () {
        $('nav').slideToggle();
        n++;
        //判斷變更符號
        if (n % 2 === 1) {
            $("#upperControlKey").text('▼');
        } else {
            $("#upperControlKey").text('▲');
        }

    });

    $("#lowerControlKey").click(function () {
        $('#itemBox').slideToggle();
        i++;
        //判斷變更符號
        if (i % 2 === 1) {
            $("#lowerControlKey").text('▲');
        } else {
            $("#lowerControlKey").text('▼');
        }

    });
});

//功能鍵定義
const keyClear = document.querySelector('.keyClear');
const keyUndo = document.querySelector('.keyUndo');
const keyRedo = document.querySelector('.keyRedo');
//歷史紀錄(步驟次數與畫布陣列值需相符)
let step = -1;        //步驟次數
let userhistory = []; //畫布數值（每筆劃記錄座標)

//畫布範圍
const canvas = document.querySelector('#canvas');

//畫筆控制及初始畫布
const ctx = canvas.getContext('2d'); //canvas定義為2D
//視窗讀取時，則執行
window.addEventListener('load', function () {
    init();   //畫筆初始
    loaded(); //畫布佈置
    layout(); //介面佈置
    testDrawing();
});

//控制滑鼠移動時，畫下筆畫，預設值為false
let isDrawing = false;

//設定滑鼠座標(0,0)
let lastX = 0;
let lastY = 0;


//電腦滑鼠事件監聽
//點按滑鼠更新座標
canvas.addEventListener('mousedown', function (obj) {
    [lastX, lastY] = [obj.offsetX, obj.offsetY];

    if (state == 0 || state == 1) {
        isDrawing = true;
        //移動滑鼠開始畫畫
    } else if (state == 2) {
        boundartyFill(lastX, lastY, color = hexToRgba(ctx.strokeStyle, 255));
        document.querySelector('.paintBrush').click()
    } else if (state == 3) {
        scaleGet(lastX, lastY);
    } else if (state == 4) {
        floodFill(lastX, lastY, color = 250, area = true);
        floodFill(lastX, lastY, color = 255, area = false);
        document.querySelector('.paintBrush').click()
    }
});

canvas.addEventListener('mousemove', function (obj) {

    if (!isDrawing) { return }; //停止繪畫動作

    ctx.beginPath();          //路徑開始
    ctx.moveTo(lastX, lastY); //路徑結束
    ctx.lineTo(obj.offsetX, obj.offsetY);
    ctx.stroke();
    ctx.save();
    [lastX, lastY] = [obj.offsetX, obj.offsetY];

});

//當滑鼠放開時，停止畫畫
canvas.addEventListener('mouseout', () => isDrawing = false);

//每次放開滑鼠時，紀錄加1，並移除disable css外觀
canvas.addEventListener('mouseup', function () {

    record();
    if (userhistory.length > 0) {
        keyUndo.classList.remove('disable');
        keyClear.classList.remove('disable');
    } //畫下第一筆後，要將undo及clear鈕解鎖
    keyRedo.classList.add('disable'); //每一筆新劃的筆劃都沒有重作
    isDrawing = false;
});

//手機touch事件監聽
//手機點壓，更新座標
canvas.addEventListener('touchstart', function (obj) {

    obj.preventDefault();     //阻止瀏覽器預設事件
    var setX = obj.touches[0].clientX; //取得X座標
    var setY = obj.touches[0].clientY; //取得Y座標
    [lastX, lastY] = [parseInt(setX), parseInt(setY)];

    if (state == 0) {
        isDrawing = true; //令畫筆可以使用
    } else if (state == 2) {
        boundartyFill(lastX, lastY, color = hexToRgba(ctx.strokeStyle, 255));
        document.querySelector('.paintBrush').click()
    } else if (state == 3) {
        document.querySelector('.paintBrush').click()
    } else if (state == 4) {
        floodFill(lastX, lastY, color = hexToRgba(ctx.strokeStyle, 255));
    }
});

//滑動，開始畫畫
canvas.addEventListener('touchmove', function (obj) {

    var setX = obj.touches[0].clientX; //取得X座標
    var setY = obj.touches[0].clientY; //取得Y座標
    obj.preventDefault();     //阻止瀏覽器預設事件
    if (!isDrawing) { return };   //停止繪畫動作
    ctx.beginPath();          //路徑開始
    ctx.moveTo(lastX, lastY); //路徑結束
    ctx.lineTo(setX, setY);
    ctx.stroke();
    ctx.save();
    [lastX, lastY] = [setX, setY];
});

//移開touch觸發事件(執行紀錄，解鎖功能鈕)
canvas.addEventListener('touchend', function (obj) {

    record();
    if (userhistory.length > 0) {
        keyUndo.classList.remove('disable');
        keyClear.classList.remove('disable');
    } //畫下第一筆後，要將undo及clear鈕解鎖
    keyRedo.classList.add('disable'); //每一筆新劃的筆劃都沒有重作
    isDrawing = false;  //令畫筆不能使用

});

//上傳按鈕
$('.keyUpload').click(function () {
    document.querySelector('#inputImg').click();
});
document.querySelector('#inputImg').addEventListener('change', () => {
    let image = new Image();
    let upload = document.querySelector('#inputImg');
    if (upload.files && upload.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            image.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(upload.files[0]);
    }

    image.addEventListener('load', e => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    });
});

//上段功能鍵利用
//下載按鈕(創造A元素下載)
$('.keySave').click(function () {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'Save';
    link.click();
});

//清空鍵(回初始設定)
keyClear.addEventListener('click', function () {

    //上段功能按鍵變成不可用
    keyUndo.classList.add('disable');
    keyRedo.classList.add('disable');
    keyClear.classList.add('disable');
    //畫布、紀錄重新整理
    loaded();
})


//Undo鍵
keyUndo.addEventListener('click', function () {

    if (step > 0) {
        step--
        const pic = new Image(); //建立新的 Image
        pic.src = userhistory[step]; //載入影像
        pic.onload = function () { ctx.drawImage(pic, 0, 0) }; //將影像繪出 0, 0 表示座標起始位置
    }

    //判斷已無步驟回復時
    if (step === 0) {
        keyUndo.classList.add('disable');     //undo鍵不能用(步驟=0時)
    } else if (step < userhistory.length && step > 0) {
        keyRedo.classList.remove('disable');  //redo鍵可以用
    }

});

//Redo鍵
keyRedo.addEventListener('click', function () {

    if (step < userhistory.length - 1) {
        step++;
        const pic = new Image();
        pic.src = userhistory[step];
        pic.onload = function () { ctx.drawImage(pic, 0, 0) };
    }

    //判斷步驟是最後時
    if (userhistory.length - 1 === step) {
        keyRedo.classList.add('disable');
    } else if (step > 0) {
        keyUndo.classList.remove('disable');
    }

});


//工具列應用
//畫筆尺寸設定
$('.penPath').change(function () {

    let penPathNum = Number(document.querySelector('.penPath').value);

    if (isNaN($('.penPath').val())) {
        alert("請輸入中文");
        $('.penPath').val(10);
        ctx.lineWidth = 10;
        return
    }
    if (penPathNum >= 101) {
        alert("畫筆最大設定為100");
        $('.penPath').val(10);
        ctx.lineWidth = 10;
    } else if (penPathNum <= 0) {
        alert("畫筆數值不小於零");
        $('.penPath').val(10);
        ctx.lineWidth = 10;
    } else {
        ctx.lineWidth = penPathNum;
        $('.penPath').val(penPathNum);  //防止前數有0
    }

});

//畫筆尺寸設定（鍵盤用）
$('.penPath').keyup(function (obj) {

    let penPathNum = Number(document.querySelector('.penPath').value);
    if (obj.keyCode === 13 && penPathNum !== '') {
        ctx.lineWidth = penPathNum;
        $('.penPath').val(penPathNum);  //防止前數有0
        $('.penPath').blur(); //input失去焦點
    }
});



//填上顏色及顏色設定
var colorArray = ['#000000', '#FFFFFF'];

//色圈背景填色
for (var i = 0; i < colorArray.length; i++) {
    var str = '';
    str +=
        `
    <div class="colorItem" style="background:${colorArray[i]}">
        
    </div>
    `
        ;
    $('.colorAfter').after(str);

}

//選色框
const colorItem = document.querySelectorAll('.colorItem');

for (var i = 0; i < colorItem.length; i++) {

    colorItem[i].addEventListener('click', function (obj) {
        //切換按鈕外觀
        iconChange('.paintBrush');

        colorItem.forEach(function (item) {
            const check = item;
            check.textContent = ''; //將其餘勾選部份取消
            if (obj.target.className === 'colorItem') {
                var penColor = obj.target.style.backgroundColor;
                ctx.strokeStyle = penColor;
                obj.target.textContent = 'X';
            }
        })

    });
}

//橡皮擦功能
$('.eraser').click(function () {
    state = 1;
    //切換按鈕外觀
    iconChange('.eraser');
    canvas.style = "cursor:default;"
    //設定畫筆顏色為背景色
    ctx.strokeStyle = '#E8E8E8';

    //令所有的色塊框內勾選取消
    for (var i = 0; i < colorItem.length; i++) {
        colorItem[i].textContent = '';
    }

});


//畫筆功能
$('.paintBrush').click(function () {
    state = 0;
    //切換按鈕外觀
    canvas.style = "cursor:default;"
    iconChange('.paintBrush');
    //假使colorItem已有被選取,則彈回(無作用)
    for (var i = 0; i < colorItem.length; i++) {
        if (colorItem[i].textContent === 'X') { return }
    }
    //畫筆回到初始值
    colorItem[0].textContent = 'X'; //選色初始設定
    ctx.strokeStyle = '#FFFFFF';    //指定畫筆顏色
    ctx.lineWidth = 5;             //指定畫筆大小
});


//視窗被resize時，更新畫布
window.addEventListener('resize', function () {
    //重新定義畫布    
    if (canvas === undefined) {
        canvas = createCanvas();
        ctx = canvas.getContext("2d");
    }
    //執行record
    init();
    //紀錄恢復原值
    loaded();
    //外觀回復原值
    layout();

});


//複用函式區
//畫筆及畫布初始化
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.strokeStyle = '#FFFFFF';    //畫筆顏色
    ctx.lineJoin = 'round';         //
    ctx.lineCap = 'round';          //繪製結束的線帽
}

//視窗載入讀取
function loaded() {
    ctx.fillStyle = '#E8E8E8'; //讓第一次進來跑 function 的時候就加上背景顏色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    step = -1;
    userhistory = [];
    record();
}

//介面初始化
function layout(obj) {
    //橡皮擦disable
    $('.eraser').addClass('unchoose');
    $('.paintBucket').addClass('unchoose');
    $('.eraser').addClass('unchoose');
    $('.ruler').addClass('unchoose');
    $('.area').addClass('unchoose');
    //選色框初始化
    for (var i = 0; i < colorItem.length; i++) {
        if (i === 0) {
            colorItem[i].textContent = 'X';
        } else {
            colorItem[i].textContent = '';
        }
    }

    //penPath設置初始值
    if ($('.penPath').val() == '') {
        $('.penPath').val(5);
        ctx.lineWidth = $('.penPath').val();    //筆畫初始大小   
    } else {
        ctx.lineWidth = $('.penPath').val();
    }
    //按鍵變成不可用
    keyUndo.classList.add('disable');
    keyRedo.classList.add('disable');
    keyClear.classList.add('disable');
}

//記錄步驟紀錄(陣列push,步驟+1)
function record() {
    step++; //步驟加一
    if (step < userhistory.length) userhistory.length = step
    userhistory.push(canvas.toDataURL());  //將影像存成Base64編碼
}

import { getStayIn } from '../../js/login.js'
import * as chart from './chart.js'

class Paint {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = '#ffffff';
        this.lineWidth = 10;
        this.lineJoin = "round";
        this.lineCap = "round";
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.99;
        this.canvas.beginHeight = window.innerHeight;

        this.setDrawingVar();
        this.setBaseScale();
        this.setCutScale();

        this.scal = 1;
        this.midx = window.innerWidth / 2;
        this.midy = window.innerHeight / 2;
        this.transOrigin = 0;
        this.forMarginLeft = 0;

        this.setFlag();
    }

    setDrawingVar() {
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.hue = 0;
        this.step = -1;
        this.historyArr = [];
        this.left = 0;
        this.top = 0;
        this.length = 0;
    }

    setBaseScale() {
        this.scaleCount = 1;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.ruler_deltax = 0;
        this.ruler_deltay = 0;
        this.origin_img_width = 0;
        this.origin_img_height = 0;
    }

    setCutScale() {
        this.selectflag = 0;
        this.perpixel = 0;
        this.img = new Image();
        this.cut_beginx;
        this.cut_beginy;
        this.cut_deltax;
        this.cut_deltay;
    }

    setFlag() {
        this.temp_key;
        this.original_img;
        this.original_label;
        this.frontUploadFlag = 0;
        this.iouFlag = false;
        this.backPredictFlag = true;
    }

    setCanvas(temp_height) {
        if (temp_height < this.canvas.beginHeight) {
            this.canvas.style.position = "absolute";
            this.canvas.style.display = "block";
            this.canvas.style.margin = "auto";
            this.canvas.style.left = 0;
            this.canvas.style.right = 0;
            this.canvas.style.top = 0;
            this.canvas.style.bottom = 0;
        } else {
            this.canvas.style.position = "absolute";
            this.canvas.style.display = "block";
            this.canvas.style.margin = "auto";
            this.canvas.style.left = 0;
            this.canvas.style.right = 0;
            this.canvas.style.top = "";
            this.canvas.style.bottom = "";
        }
    }

    startDrawing(e) {

        if (!this.isDrawing) return;

        this.ctx.strokeStyle = this.color;

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.offsetX * this.canvas.width / this.canvas.clientWidth | 0,
            e.offsetY * this.canvas.height / this.canvas.clientHeight | 0);

        this.ctx.lineJoin = this.lineJoin;
        this.ctx.lineCap = this.lineCap;

        this.ctx.stroke();
        this.lastX = e.offsetX * this.canvas.width / this.canvas.clientWidth | 0;
        this.lastY = e.offsetY * this.canvas.height / this.canvas.clientHeight | 0;

    }

    touchStartDrawing(e, left, top) {

        if (!this.isDrawing) return;
        e.preventDefault();

        this.ctx.strokeStyle = this.color;


        this.ctx.lineWidth = this.lineWidth;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.touches[0].clientX - left,
            e.touches[0].clientY - top);
        this.ctx.lineJoin = this.lineJoin;
        this.ctx.lineCap = this.lineCap;

        this.ctx.stroke();
        this.lastX = e.touches[0].clientX - left;
        this.lastY = e.touches[0].clientY - top;

    }

    scroll_big_small(e) {
        this.transOrigin = 0 + "px " + this.midy * this.scal + "px";
        this.forMarginLeft = window.innerWidth / 2 - (this.canvas.width * this.scal) / 2;
        if (this.forMarginLeft < 0) {
            this.forMarginLeft = "auto";
        }
        else {
            this.forMarginLeft = this.forMarginLeft + "px";
        }

        if (e.wheelDelta > 0 && e.ctrlKey) {
            this.canvas.style.position = "absolute";
            this.canvas.style.display = "block";
            this.canvas.style.marginLeft = this.forMarginLeft;

            this.scal = (parseFloat(this.scal) + 0.01).toFixed(2);
            this.canvas.style.transform = 'scale(' + this.scal + ')';
            this.canvas.style.transformOrigin = this.transOrigin;

        }
        else if (e.wheelDelta < 0 && e.ctrlKey) {

            this.canvas.style.position = "absolute";
            this.canvas.style.display = "block";
            this.canvas.style.marginLeft = this.forMarginLeft;

            this.scal = (parseFloat(this.scal) - 0.01).toFixed(2);
            this.canvas.style.transform = 'scale(' + this.scal + ')';
            this.canvas.style.transformOrigin = this.transOrigin;

        }
        return false;
    }

    changeStroke() {
        let strokeWidth = document.querySelector('#stroke').value;
        if (isNaN(strokeWidth)) return;
        this.lineWidth = strokeWidth;
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redo(str) {
        if (this.step < this.historyArr.length - 1) {
            this.step++;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {
                this.clearAll();
                this.setCanvas(canvasImg.height);
                this.canvas.setAttribute('width', canvasImg.width);
                this.canvas.setAttribute('height', canvasImg.height);
                this.ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height);
                if (str == "select") {
                    this.img = canvasImg;
                }
            })
        }
    }

    undo(str) {
        if (this.step > 0) {
            this.step--;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {
                this.clearAll();
                this.setCanvas(canvasImg.height);

                this.canvas.setAttribute('width', canvasImg.width);
                this.canvas.setAttribute('height', canvasImg.height);
                this.ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height);
                if (str == "select") {
                    this.img = canvasImg;
                }
            })
        }
    }

    getScale() {
        if (this.scaleCount == 1) {
            this.x1 = this.lastX;
            this.y1 = this.lastY;

            this.scaleCount++;
            return false;
        }
        else {
            this.x2 = this.lastX;
            this.y2 = this.lastY;
            alert("Enter complete, the distance between the two point is " + this.length);
            this.ruler_deltax = Math.abs(this.x2 - this.x1);
            this.ruler_deltay = Math.abs(this.y2 - this.y1);
            this.scaleCount--;
            return true;
        }
    }

    getScaleMobile(e) {
        if (this.scaleCount == 1) {
            this.x1 = e.offsetX;
            this.y1 = e.offsetY;

            this.scaleCount++;
            return false;
        }
        else {
            this.x2 = e.offsetX;
            this.y2 = e.offsetY;
            alert("Enter complete, the distance between the two point is " + this.length);
            this.ruler_deltax = Math.abs(this.x2 - this.x1);
            this.ruler_deltay = Math.abs(this.y2 - this.y1);
            this.scaleCount--;
            return true;
        }
    }

    getSelectArea(e) {
        // console.log("select");

        if (!this.isDrawing) return;

        this.ctx.strokeStyle = "black";

        //this.ctx.setLineDash([4, 8]);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

        this.cut_beginx = this.lastX;
        this.cut_beginy = this.lastY;

        this.cut_deltax = (e.offsetX * this.canvas.width / this.canvas.clientWidth | 0) - this.lastX;
        this.cut_deltay = (e.offsetY * this.canvas.height / this.canvas.clientHeight | 0) - this.lastY;

        this.ctx.strokeRect(this.lastX, this.lastY,
            this.cut_deltax, this.cut_deltay);
        this.selectflag = 1;
    }

    getSelectAreaMobile(e) {
        // console.log("select");
        e.preventDefault();
        if (!this.isDrawing) return;

        this.ctx.strokeStyle = "black";

        //this.ctx.setLineDash([4, 8]);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

        this.cut_beginx = this.lastX;
        this.cut_beginy = this.lastY;

        this.cut_deltax = e.touches[0].clientX - this.left - this.lastX;
        this.cut_deltay = e.touches[0].clientY - this.top - this.lastY;

        this.ctx.strokeRect(this.lastX, this.lastY,
            this.cut_deltax, this.cut_deltay);
        this.selectflag = 1;
    }

    cutSelectArea() {
        // console.log("cut");

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 改變寬度
        this.canvas.setAttribute('width', Math.abs(this.cut_deltax));
        this.canvas.setAttribute('height', Math.abs(this.cut_deltay));
        this.setCanvas(Math.abs(this.cut_deltay));


        // console.log("切割後的長 = " + this.cut_deltax + " 切割後的寬" + this.cut_deltay);

        if (this.cut_deltax >= 0 && this.cut_deltay >= 0) {
            this.ctx.drawImage(this.img, this.cut_beginx, this.cut_beginy, this.cut_deltax, this.cut_deltay,
                0, 0, this.cut_deltax, this.cut_deltay);
        }
        else if (this.cut_deltax < 0 && this.cut_deltay >= 0) {
            this.ctx.drawImage(this.img, this.cut_beginx + this.cut_deltax, this.cut_beginy,
                Math.abs(this.cut_deltax), this.cut_deltay,
                0, 0, Math.abs(this.cut_deltax), this.cut_deltay);
        }
        else if (this.cut_deltax >= 0 && this.cut_deltay < 0) {
            this.ctx.drawImage(this.img, this.cut_beginx, this.cut_beginy + this.cut_deltay,
                this.cut_deltax, Math.abs(this.cut_deltay),
                0, 0, this.cut_deltax, Math.abs(this.cut_deltay));
        }
        else {
            this.ctx.drawImage(this.img, this.cut_beginx + this.cut_deltax, this.cut_beginy + this.cut_deltay,
                Math.abs(this.cut_deltax), Math.abs(this.cut_deltay),
                0, 0, Math.abs(this.cut_deltax), Math.abs(this.cut_deltay));
        }

        this.img.src = this.canvas.toDataURL();
        //save history

        this.step++;
        if (this.step < this.historyArr.length) { this.historyArr.length = this.step };
        this.historyArr.push(this.img.src);
    }

    bucketFloodFill(x, y, color) {
        let pixel_stack = [{ x: x, y: y }];
        let pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let linear_cords = (y * this.canvas.width + x) * 4;
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

            // console.log( x + ", " + y );

            linear_cords = (y * this.canvas.width + x) * 4;
            while (y >= 0 &&
                !(pixels.data[linear_cords] == color.r &&
                    pixels.data[linear_cords + 1] == color.g &&
                    pixels.data[linear_cords + 2] == color.b &&
                    pixels.data[linear_cords + 3] == color.a)) {
                linear_cords -= canvas.width * 4;
                y--;
            }
            linear_cords += this.canvas.width * 4;
            y++;

            let reached_left = false;
            let reached_right = false;
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
        this.ctx.putImageData(pixels, 0, 0);
    }

    saveHistory(str) {
        this.step++;
        if (this.step < this.historyArr.length) { this.historyArr.length = this.step };
        let img = new Image();
        img = this.canvas.toDataURL();
        this.historyArr.push(img);
    }

    saveImage() {
        let download = document.querySelector('#saveImageBtn');
        let image = this.canvas.toDataURL();
        download.setAttribute("href", image);
    }

    displayImg() {
        let newImage = new Image();
        let openImageInput = document.querySelector('#openImageInput');
        // to image
        if (openImageInput.files[0]) {
            let reader = new FileReader();
            reader.readAsDataURL(openImageInput.files[0]);
            reader.onload = (e) => {
                newImage.setAttribute("src", reader.result);
                this.original_img = reader.result;
                openImageInput.setAttribute("type", "text");
            };
        }

        // draw image on canvas
        newImage.addEventListener('load', (event) => {
            let width2 = newImage.width;
            let height2 = newImage.height;

            this.canvas.width = width2;
            this.canvas.height = height2;

            this.origin_img_width = width2;
            this.origin_img_height = height2;

            this.setCanvas(height2);
            this.ctx.drawImage(newImage, 0, 0, width2, height2);

            openImageInput.setAttribute("type", "file");
            this.saveHistory();
        });

        this.iouFlag = false;
        this.backPredictFlag = true;
    }

    async backend_predict() {
        let img = this.canvas.toDataURL('image/png');
        let data = {
            "stay_in": getStayIn(),
            "temp_key": this.temp_key,
            "oringnal_image": img,
        }

        if (this.ruler_deltax != 0 || this.ruler_deltay != 0) {
            data["x"] = this.ruler_deltax;
            data["y"] = this.ruler_deltay;
            data["length"] = this.length;
            data["originx"] = this.origin_img_width;
            data["originy"] = this.origin_img_height;
            data["after_cut_x"] = Math.abs(this.cut_deltax);
            data["after_cut_y"] = Math.abs(this.cut_deltay);
        }

        let imgpreview = "../assets/img/preview/pre_img.gif"
        document.querySelector('#overlayImg').src = imgpreview;
        document.querySelector('#superpositionImg').src = imgpreview;
        document.querySelector('#areaImg').src = imgpreview;
        document.querySelector('#originalImg').src = imgpreview;

        await fetch("../php/backend_predict.php", {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then((response) => {
                this.iouFlag = true;
                return response.json();
            })
            .then((response) => {
                document.querySelector('#originalImg').src = response['oringnal_image'];
                document.querySelector('#overlayImg').src = response['overlay_image'];
                document.querySelector('#superpositionImg').src = response['super_position_image'];
                document.querySelector('#areaImg').src = response['area_image'];
                document.querySelector('#areaText').innerHTML = "Area: " + response['area'] + "c㎡";
                chart.startChart();
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            })
    }

    async backend_iou_upload() {
        var img = this.canvas.toDataURL();
        var data = {
            "stay_in": getStayIn(),
            "temp_key": this.temp_key,
            "label": img
        }

        let imgpreview = "../assets/img/preview/pre_img.gif"
        document.querySelector('#iouImg').src = imgpreview;

        await fetch("../php/backend_iou.php", {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                document.querySelector('#iouImg').src = response['iou_image'];
                document.querySelector('#iouText').innerHTML = "IOU: " + response['iou_value'] + "%";
                this.iouFlag = false;
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            })
    }

    async frontendAreaUpload(area) {
        // to image
        // if (!this.frontUploadFlag) {
        //     return;
        // } else {
        //     this.frontUploadFlag = false;
        // }

        if (this.canvas.toDataURL() == this.original_label) {
            return;
        } else {
            this.original_label = this.canvas.toDataURL();
        }

        let data = {
            'temp_key': this.temp_key,
            'stay_in': getStayIn(),
            'area': area,
            'original_img': this.original_img,
            'label_img': this.original_label,
        }
        await fetch('../php/frontend_area.php', {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            })
    }
}

// Check image type
function checkFiletype(file) {
    if (file.type.match('image/jpg|image/jpeg|image/png')) {
        return false;
    }
    return true;
}
// Check image size
function checkFilesize(file) {
    if (file.size < 5242880) {
        return false;
    }
    return true;
}

export { Paint };
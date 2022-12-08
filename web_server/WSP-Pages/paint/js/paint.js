import { getStayIn } from '../../js/login.js'
import * as chart from './chart.js'
import * as base from './base-paint.js'

class Paint extends base.BasePaint {
    constructor(canvas, ctx) {
        super(canvas, ctx)
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
        this.last_origin;
        this.last_label;
        this.last_hand_label;
        this.last_pixel_length
        this.iouFlag = false;
        this.predictFlag = false;
        this.scaleFlag = false;
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
            this.last_origin = this.canvas.toDataURL('image/png');
        });

        this.iouFlag = false;
        this.predictFlag = true;
        this.length = 0;
        this.scaleFlag = false;
    }

    getScale() {
        if (this.scaleCount == 1) {
            this.x1 = this.lastX;
            this.y1 = this.lastY;
            this.scaleCount++;
            return false;
        }
        else {
            alert("Enter complete, the distance between the two point is " + this.length);
            this.x2 = this.lastX;
            this.y2 = this.lastY;
            this.ruler_deltax = Math.abs(this.x2 - this.x1);
            this.ruler_deltay = Math.abs(this.y2 - this.y1);
            this.scaleCount--;
            this.scaleFlag = true;
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

    // bucket and frontend area calculate algorithm.
    floodFill(x, y, color, area) {
        let pixels_num = 0
        let pixel_stack = [{ x: x, y: y }];
        let pixels = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
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
                pixels.data[linear_cords] = color;
                pixels.data[linear_cords + 1] = color;
                pixels.data[linear_cords + 2] = color;
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
            let perpixel = Math.pow(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2), 0.5);
            let pixel_length = this.length / perpixel;
            this.last_pixel_length = pixel_length;
            let area = (pixels_num * (pixel_length ** 2)).toFixed(2)
            this.ctx.putImageData(pixels, 0, 0);
            return area;
        } else {
            this.ctx.putImageData(pixels, 0, 0);
        }
    }

    async backend_predict() {
        let img = this.canvas.toDataURL('image/png');
        let data = {
            "stay_in": getStayIn(),
            "temp_key": this.temp_key,
            "oringnal_image": img,
        }

        this.last_origin = img;

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
        if (this.canvas.toDataURL() == this.last_label) {
            return;
        } else if (this.last_origin == null) {
            return;
        } else {
            this.last_origin = this.canvas.toDataURL();
        }

        var data = {
            "stay_in": getStayIn(),
            "temp_key": this.temp_key,
            "label": this.last_origin
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
        if (this.canvas.toDataURL() == this.last_hand_label) {
            return;
        } else if (!this.predictFlag) {
            return;
        } else {
            this.last_hand_label = this.canvas.toDataURL();
        }
        let data = {
            'temp_key': this.temp_key,
            'stay_in': getStayIn(),
            'area': area,
            'original_img': this.last_origin,
            'label_img': this.last_hand_label,
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

    // Check image type
    checkFiletype(file) {
        if (file.type.match('image/jpg|image/jpeg|image/png')) {
            return false;
        }
        return true;
    }
    // Check image size
    checkFilesize(file) {
        if (file.size < 5242880) {
            return false;
        }
        return true;
    }
}

export { Paint };
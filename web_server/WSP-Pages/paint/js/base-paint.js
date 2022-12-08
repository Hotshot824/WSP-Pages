class BasePaint {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.99;
        this.canvas.beginHeight = window.innerHeight;

        this.color = '#ffffff';
        this.lineWidth = 10;
        this.lineJoin = "round";
        this.lineCap = "round";
        this.setDrawingVar()
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

    changeStroke() {
        let strokeWidth = document.querySelector('#stroke').value;
        if (isNaN(strokeWidth)) return;
        this.lineWidth = strokeWidth;
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
}

export { BasePaint }
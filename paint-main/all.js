class Paint {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = '#9BFFCD';
        this.lineWidth = 10;
        this.lineJoin = "round";
        this.lineCap = "round";
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.hue = 0;
        this.step = -1;
        this.historyArr = [];
		this.left=0;
		this.top =0;
		this.length = 0;
		this.count=1;
		this.x1 = 0;
		this.y1 = 0;
		this.x2 = 0;
		this.y2 = 0;
		this.perpixel=0;
    }
	/*
	dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
	*/
	
	dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type:mimeString});
	}
    clearAll() {
		
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
    }
    redo() {

        if (this.step < this.historyArr.length - 1) {
            this.step++;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {
                this.clearAll();
                this.ctx.drawImage(canvasImg, 0, 0, this.canvas.width, this.canvas.height);

            })
        }
		
    }
    undo() {
		console.log(this.step);
        if (this.step > 0) {
            this.step--;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {			
				this.clearAll();
                this.ctx.drawImage(canvasImg, 0, 0, this.canvas.width, this.canvas.height);

            })
        }
    }

    displayImg() {
		let image = new Image();
        let upload = document.getElementById('filetag');
        //toimage
        if (upload.files && upload.files[0]) {
		
            var reader = new FileReader();

            reader.onload = function (e) {

                image.setAttribute("src", e.target.result);
				
            };
			//alert("1");
            reader.readAsDataURL(upload.files[0]);
			
        }
		
        //draw image on canvas
        image.addEventListener('load', e => {
		let width2=image.width;
		let height2=image.height;
		this.canvas.width = width2;
		this.canvas.height = height2;
		
		
		
		this.canvas.style.display = "block";
        this.canvas.style.margin = "auto";
 
       	this.canvas.style.top = 0;
       	this.canvas.style.bottom = 0;
        this.canvas.style.left = 0;
        this.canvas.style.right = 0;
        this.ctx.drawImage(image, 0, 0, width2, height2);
		this.SaveHistory();
        });
		
    }
    //儲存成圖片匯出
    save() {
		
        var download = document.querySelector('.save');
        var image = this.canvas.toDataURL();
        download.setAttribute("href", image);
		

    }
	//上傳	
	async area_upload() {
	
		var pixel = this.perpixel;
		var img = this.canvas.toDataURL();
		var data ={
			"img" : img
		}
		
		if(pixel != 0)
		{
			data["pixel"] = pixel;
		}
		await fetch("upload2.php", {
		method: "POST",
		
		body: JSON.stringify(data)
		})
        
		alert("Area Test!");
	}
    
    changeStroke() {
        let strokeWidth = document.querySelector('.stroke').value;
        if (isNaN(strokeWidth)) return;
        this.lineWidth = strokeWidth;
    }

    changeColor() {
        let setcolorEL = document.querySelector('#setcolor');

        if (setcolorEL.checked === true) {
            this.color = document.querySelector('#colorset').value;

        } else {
            let colorBtn = document.querySelector('input[name=color]:checked');
            let colorName = colorBtn.getAttribute('id');
            switch (colorName) {
                case 'green':
                    this.color = '#01936F';
                    break;
                case 'light-green':
                    this.color = '#00CC99';
                    break;
                case 'light-blue':
                    this.color = '#9BFFCD';
                    break;
                case 'black':
                    this.color = '#000000';
                    break;
                case 'white':
                    this.color = '#ffffff';
                    break;
                case 'colorall':
                    this.color = 'colorall';
                    break;
            }
        }
    }

    startDrawing(e) {

        if (!this.isDrawing) return;	

        if (this.color === "colorall") {
            this.ctx.strokeStyle = `hsl(${this.hue},100%,50%)`;
            this.hue++;
        } else {
            this.ctx.strokeStyle = this.color;
        }

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
		//console.log("lasty=",this.lastY);

    }

	startDrawing2(e , left , top) {

        if (!this.isDrawing) return;		
		e.preventDefault();
        if (this.color === "colorall") {
            this.ctx.strokeStyle = `hsl(${this.hue},100%,50%)`;
            this.hue++;
        } else {
            this.ctx.strokeStyle = this.color;
        }

        this.ctx.lineWidth = this.lineWidth;
		
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.touches[0].clientX - left,
            e.touches[0].clientY - top);
		//console.log("y=",y);
        this.ctx.lineJoin = this.lineJoin;
        this.ctx.lineCap = this.lineCap;

        this.ctx.stroke();
        this.lastX = e.touches[0].clientX - left ;
        this.lastY = e.touches[0].clientY - top ;
		//console.log("lasty=",this.lastY);

    }
	scale(e)
	{
		var ruler = document.getElementById("ruler");
		if(this.count == 1)
		{
			this.x1 = e.offsetX;
			this.y1 = e.offsetY;
			this.count++;
		}
		else
		{
			this.x2 = e.offsetX;
			this.y2 = e.offsetY;
			//console.log(this.x1,this.y1,this.x2,this.y2);
			alert("輸入完畢，此2點之間的距離為"+this.length);
			ruler.checked = false;
			this.count = 1;
			this.perpixel = Math.pow( Math.pow((this.x2-this.x1) ,2) + Math.pow((this.y2-this.y1) ,2) , 0.5 );
			this.perpixel = this.length / this.perpixel;
			console.log(this.perpixel);
		}		
		
	}
    SaveHistory() {
        //紀錄
		this.step++;
		if(this.step < this.historyArr.length) {this.historyArr.length = this.step};
		let img = new Image();
		img = this.canvas.toDataURL();
		this.historyArr.push(img);
		
    }
}
let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");




window.onload = function () {

    let painting = new Paint(canvas, ctx);
	painting.SaveHistory();
    //upload img function
    let upload = document.getElementById('filetag');
    document.querySelector('.file-upload').addEventListener('click', function () {
        upload.click();
    });
    upload.addEventListener('change', function (e) {
        painting.displayImg();
    });
    //default color
    document.querySelector('#light-blue').checked = true;
    //set mouse down event
	
	var ruler = document.getElementById("ruler");
	ruler.onclick = function()
	{
		if(ruler.checked == true)
		{
			painting.length = window.prompt("輸入長度");
		}
	}
    painting.canvas.addEventListener("mousemove", (e) => {
        painting.changeColor();
        painting.changeStroke();
        painting.startDrawing(e);

    });
	painting.canvas.addEventListener("touchmove", (e) => {
		if(e.targetTouches.length == 1){
			painting.changeColor();
			painting.changeStroke();
			painting.startDrawing2(e , painting.left , painting.top);
		}
    });
    painting.canvas.addEventListener("mousedown", (e) => {
		if(ruler.checked == true)
		{
			painting.scale(e);
		}
		else
		{		
			painting.isDrawing = true;
			painting.lastX = e.offsetX * painting.canvas.width / painting.canvas.clientWidth | 0;
			painting.lastY = e.offsetY * painting.canvas.height / painting.canvas.clientHeight | 0;
			
			//painting.SaveHistory();
		}
		//console.log(ruler.checked);
		//console.log(e.offsetX,e.offsetY);
    });
	
	painting.canvas.addEventListener("touchstart", (e) => {
		
        painting.isDrawing = true;
        //painting.lastX = e.touches[0].clientX * painting.canvas.width / painting.canvas.clientWidth | 0 - painting.canvas.getBoundingClientRect().left;
        //painting.lastY = e.touches[0].clientY * painting.canvas.height / painting.canvas.clientHeight | 0 - painting.canvas.getBoundingClientRect().top;
		
		painting.left = painting.canvas.getBoundingClientRect().left;
		painting.top = painting.canvas.getBoundingClientRect().top;
		painting.lastX = e.touches[0].clientX - painting.left;
		painting.lastY = e.touches[0].clientY - painting.top;
        
		
		
    });
    painting.canvas.addEventListener("mouseup", () => {
        painting.isDrawing = false;
		painting.SaveHistory();
    });
	
	painting.canvas.addEventListener("touchend", () => {
        painting.isDrawing = false;
        painting.SaveHistory();
    });
    painting.canvas.addEventListener("mouseout", () => painting.isDrawing = false);
    //clear alll btn
    document.querySelector('.clear').addEventListener("click", () => painting.clearAll())
    //undo 
    document.querySelector('.undo').addEventListener("click", () => painting.undo()
    );
    //redo
    document.querySelector('.redo').addEventListener("click", () => painting.redo()
    );
    //download
    document.querySelector('.save').addEventListener("click", () => painting.save());

	document.querySelector('.area2').addEventListener("click", () => painting.area_upload());
    //fold toolbox
    var toolboxfold = document.querySelector('#collapseBottom')
    toolboxfold.addEventListener('hide.bs.collapse', function () {
        document.querySelector('.btn-circle-top').innerHTML = ' <i class="fas fa-paint-brush"></i>';
    })
}


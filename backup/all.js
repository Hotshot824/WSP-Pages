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
		this.canvas.beginHeight = window.innerHeight;
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
		this.img = new Image();
		this.cut_beginx;
		this.cut_beginy;
		this.cut_deltax;
		this.cut_deltay;
		
		this.ruler_deltax = 0;
		this.ruler_deltay = 0;
		this.origin_img_width = 0;
		this.origin_img_height = 0;
		
		this.scal = 1;
		this.midx = window.innerWidth/2;
		this.midy = window.innerHeight/2;
		this.transOrigin = 0;
		this.forMarginLeft = 0;
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
	canvas_set(temp_height)
	{
		
		if(temp_height < this.canvas.beginHeight)
		{
			
			this.canvas.style.position = "absolute";
			this.canvas.style.display = "block";
			this.canvas.style.margin = "auto";    	
			this.canvas.style.left = 0;
			this.canvas.style.right = 0;
			this.canvas.style.top = 0;
			this.canvas.style.bottom = 0;
		}
		else
		{
			
			this.canvas.style.position = "absolute";
			this.canvas.style.display = "block";
			this.canvas.style.margin = "auto";    	
			this.canvas.style.left = 0;
			this.canvas.style.right = 0;
			this.canvas.style.top = "";
			this.canvas.style.bottom = "";
		}
	}
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
		console.log("redo");
        if (this.step < this.historyArr.length - 1) {
            this.step++;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {
                this.clearAll();
				this.canvas_set(canvasImg.height);
				this.canvas.setAttribute('width', canvasImg.width);       //改變寬度
				this.canvas.setAttribute('height', canvasImg.height);
                this.ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height);

            })
        }
		
    }
    undo() {
		
		console.log("undo");
        if (this.step > 0) {
            this.step--;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {
				this.clearAll();
				this.canvas_set(canvasImg.height);
				
				this.canvas.setAttribute('width', canvasImg.width);       //改變寬度
				this.canvas.setAttribute('height', canvasImg.height);
                this.ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height);

            })
        }
    }

    displayImg() {
		console.log("displayimg");
		var image2 = new Image();
        let upload = document.getElementById('filetag');
		var del = 0;
        //toimage
        if (upload.files && upload.files[0]) {
		
            var reader = new FileReader();

            reader.onload = function (e) {

                image2.setAttribute("src", e.target.result);
				upload.setAttribute("type","text");
            };
			//alert("1");
            reader.readAsDataURL(upload.files[0]);
			
        }
		
        //draw image on canvas
        image2.addEventListener('load', e => {
		
		this.scal = 1;
		this.forMarginLeft = 0;
		this.transOrigin = 0;
		this.canvas.style.transform = 'scale(' + this.scal + ')';
		
		let width2=image2.width;
		let height2=image2.height;
		
		this.canvas.width = width2;
		this.canvas.height = height2;
		
		this.origin_img_width = width2;
		this.origin_img_height = height2;
		
		this.canvas_set(height2);
		
        this.ctx.drawImage(image2, 0, 0, width2, height2);
		console.log("display");
		upload.setAttribute("type","file");
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
	
		var img = this.canvas.toDataURL();
		var data ={
			"img" : img
		}
		
		if( this.ruler_deltax != 0 || this.ruler_deltay != 0)
		{
			data["x"] = this.ruler_deltax;
			data["y"] = this.ruler_deltay;
			data["length"] = this.length;
			data["originx"] = this.origin_img_width;
			data["originy"] = this.origin_img_height;
			data["after_cut_x"] = Math.abs(this.cut_deltax);
			data["after_cut_y"] = Math.abs(this.cut_deltay);
			
		}
		await fetch("upload2.php", {
			method: "POST",
		
			body: JSON.stringify(data)
		})
		console.log("比例尺的x = " + data["x"]);
		console.log("比例尺的y = " + data["y"]);
		console.log("用戶輸入的長 = " + data["length"]);
		console.log("原圖的x = " + data["originx"]);
		console.log("原圖的y = " + data["originy"]);
		console.log("裁切後的x = " + data["after_cut_x"]);
		console.log("裁切後的y = " + data["after_cut_y"]);
		alert("done");
	}
    
    changeStroke() {
        let strokeWidth = document.querySelector('.stroke').value;
        if (isNaN(strokeWidth)) return;
        this.lineWidth = strokeWidth;
    }
    changeColor() {
		
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
		//console.log("lasty=",this.lastY);

    }

	startDrawing2(e , left , top) {

        if (!this.isDrawing) return;		
		e.preventDefault();
        
        this.ctx.strokeStyle = this.color;
        

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
	selectarea(e) {
		
        if (!this.isDrawing) return;	
		       
        this.ctx.strokeStyle = "black";
        
		//this.ctx.setLineDash([4, 8]);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
       		
		this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);
		this.ctx.drawImage(this.img,0,0, this.canvas.width, this.canvas.height);
		
		this.cut_beginx = this.lastX;
		this.cut_beginy = this.lastY;
		
		this.cut_deltax = (e.offsetX * this.canvas.width / this.canvas.clientWidth | 0) - this.lastX;
		this.cut_deltay = (e.offsetY * this.canvas.height / this.canvas.clientHeight | 0) - this.lastY;
		
		this.ctx.strokeRect(this.lastX, this.lastY, 
							this.cut_deltax, this.cut_deltay);
			
		console.log("select");
    }
	
	cut()
	{
		console.log("cut");
		this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);
		
		this.canvas.setAttribute('width', Math.abs(this.cut_deltax));       //改變寬度
		this.canvas.setAttribute('height', Math.abs(this.cut_deltay));
		this.canvas_set(Math.abs(this.cut_deltay));
		
		
		console.log("切割後的長 = " + this.cut_deltax + " 切割後的寬" + this.cut_deltay);
		
		if( this.cut_deltax >=0 && this.cut_deltay >= 0 )
		{
			this.ctx.drawImage(this.img, this.cut_beginx, this.cut_beginy, this.cut_deltax, this.cut_deltay,
									 0, 0, this.cut_deltax, this.cut_deltay);
		}
	    else if( this.cut_deltax < 0 && this.cut_deltay >= 0 )
		{
			this.ctx.drawImage(this.img, this.cut_beginx + this.cut_deltax, this.cut_beginy, 
									Math.abs(this.cut_deltax), this.cut_deltay,
									 0, 0, Math.abs(this.cut_deltax), this.cut_deltay);
		}			
		else if( this.cut_deltax >= 0 && this.cut_deltay < 0 )
		{
			this.ctx.drawImage(this.img, this.cut_beginx, this.cut_beginy + this.cut_deltay, 
									this.cut_deltax, Math.abs(this.cut_deltay),
									 0, 0, this.cut_deltax, Math.abs(this.cut_deltay));
		}
		else
		{
			this.ctx.drawImage(this.img, this.cut_beginx + this.cut_deltax, this.cut_beginy + this.cut_deltay, 
									Math.abs(this.cut_deltax), Math.abs(this.cut_deltay),
									 0, 0, Math.abs(this.cut_deltax), Math.abs(this.cut_deltay));
		}
			
		this.img.src = this.canvas.toDataURL();
		//save history
		
		this.step++;
		if(this.step < this.historyArr.length) {this.historyArr.length = this.step};
		this.historyArr.push(this.img.src);
		
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
			console.log(this.x1,this.y1,this.x2,this.y2,this.length);
			alert("輸入完畢，此2點之間的距離為"+this.length);
			ruler.checked = false;
			this.count = 1;
			this.ruler_deltax = Math.abs(this.x2 - this.x1);
			this.ruler_deltay = Math.abs(this.y2 - this.y1);
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
	
	scroll_big_small(e){
		this.transOrigin = 0 + "px " + this.midy * this.scal + "px";
		this.forMarginLeft = window.innerWidth/2 - (this.canvas.width * this.scal)/2;
		if( this.forMarginLeft < 0)
		{
			this.forMarginLeft = "auto";
		}
		else
		{
			this.forMarginLeft = this.forMarginLeft + "px";
		}
		
		if(e.wheelDelta > 0 && e.ctrlKey)
		{
			this.canvas.style.position = "absolute";
			this.canvas.style.display = "block";
			this.canvas.style.marginLeft = this.forMarginLeft; 
			
			this.scal = (parseFloat(this.scal) + 0.01).toFixed(2);
			this.canvas.style.transform = 'scale(' + this.scal + ')';
			this.canvas.style.transformOrigin = this.transOrigin;

		}
		else if(e.wheelDelta < 0 && e.ctrlKey)
		{
			
			this.canvas.style.position = "absolute";
			this.canvas.style.display = "block";
			this.canvas.style.marginLeft = this.forMarginLeft;    	
			
			this.scal = (parseFloat(this.scal) - 0.01).toFixed(2);
			this.canvas.style.transform = 'scale(' + this.scal + ')';
			this.canvas.style.transformOrigin = this.transOrigin;
			
		}
		return false;
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
    
	

	//比例尺
	var ruler = document.getElementById("ruler");
	ruler.onclick = function()
	{
		if(ruler.checked == true)
		{
			painting.length = window.prompt("輸入長度");
		}
	}
	
	//選擇裁切範圍
	var selectflag = 0;
	document.getElementById("select").onclick = function()
	{
		if(selectflag == 0)
		{	
			selectflag = 1;
			painting.img.src = painting.canvas.toDataURL();
			console.log("開始選擇裁切範圍");
		}
		else 
		{	
			selectflag = 0;
			console.log("停止選擇裁切範圍");
		}
	}
	
	document.getElementById("cut").onclick = function()
	{	
		if(selectflag == 1)
		{	
			painting.cut();
			selectflag = 0;
		}
	}
	//set mouse down event
    painting.canvas.addEventListener("mousemove", (e) => {
		painting.changeColor();
        painting.changeStroke();
		if(selectflag == 1)
		{
			painting.selectarea(e);
		}
		else
		{			
			painting.startDrawing(e);
		}
		
    });
	painting.canvas.addEventListener("touchmove", (e) => {
		if(e.targetTouches.length == 1){
			painting.changeColor();
			painting.changeStroke();
			painting.startDrawing2(e , painting.left , painting.top);
		}
    });
    painting.canvas.addEventListener("mousedown", (e) => {
		if(selectflag == 1) painting.SaveHistory();
		if(ruler.checked == true)
		{
			painting.scale(e);
		}
		else
		{		
			painting.isDrawing = true;
			painting.lastX = e.offsetX * painting.canvas.width / painting.canvas.clientWidth | 0;
			painting.lastY = e.offsetY * painting.canvas.height / painting.canvas.clientHeight | 0;
		}
		
    });
	
	painting.canvas.addEventListener("touchstart", (e) => {
		
		if(ruler.checked == true)
		{
			painting.scale(e);
		}
		else
		{
			painting.isDrawing = true;
			
			painting.left = painting.canvas.getBoundingClientRect().left;
			painting.top = painting.canvas.getBoundingClientRect().top;
			painting.lastX = e.touches[0].clientX - painting.left;
			painting.lastY = e.touches[0].clientY - painting.top;
        }
		
		
    });
    painting.canvas.addEventListener("mouseup", () => {
        painting.isDrawing = false;
		if(selectflag != 1)
		{	
			painting.SaveHistory();
		}
		
    });
	
	painting.canvas.addEventListener("touchend", () => {
        painting.isDrawing = false;
        painting.SaveHistory();
    });
	
	window.addEventListener("mousewheel", (e) => {
		if(e.ctrlKey)
		{
			e.preventDefault();
			painting.scroll_big_small(e);
		}
	},{passive: false});
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


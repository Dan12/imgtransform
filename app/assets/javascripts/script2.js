$(document).ready(function(){
  
  var cElem = document.getElementById("mainCanvas");
	var canvas = cElem.getContext("2d");
  var tElem = document.getElementById("tempCanvas");
	var tempCanvas = tElem.getContext("2d");
  
  var img1 = new Image();
	img1.src = "/assets/canvasImg.png";
	var img2 = new Image();
	img2.src = "/assets/imgSearch.png";
  
  var width = 500;
	var height = 500;
  var hWidth = width/2;
  var hHeight = height/2;
	var multiply = 1;
  var rgba = 4;
  var invert = false;
  var bTol = 50;
  var useBFilter = false;
  var loaded = 0;
  
  img1.onload = function(){
    canvas.fillStyle = "white";
    canvas.fillRect(0,0,width,height);
    canvas.drawImage(img1,0,0,width,height);
  }
  
  img2.onload = function(){
    tempCanvas.fillStyle = "white";
    tempCanvas.fillRect(0,0,width,height);
    tempCanvas.drawImage(img2,0,0,hWidth,hHeight);
    var pix = tempCanvas.getImageData(0,0,hWidth,hHeight);
    var rgb = Array.prototype.slice.call(pix.data);
    var colors = colorSimplifier(rgb,rgba);
    applyFilter(gaussianBlur,1,false,false,tempCanvas);
    applyFilter(edgeDetect,1,true,true,tempCanvas);
    applyFilter(generateBlur(17),1,false,false,tempCanvas);
    applyFilter(sharpen,2,false,false,tempCanvas);
    transparatize(tempCanvas,255);
    recolor(tempCanvas,colors);
    applyFilter(generateBlur(7),1,false,false,tempCanvas);
    transparatize(tempCanvas,255);
    pasteToCanvas(canvas,cElem,tElem);
  }
  
  function pasteToCanvas(canv1,elem1,canv2){
    var tempImg = new Image();
    tempImg.src = elem1.toDataURL('image/png');
    canv1.clearRect(0,0,width,height);
    canv1.drawImage(tempImg,0,0);
    tempImg.src = canv2.toDataURL('image/png');
    canv1.translate(250,250);
    var copies = randNum(1,3);
    for(var cop = 0; cop < copies; cop++){
      canv1.rotate(Math.random()*2-1);
      var size = randNum(50,100);
      canv1.drawImage(tempImg,randNum(-150,150),randNum(-150,150), size, size);
    }
  }
  
  function applyFilter(weight, mult, inv, bfil,canv){
    multiply = mult;
    invert = inv;
    useBFilter = bfil;
    var pix = canv.getImageData(0,0,width,height);
    var rgb = Array.prototype.slice.call(pix.data);
    drawImage(width,height,processImage(rgb,height,width,weight,rgba),canv);
  }
  
  function drawImage(width,height,rgbVals,canv){
     canv.clearRect(0,0,width*multiply,height*multiply);
     var atRow = 0;
     var atCol = 0;
     for(var i = 0; i < rgbVals.length; i+=3){
         if(useBFilter){
          if(rgbVals[i] <= bTol && rgbVals[i+1] <= bTol && rgbVals[i+2] <= bTol)
            canv.fillStyle = "rgb(255,255,255)";
          else
            canv.fillStyle = "black";
         }
        else
          canv.fillStyle = getFillStyle(rgbVals,i,invert);
        canv.fillRect(atCol*multiply,atRow*multiply,multiply,multiply);
        atCol++;
        if(atCol >= width){
          atCol = 0;
          atRow++;
        }
     }
  };
  
  $("#tempCanvas").mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    //console.log(mouseX+","+mouseY)
    var temp = tempCanvas.getImageData(0,0,width,height).data;
    console.log(temp[mouseY*width*rgba+mouseX*rgba]+","+temp[mouseY*width*rgba+mouseX*rgba+1]+","+temp[mouseY*width*rgba+mouseX*rgba+2]+","+temp[mouseY*width*rgba+mouseX*rgba+3]);
  });
});
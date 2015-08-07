$(document).ready(function(){
	var c = document.getElementsByClassName("canvas")[0];
	var canvas = c.getContext("2d");
  var cSave1 = document.getElementsByClassName("saveCanvas1")[0];
	var canvasSave1 = cSave1.getContext("2d");
  var cSave2 = document.getElementsByClassName("saveCanvas2")[0];
	var canvasSave2 = cSave2.getContext("2d");
	var img1 = new Image();
	img1.src = "/assets/canvasImg.png";
	var img2 = new Image();
	img2.src = "/assets/imgSearch.png";
	var width = 250;
	var height = 250;
	var multiply = 2;
  var rgba = 4;
  var invert = false;
  var bTol = 50;
  var useBFilter = false;
  canvas.fillStyle = "white";
  canvas.fillRect(0,0,c.width,c.height);
	//canvas.globalAlpha = 0.5;
  var loaded = 0;
  
	img1.onload = function(){
    //canvasSave.drawImage(img1,0,0,100,100);
		//canvas.drawImage(img1,0,0,width,height);
		checkLoaded();
	}
  
  img2.onload = function(){
		//canvas.drawImage(img2,0,0,width,height);
		checkLoaded();
	}
  
  function checkLoaded(){
    loaded++;
    if(loaded >= 2){
      canvas.drawImage(img1,0,0,width,height);
      applyTransformCanvas(identity,2,false,false,canvas);      
//       applyTransformCanvas(edgeDetect,1,true,true);
//       applyDistortion(1,false,false);
//       applyTransformCanvas(generateBlur(5),1,false,false);
//       applyTransformCanvas(sharpen,2,false,false);
      temp = canvas.getImageData(0,0,width*multiply,height*multiply);
      canvasSave1.putImageData(temp,0,0);
      canvas.clearRect(0,0,c.width,c.height);
      canvas.drawImage(img2,0,0,width,height);
      var colorSimp = colorSimplifier(canvas.getImageData(0,0,width*multiply,height*multiply).data,4);
      applyTransformCanvas(gaussianBlur,1,false,false,canvas);
      applyTransformCanvas(edgeDetect,1,true,true,canvas);
      applyDistortion(1,false,false,canvas);
      applyTransformCanvas(generateBlur(7),1,false,false,canvas);
      applyTransformCanvas(sharpen,2,false,false,canvas);
//       applyTransformCanvas(identity,2,false,false);
      temp = canvas.getImageData(0,0,width*multiply,height*multiply);
      canvasSave2.putImageData(temp,0,0);
      var tempImg = new Image();
      transparatize(canvasSave1);
      transparatize(canvasSave2);
      recolor(canvasSave2,colorSimp);
      canvas.clearRect(0,0,c.width,c.height);
      tempImg.src = cSave1.toDataURL('image/png');
      canvas.drawImage(tempImg,0,0);
      tempImg.src = cSave2.toDataURL('image/png');
      canvas.translate(250,250);
      var copies = randNum(1,3);
      for(var cop = 0; cop < copies; cop++){
        canvas.rotate(Math.random()*1);
        var size = randNum(50,100);
        canvas.drawImage(tempImg,randNum(-150,150),randNum(-150,150), size, size);
      }
    }
  }
  
  function randNum(start,end){
    return Math.floor((Math.random() * end-start+1) + start)
  }
  
  function recolor(canv, colors){
    var temp = canv.getImageData(0,0,500,500).data;
    canv.clearRect(0,0,500,500);
    var row = 0;
    var col = 0;
    var wid = 500;
    var colorDivide = (255*255*3)/3;
    for(var i = 0; i < temp.length; i+=4){
      if(temp[i+3] != 0){
        var color = Math.floor((temp[i]*temp[i]+temp[i+1]*temp[i+1]+temp[i+2]*temp[i+2])/(colorDivide));
        canv.fillStyle = "rgb("+colors[color].r+","+colors[color].g+","+colors[color].b+")";
        canv.fillRect(col,row,1,1);
      }
      col++;
      if(col >= wid){
        col = 0;
        row++;
      }
        //console.log(temp[i]+","+temp[i+1]+","+temp[i+2]);
    }
  }
  
  function colorSimplifier(rgb, inc){
    var ret = [];
    var obj = [];
    var objInd = 0;
    var tolBottom = 20000;
    var tolTop = 50000;
    var rTot = 0;
    var gTot = 0;
    var bTot = 0;
    for(var i = 0; i < rgb.length; i+=inc){
      obj[objInd] = {"r":rgb[i],"g":rgb[i+1],"b":rgb[i+2],"dist":0};
      obj[objInd].dist = rgb[i]*rgb[i]+rgb[i+1]*rgb[i+1]+rgb[i+2]*rgb[i+2];
      //max dist is 195075
      if(obj[objInd].dist < 195075-tolTop && obj[objInd].dist > tolBottom){
        rTot+=obj[objInd].r;
        gTot+=obj[objInd].g;
        bTot+=obj[objInd].b;
        objInd++;
      }
    }
    //console.log(rTot+","+gTot+","+bTot)
    var splits = [];
    var cents = [];
    if(rTot<bTot && rTot<gTot){
      splits.push([-1,gTot/obj.length,-1]);
      splits.push([-1,-1,bTot/obj.length]);
      cents.push([127,splits[0][1]/2,splits[1][2]/2]);
      cents.push([127,splits[0][1]+(255-splits[0][1])/2,splits[1][2]/2]);
      cents.push([127,splits[0][1]/2,splits[1][2]+(255-splits[1][2])/2]);
      cents.push([127,splits[0][1]+(255-splits[0][1])/2,splits[1][2]+(255-splits[1][2])/2]);
    }
    else if(bTot<rTot && bTot<gTot){
      splits.push([rTot/obj.length,-1,-1]);
      splits.push([-1,gTot/obj.length,-1]);
      cents.push([splits[0][0]/2,splits[1][1]/2,127]);
      cents.push([splits[0][0]+(255-splits[0][0])/2,splits[1][1]/2,127]);
      cents.push([splits[0][0]/2,splits[1][1]+(255-splits[1][1])/2,127]);
      cents.push([splits[0][0]+(255-splits[0][0])/2,splits[1][1]+(255-splits[1][1])/2,127]);
    }
    else{
      splits.push([rTot/obj.length,-1,-1]);
      splits.push([-1,-1,bTot/obj.length]);
      cents.push([splits[0][0]/2,127,splits[1][2]/2]);
      cents.push([splits[0][0]+(255-splits[0][0])/2,127,splits[1][2]/2]);
      cents.push([splits[0][0]/2,127,splits[1][2]+(255-splits[1][2])/2]);
      cents.push([splits[0][0]+(255-splits[0][0])/2,127,splits[1][2]+(255-splits[1][2])/2]);
    }
    //console.log(cents);
    //console.log(splits);
    ret = [[],[],[],[]];
    sortColors(obj,ret,splits,cents);
    //console.log(ret);
    return ret;
  }
  
  function sortColors(obj,ret,splits,cents){
    for(var x in obj){
      var addTo = compareToSplits(obj[x],splits);
      obj[x].dist = sqrdDistance(obj[x],cents[addTo]);
      ret[addTo].push(obj[x]);
    }
    for(var x in ret){
      ret[x].sort(function compare(a,b){
        if(a.dist < b.dist)
          return -1;
        else if(a.dist > b.dist)
          return 1;
        else
          return 0;
      });
      ret[x] = ret[x][0];
    }
  }
  
  function sqrdDistance(obj,arr){
    return (obj.r-arr[0])*(obj.r-arr[0])+(obj.g-arr[1])*(obj.g-arr[1])+(obj.b-arr[2])*(obj.b-arr[2]);
  }
  
  function compareToSplits(obj,splits){
    var num1 = 1;
    var num2 = 1;
    if(obj.r < splits[0][0])
      num1 = 0;
    else if(obj.g < splits[0][1])
      num1 = 0;
    else if(obj.b < splits[0][2])
      num1 = 0;
    if(obj.r < splits[1][0])
      num2 = 0;
    else if(obj.g < splits[1][1])
      num2 = 0;
    else if(obj.b < splits[1][2])
      num2 = 0;
    return num1+num2*2;
  }
  
  function transparatize(canv){
    var temp = canv.getImageData(0,0,500,500).data;
    canv.clearRect(0,0,500,500);
    var tInd = 0;
    for(var r = 0; r < 500; r++){
      for(var c = 0; c < 500; c++){
        if(temp[tInd] == 255 && temp[tInd] == 255 && temp[tInd] == 255)
          canv.fillStyle = "rgba(255,255,255,0)";
        else
          canv.fillStyle = "rgb("+(temp[tInd])+","+(temp[tInd+1])+","+(temp[tInd+2])+")";
        canv.fillRect(c,r,1,1);
        tInd+=4;
      }
    }
  }
  
  function applyTransformCanvas(weight, mult, inv, bfil,canv){
    multiply = mult;
    invert = inv;
    useBFilter = bfil;
    var pix = canv.getImageData(0,0,width,height);
    var rgb = Array.prototype.slice.call(pix.data);
    drawImage(width,height,processImage(rgb,height,width,weight),canv);
  }
  
  function applyDistortion(mult, inv, bfil,canv){
    multiply = mult;
    invert = inv;
    useBFilter = bfil;
    var pix = canv.getImageData(0,0,width,height);
    var rgb = Array.prototype.slice.call(pix.data);
    drawImage(width,height,distortImg(rgb,height,width),canv);
  }
  
  function getFillStyle(rgb, i, inv){
    if(inv)
      return "rgb("+(255-rgb[i])+","+(255-rgb[i+1])+","+(255-rgb[i+2])+")";
    else
      return "rgb("+(rgb[i])+","+(rgb[i+1])+","+(rgb[i+2])+")";
  }
  
  function generateBlur(i){
    ret = [];
    for(var k = 0; k < i; k++){
      ret[k] = [];
      for(var j = 0; j < i; j++){
        ret[k][j] = 1/(i*i);
      }
    }
    //console.log(ret[0][0]);
    return ret;
  }
  
  var blur = [[1/9,1/9,1/9,1/9],
           [1/9,1/9,1/9,1/9],
           [1/9,1/9,1/9,1/9]];
  
  var edgeDetect = [[-1,-1,-1],
                 [-1,8,-1],
                 [-1,-1,-1]];
  
  var identity = [[0,0,0],
           [0,1,0],
           [0,0,0]];
  
  var gaussianBlur = [
    [1/16,1/8,1/16],
    [ 1/8,1/4, 1/8],
    [1/16,1/8,1/16]
  ];
              
  var emboss = [
      [-1, -1,  0],
      [-1,  0,  1],
      [0,  1,  1]
    ];
  
  var sharpen = [
      [ 0,-1, 0],
      [-1, 5,-1],
      [ 0,-1, 0]
    ];
  
  var laplacian = [
      [    0,     0, 0.075,  0.05,  0.05,  0.05, 0.075,     0,     0],
      [    0,  0.05, 0.075, 0.125, 0.125, 0.125, 0.075,  0.05,     0],
      [0.075, 0.075, 0.125, 0.075,     0, 0.075, 0.125, 0.075, 0.075],
      [ 0.05, 0.125, 0.075,  -0.3,-0.575,  -0.3, 0.075, 0.125,  0.05],
      [ 0.05, 0.125,     0,-0.575,  -0.9,-0.575,     0, 0.125,  0.05],
      [ 0.05, 0.125, 0.075,  -0.3,-0.575,  -0.3, 0.075, 0.125,  0.05],
      [0.075, 0.075, 0.125, 0.075,     0, 0.075, 0.125, 0.075, 0.075],
      [    0,  0.05, 0.075, 0.125, 0.125, 0.125, 0.075,  0.05,     0],
      [    0,     0, 0.075,  0.05,  0.05,  0.05, 0.075,     0,     0]
    ];
  
  function drawImage(width,height,rgbVals,canv){
   //canvas.globalAlpha = 1.0;
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
 }	
  
  function distortImg(imageData, height, width){
    //console.log(imageData.length);
    //console.log(imageData)
    var ret = [];
    var row = 0;
    var col = 0;
    var amplitude = 20;
    var freq = 30;
    for(var i = 0; i < width*height; i++){
      var newRow = row+Math.floor(Math.cos(col/freq)*amplitude);
      var newCol = col+Math.floor(Math.cos(row/freq)*amplitude);
      if(newRow >= height)
        newRow = height-1;
      if(newRow < 0)
        newRow = 0;
      if(newCol >= height)
        newCol = height-1;
      if(newCol < 0)
        newCol = 0;
      ret[row*width*3+col*3] = imageData[newRow*width*rgba+newCol*rgba];
      ret[row*width*3+col*3+1] = imageData[newRow*width*rgba+newCol*rgba+1];
      ret[row*width*3+col*3+2] = imageData[newRow*width*rgba+newCol*rgba+2];
      col++;
      if(col >= width){
        col = 0;
        row++;
      }
    }
    //console.log(ret.length);
    return ret;
  }
           
  function processImage(imageData, height, width, weights){
    //console.log(imageData);
    var row = 0;
    var col = 0;
    var ret = [];
    var retIndex = 0;
    for(var i = 0; i < imageData.length; i+=rgba){
      var r = imageData[i]; var g = imageData[i+1]; var b = imageData[i+2];
      var accumulatorR = 0;
      var accumulatorG = 0;
      var accumulatorB = 0;
      for(var j = -(weights.length-1)/2; j <= (weights.length-1)/2; j++){
        for(var k = -(weights.length-1)/2; k <= (weights.length-1)/2; k++){
          var overRow = row+j;
          var overCol = col+k;
          //console.log(overRow+","+overCol);
          if(overRow >= height)
            overRow = height-1;
          if(overRow < 0)
            overRow = 0;
          if(overCol >= width)
            overCol = width-1;
          if(overCol < 0)
            overCol = 0;
          accumulatorR+=imageData[overRow*rgba*width+overCol*rgba]*weights[j+(weights.length-1)/2][k+(weights.length-1)/2];
          accumulatorG+=imageData[overRow*rgba*width+overCol*rgba+1]*weights[j+(weights.length-1)/2][k+(weights.length-1)/2];
          accumulatorB+=imageData[overRow*rgba*width+overCol*rgba+2]*weights[j+(weights.length-1)/2][k+(weights.length-1)/2];
        }
        //console.log("\n");
      }
      if(accumulatorR > 255)
        accumulatorR = 255;
      if(accumulatorR < 0)
        accumulatorR = 0;
      if(accumulatorG > 255)
        accumulatorG = 255;
      if(accumulatorG < 0)
        accumulatorG = 0;
      if(accumulatorB > 255)
        accumulatorB = 255;
      if(accumulatorB < 0)
        accumulatorB = 0;
      ret[retIndex] = Math.round(accumulatorR); ret[retIndex+1] = Math.round(accumulatorG); ret[retIndex+2] = Math.round(accumulatorB);
      //console.log(row+","+col+","+r+","+accumulatorR+","+g+","+accumulatorG+","+b+","+accumulatorB);
      col++;
      if(col >= width){
        col = 0;
        row++;
      }
      retIndex+=3;
    }

    return ret;
  };
});
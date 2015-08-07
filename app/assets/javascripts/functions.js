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

function transparatize(canv, thresh){
  var temp = canv.getImageData(0,0,500,500).data;
  canv.clearRect(0,0,500,500);
  var tInd = 0;
  for(var r = 0; r < 500; r++){
    for(var c = 0; c < 500; c++){
      if(temp[tInd] >= thresh && temp[tInd] >= thresh && temp[tInd] >= thresh)
        canv.fillStyle = "rgba(255,255,255,0)";
      else
        canv.fillStyle = "rgb("+(temp[tInd])+","+(temp[tInd+1])+","+(temp[tInd+2])+")";
      canv.fillRect(c,r,1,1);
      tInd+=4;
    }
  }
}

function randNum(start,end){
  return Math.floor((Math.random() * (end-start+1)) + start);
}

var blur = [
  [1/9,1/9,1/9,1/9],
  [1/9,1/9,1/9,1/9],
  [1/9,1/9,1/9,1/9]
];
  
var edgeDetect = [
  [-1,-1,-1],
  [-1,8,-1],
  [-1,-1,-1]
];

var identity = [
  [0,0,0],
  [0,1,0],
  [0,0,0]
];

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
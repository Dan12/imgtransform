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

function recolor(canv, colors){
  var temp = canv.getImageData(0,0,500,500).data;
  canv.clearRect(0,0,500,500);
  canv.fillStyle = "white";
  canv.fillRect(0,0,500,500);
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
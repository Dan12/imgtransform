function processImage(imageData, height, width, weights, rgba){
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
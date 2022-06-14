var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_FragColor = a_Color;
    gl_PointSize = 10.0;
  }`;

var FSHADER_SOURCE =`
  precision mediump float;
  varying vec4 v_FragColor;
  void main(){
    gl_FragColor = v_FragColor;
  }`;

  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  var canvas2 = document.getElementById('webgl2');
  var gl2 = getWebGLContext(canvas2);

function main(){

  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }
  if(!gl2){
    console.log('Failed to get the WebGL context');
    return;
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initialize shaders');
    return;
  }

  if(!initShaders(gl2, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initialize shaders');
    return;
  }
  canvas.onmousedown = function(ev){ click(ev, gl, canvas); }
  canvas.oncontextmenu = function(ev){ rightclick(ev, gl); return false; }

  gl2.clearColor(0.0, 0.0, 0.0, 1.0);
  gl2.clear(gl2.COLOR_BUFFER_BIT);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  requestAnimationFrame(update);
}

/*
Updates all canvases and variables
*/
function update(){
  refresh();
  draw1(gl);
  drawAll(gl2);
  requestAnimationFrame(update);
}
/*
Creates a new plane
*/
function rightclick(ev, gl){
  if(g_points[index]){
    index++;
  }
  if(nIndex<index){
    nIndex=index;
  }
  reset();
}

/*
Used to display properly each vertex with the proper transformations in the global canvas
*/
function initVertexBuffers(gl, vertices, colors, transform, scale, rotate){

  var n = vertices.length;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get location of a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var modelMatrix = new Matrix4();
  modelMatrix.setRotate(1.0, 1.0, 1.0);
  modelMatrix.setTranslate(1.0, 1.0, 1.0);
  modelMatrix.setScale(0.45, 0.45, 0.45);

  modelMatrix.rotate(-rotate[0]+globalrotX.value*1, 1, 0, 0);
  modelMatrix.rotate(-rotate[1]+globalrotY.value*1, 0, 1, 0);
  modelMatrix.rotate(-rotate[2]+globalrotZ.value*1, 0, 0, 1);
  modelMatrix.translate(transform[0]+globaltranslatex.value*1,transform[1]+globaltranslatey.value*1,transform[2]+globaltranslatez.value*1);
  modelMatrix.scale(scale[0]*globalscalex.value, scale[1]*globalscaley.value, scale[2]*globalscalez.value);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){ console.log('Failed to get location of u_ModelMatrix'); return; }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 0.8,  0.0, 0.0, 0.0,  0.0, 1.0, 0.0);
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){ console.log('Failed to get location of u_ViewMatrix'); return; }
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var projMatrix = new Matrix4();
  projMatrix.setPerspective(60.0, 1.0, 0.1, 5.0);
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!u_ProjMatrix){ console.log('Failed to get location of u_ProjMatrix'); return; }
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(!a_Color < 0){
    console.log('Failed to get location of a_Color');
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  return n;
}
/*
Used to display the current 3Dplane in the left canvas
*/
function initVertexBuffers1(gl, vertices, colors){

  var n = vertices.length;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get location of a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var modelMatrix = new Matrix4();
  modelMatrix.setRotate(1.0, 1.0, 1.0);
  modelMatrix.setTranslate(1.0, 1.0, 1.0);
  modelMatrix.setScale(0.45, 0.45, 0.45);
  modelMatrix.rotate(-angleX, 1, 0, 0);
  modelMatrix.rotate(-angleY, 0, 1, 0);
  modelMatrix.rotate(-angleZ, 0, 0, 1);
  modelMatrix.translate(translateX,translateY,translateZ);
  modelMatrix.scale(scaleX, scaleY, scaleZ);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){ console.log('Failed to get location of u_ModelMatrix'); return; }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 0.8,  0.0, 0.0, 0.0,  0.0, 1.0, 0.0);
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){ console.log('Failed to get location of u_ViewMatrix'); return; }
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var projMatrix = new Matrix4();
  //projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0,1.0, 2.0);
  projMatrix.setPerspective(60.0, 1.0, 0.1, 5.0);
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!u_ProjMatrix){ console.log('Failed to get location of u_ProjMatrix'); return; }
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(!a_Color < 0){
    console.log('Failed to get location of a_Color');
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  return n;
}

var g_points = [];
var g_colors = [];

/*
Gets the vertex coordenates of each click and stores them in an Array
*/
function click(ev, gl, canvas){
  if(ev.buttons == 1){
    var x = ev.clientX;
    var y = ev.clientY;
    var z = document.getElementById('depthSliderValue').value/2;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    if(g_points.length <= index){
      var arrayPoints = [];
      g_points.push(arrayPoints);
      var arrayColors = [];
      g_colors.push(arrayColors);
    }

    g_points[nIndex].push(x);
    g_points[nIndex].push(y);
    g_points[nIndex].push(z);

    g_colors[nIndex].push(rcolor);
    g_colors[nIndex].push(gcolor);
    g_colors[nIndex].push(bcolor);

  }
}
/*
Draws the global canvas with all planes
*/

function drawAll(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);
  for(var i = 0; i < g_points.length; i++){
    var n = initVertexBuffers(gl, new Float32Array(g_points[i]), new Float32Array(g_colors[i]), new Float32Array(g_transform[i]),new Float32Array(g_scale[i]), new Float32Array(g_rotate[i])) / 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}
/*
Variables used to store the transformation of each vertex
*/
var g_transform =[];
var g_rotate =[];
var g_scale =[];

/*
Draws the canvas with only the currently selected plane
*/
function draw1(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);
    var n = initVertexBuffers1(gl, new Float32Array(g_points[nIndex]), new Float32Array(g_colors[nIndex])) / 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
/*
The following change the current plane for the left canvas
*/
var nIndex=0;
function prevIndex(){
  if(nIndex>0){
    nIndex=nIndex-1;
    document.getElementById('IndexVal').innerHTML= nIndex;
    getValues();
  }
}
function nextIndex(){
  if(nIndex<index){
    nIndex=nIndex+1;
    document.getElementById('IndexVal').innerHTML= nIndex;
    getValues();
  }
}

/*
Errases the last triangle made in the current plane
*/
function undoLast(){
  if(g_points[nIndex].length>9){
    for(var i=0;i<3;i++){
      g_points[nIndex].pop();
      g_colors[nIndex].pop();
      g_rotate[nIndex].pop();
      g_transform[nIndex].pop();
      g_scale[nIndex].pop();


    }
  }else{
    for(var i=0;i<9;i++){
      g_points[nIndex].pop();
      g_colors[nIndex].pop();
      g_rotate[nIndex].pop();
      g_transform[nIndex].pop();
      g_scale[nIndex].pop();

    }

  }
}

/*
Errases all planes
*/
function undoAll(){
    g_points=[];
    g_colors=[];
    index=0;
    nIndex=0;
    reset();
}

//variable values
var index = 0;
var translateX =0.0;
var translateY =0.0;
var translateZ =0.0;
var rcolor = 1.0;
var gcolor = 1.0;
var bcolor = 1.0;
var angleX = 0.0;
var angleY = 0.0;
var angleZ = 0.0;

/*
Called before refreshing the planes
Updates the transformation values with the sliders values
*/
function refresh(){
  document.getElementById('IndexVal').innerHTML= nIndex;
  rcolor = document.getElementById('rgbSliderRvalue').value/255;
  gcolor = document.getElementById('rgbSliderGvalue').value/255;
  bcolor = document.getElementById('rgbSliderBvalue').value/255;
  translateX = document.getElementById('translateXvalue').value;
  translateY = document.getElementById('translateYvalue').value;
  translateZ = document.getElementById('translateZvalue').value;
  scaleX = document.getElementById('scaleXvalue').value;
  scaleY = document.getElementById('scaleYvalue').value;
  scaleZ = document.getElementById('scaleZvalue').value;
  angleX = document.getElementById('rotationValueX').value;
  angleY = document.getElementById('rotationValueY').value;
  angleZ = document.getElementById('rotationValueZ').value;

  globaltranslateX = document.getElementById('globaltranslateXvalue').value;
  globaltranslateY = document.getElementById('globaltranslateYvalue').value;
  globaltranslateZ = document.getElementById('globaltranslateZvalue').value;

  g_transform[nIndex]=[translateX, translateY, translateZ];
  g_scale[nIndex]=[scaleX, scaleY, scaleZ];
  g_rotate[nIndex]=[angleX, angleY, angleZ];

}

/*
Called when creating a new plane or errasing all.
Resets the values that the user can controll of each plane
This do not resets the global view
*/
function reset(){
  document.getElementById('depthSliderValue').value=0.0;
  document.getElementById("SliderD").innerHTML=0.0;
  document.getElementById('IndexVal').innerHTML= nIndex;
  document.getElementById("SliderD").innerHTML= 0.0;
  document.getElementById('rgbSliderRvalue').value= 255.0;
  document.getElementById("SliderR").innerHTML= 255.0;
  document.getElementById('rgbSliderGvalue').value= 255.0;
  document.getElementById("SliderG").innerHTML= 255.0;
  document.getElementById('rgbSliderBvalue').value= 255.0;
  document.getElementById("SliderB").innerHTML= 255.0;

  document.getElementById('translateXvalue').value= 0.0;
  document.getElementById("translateSliderX").innerHTML= 0.0;
  document.getElementById('translateYvalue').value= 0.0;
  document.getElementById("translateSliderY").innerHTML= 0.0;
  document.getElementById('translateZvalue').value= 0.0;
  document.getElementById("translateSliderZ").innerHTML= 0.0;

  document.getElementById('scaleXvalue').value= 1.0;
  document.getElementById("scaleSliderX").innerHTML= 1.0;
  document.getElementById('scaleYvalue').value= 1.0;
  document.getElementById("scaleSliderY").innerHTML= 1.0;
  document.getElementById('scaleZvalue').value= 1.0;
  document.getElementById("scaleSliderZ").innerHTML= 1.0;

  document.getElementById('rotationValueX').value=0.0;
  document.getElementById("rotationValueXSlider").innerHTML= 0.0;
  document.getElementById('rotationValueY').value=0.0;
  document.getElementById("rotationValueYSlider").innerHTML= 0.0;
  document.getElementById('rotationValueZ').value=0.0;
  document.getElementById("rotationValueZSlider").innerHTML= 0.0;
}

/*
Gets the values of each vertex of the currently selected plane and displays them to the user.
*/
function getValues(){
  document.getElementById('translateXvalue').value= g_transform[nIndex][0];
  document.getElementById("translateSliderX").innerHTML= g_transform[nIndex][0];
  document.getElementById('translateYvalue').value= g_transform[nIndex][1];
  document.getElementById("translateSliderY").innerHTML= g_transform[nIndex][1];
  document.getElementById('translateZvalue').value= g_transform[nIndex][2];
  document.getElementById("translateSliderZ").innerHTML= g_transform[nIndex][2];

  document.getElementById('scaleXvalue').value= g_scale[nIndex][0];
  document.getElementById("scaleSliderX").innerHTML= g_scale[nIndex][0];
  document.getElementById('scaleYvalue').value= g_scale[nIndex][1];
  document.getElementById("scaleSliderY").innerHTML= g_scale[nIndex][1];
  document.getElementById('scaleZvalue').value= g_scale[nIndex][2];
  document.getElementById("scaleSliderZ").innerHTML= g_scale[nIndex][2];

  document.getElementById('rotationValueX').value= g_rotate[nIndex][0];
  document.getElementById("rotationValueXSlider").innerHTML= g_rotate[nIndex][0];
  document.getElementById('rotationValueY').value= g_rotate[nIndex][1];
  document.getElementById("rotationValueYSlider").innerHTML= g_rotate[nIndex][1];
  document.getElementById('rotationValueZ').value= g_rotate[nIndex][2];
  document.getElementById("rotationValueZSlider").innerHTML= g_rotate[nIndex][2];
}

/*
The following are functions called to update the values the user sees on the browser
*/
/////User Interface
var d = document.getElementById('depthSliderValue');
d.oninput = function(){
  document.getElementById("SliderD").innerHTML= d.value;
}
var colorR=document.getElementById('rgbSliderRvalue');
colorR.oninput = function(){
  document.getElementById("SliderR").innerHTML= colorR.value;
}
var colorG=document.getElementById('rgbSliderGvalue');
colorG.oninput = function(){
  document.getElementById("SliderG").innerHTML= colorG.value;
}
var colorB=document.getElementById('rgbSliderBvalue');
colorB.oninput = function(){
  document.getElementById("SliderB").innerHTML= colorB.value;
}
var translatex = document.getElementById('translateXvalue');
translatex.oninput = function(){
  document.getElementById("translateSliderX").innerHTML= translatex.value;
}
var translatey = document.getElementById('translateYvalue');
translatey.oninput = function(){
  document.getElementById("translateSliderY").innerHTML= translatey.value;
}
var translatez = document.getElementById('translateZvalue');
translatez.oninput = function(){
  document.getElementById("translateSliderZ").innerHTML= translatez.value;
}
var scalex = document.getElementById('scaleXvalue');
scalex.oninput = function(){
  document.getElementById("scaleSliderX").innerHTML= scalex.value;
}
var scaley = document.getElementById('scaleYvalue');
scaley.oninput = function(){
  document.getElementById("scaleSliderY").innerHTML= scaley.value;
}
var scalez = document.getElementById('scaleZvalue');
scalez.oninput = function(){
  document.getElementById("scaleSliderZ").innerHTML= scalez.value;
}
var rotX=document.getElementById('rotationValueX');
rotX.oninput = function(){
  document.getElementById("rotationValueXSlider").innerHTML= rotX.value;
}
var rotY=document.getElementById('rotationValueY');
rotY.oninput = function(){
  document.getElementById("rotationValueYSlider").innerHTML= rotY.value;
}
var rotZ=document.getElementById('rotationValueZ');
rotZ.oninput = function(){
  document.getElementById("rotationValueZSlider").innerHTML= rotZ.value;
}

///// global area

var globaltranslatex = document.getElementById('globaltranslateXvalue');
globaltranslatex.oninput = function(){
  document.getElementById("globalSliderX").innerHTML= globaltranslatex.value;
}
var globaltranslatey = document.getElementById('globaltranslateYvalue');
globaltranslatey.oninput = function(){
  document.getElementById("globalSliderY").innerHTML= globaltranslatey.value;
}
var globaltranslatez = document.getElementById('globaltranslateZvalue');
globaltranslatez.oninput = function(){
  document.getElementById("globalSliderZ").innerHTML= globaltranslatez.value;
}
var globalscalex = document.getElementById('globalscaleXvalue');
globalscalex.oninput = function(){
  document.getElementById("globalscaleSliderX").innerHTML= globalscalex.value;
}
var globalscaley = document.getElementById('globalscaleYvalue');
globalscaley.oninput = function(){
  document.getElementById("globalscaleSliderY").innerHTML= globalscaley.value;
}
var globalscalez = document.getElementById('globalscaleZvalue');
globalscalez.oninput = function(){
  document.getElementById("globalscaleSliderZ").innerHTML= globalscalez.value;
}
var globalrotX=document.getElementById('globalrotationValueX');
globalrotX.oninput = function(){
  document.getElementById("globalrotationValueXSlider").innerHTML= globalrotX.value;
}
var globalrotY=document.getElementById('globalrotationValueY');
globalrotY.oninput = function(){
  document.getElementById("globalrotationValueYSlider").innerHTML= globalrotY.value;
}
var globalrotZ=document.getElementById('globalrotationValueZ');
globalrotZ.oninput = function(){
  document.getElementById("globalrotationValueZSlider").innerHTML= globalrotZ.value;
}

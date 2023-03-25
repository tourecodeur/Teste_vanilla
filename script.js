 // ANIMATION GALLERY
 var radius = 240;
var autorRotate = true;
var rotateSpeed = -60;
var imgWidth = 120;
var imgHeight =170;

//................start...//

var odreg = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var avid = ospin.getElementsByTagName('video');
var aimg = ospin.getElementsByTagName('img');
var aele = [...aimg, ...avid];


ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width = radius*3 + "px";
ground.style.height = radius*3 +"px";
 
function applyTransform(obj){
    if (tY > 180) tY = 180;
    if (tY<0) tY =  0;
    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}
function playSpin(yes){
    ospin.style.animationPlayState = (yes? 'running' : 'paused');
}
var sX, sY, nX, nY, desX = 0,
desY=0,
tX=0,
tY=10;
if (autorRotate){
    var animationName = ( rotateSpeed > 0 ? 'spin' : 'spinRevert');
    ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}
document.onpointerdown = function(e){
    clearInterval(odreg.timer);
    e=e || window.event;
    var sX = e.clientX,
    sY = e.clientY;
    this.onpointermove = function(e){
        e = e || window.event;
        var nX = e.clientX,
           nY = e.clientY;
           desX = nX - sX;
           desY = nY - sY;
           tX += desX * 0.1;
           tY += desY * 0.1;
           applyTransform(odreg);
           sX = nX;
           sY = nY;

    };
    this.onpointerup = function(e){
        odreg.timer = setInterval(function(){
            e = e || window.event;
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTransform(odreg);
            playSpin(false);
            if(Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odreg.timer);
                playSpin(true);
            }

            }, 17);
        this.onpointermove = this.onpointerup = null;
    };
    return false;
};
document.onmousewheel = function(e){
    e = e || window.event;
    var d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    
}


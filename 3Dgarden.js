//----------global defaults
var backgroundColor;
var spheres = [];
var growing = false;
const lightZ = -1000;
var count = 0;
const fr = 100;
var branchProb = 0.01;
var deathProb = 0.003;

//=========================
//Setup & draw functions
//=========================
function setup() {
    frameRate(fr);
    makeCanvas();
    plantSeeds();
}

function makeCanvas(){
    var canvas = createCanvas(($(window).width()), $(window).height() + 50, WEBGL);
    canvas.parent('canvas-background');
    backgroundColor = "rgba(255, 255, 255, 1)";
};

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    //move all birds
    if (count < 20000) {
        clear();
        background(backgroundColor);
        noStroke();
        ambientLight(100);
        pointLight(100, 250, 250, 1000, 1000, lightZ);
        updateTrees();
        // drawGround();
    };
};

function updateTrees(){
    if (growing) {
        var length = spheres.length
        for (var i = 0; i < length; i++) {
            spheres[i].update();
        };
    };
};

function plantSeeds(){
    for (var i = 0; i < 10; i ++) {
        spheres.push(new Sphere(random(-500, 500), 300, random(-1600, 0), 0, -0.5, 0, 10, random(0, 25), random(100, 255), random(0, 125), 1));
    };
};

function drawGround(){
    specularMaterial(160, 82, 45);
    translate(0, 320, -1100);
    box(1500, 50, 2200);
    translate(0, -320, 1100);
};

//=========================
//Classes
//=========================
var Sphere = function(x, y, z, xMomentum, yMomentum, zMomentum, radius, r, g, b, a){
  //collection of birds with a common target, speed, and color
  // to-do: give individual speeds to birds, add acceleration to flocking
  this.alive = true;
  this.init = function(){
      if (this.y < -500 || random(0,1) < deathProb || this.a <= 0) {
          this.alive = false;
      };
  };
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
  this.x = x;
  this.y = y;
  this.z = z;
  this.xMomentum = xMomentum;
  this.yMomentum = yMomentum;
  this.zMomentum = zMomentum;
  this.radius = radius;
  this.update = function(){
      if (this.alive) {
          if (count < 100000) {
              var branches = 1;
              while (true) {
                  if (random(0,1) < branchProb) {
                      branches++;
                  } else {
                      break;
                  }
              }
              for (var i = 0; i < branches; i++) {
                  count += 1;
                  let newRadius = this.radius;

                  let newXMomentum = Math.pow(-1, i) * this.xMomentum + random(-0.5, 0.5);
                  let newYMomentum = -3;
                  let newZMomentum = Math.pow(-1, i + 1) * this.zMomentum + random(-0.5, 0.5);
                  let newSphereX = this.x + newXMomentum;
                  let newSphereY = this.y + newYMomentum;
                  let newSphereZ = this.z + newZMomentum;
                  let newAlpha = this.a - 0.004;
                  spheres.push(new Sphere(newSphereX, newSphereY, newSphereZ, newXMomentum, newYMomentum, newZMomentum, newRadius, this.r, this.g, this.b, newAlpha));
                  this.alive = false;
              }

          };
      };

      var color = 'rgba(' + Math.floor(this.r) + ', ' + Math.floor(this.g) + ', ' + Math.floor(this.b) + ', ' + parseFloat(this.a.toFixed(2)) + ')';
      specularMaterial(color);
      translate(this.x, this.y, this.z);
      sphere(this.radius);
      translate(-1 * this.x, -1 * this.y, -1 * this.z);
  };

  this.init();
};

//=========================
//Interactivity functions
//=========================
function keyPressed() {
    if (keyCode) {
        switch (keyCode) {
            case 32:
                growing = !growing;
                console.log(growing);
                break;
        };
    };
};

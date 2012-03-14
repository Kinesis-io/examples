/* constants */
var MIN_PARTICLE_SPACING = 40;
var GRAVITY_METERS_PER_SCREEN_WIDTH = 7.272727;
var REPULSION_PIXELS_PER_METER = 10;
var PARTICLE_MASS = 1;
var PARTICLE_RADIUS = 5;
var PARTICLE_DIAMETER = 2 * PARTICLE_RADIUS;
var GRAVITY_PARTICLE_DAMPING_FACTOR = 0.99;
var REPULSION_PARTICLE_DAMPING_FACTOR = 0.92;
var GRAVITY_WELL_MASS = 100;
var MAGNETIC_MAGNITUDE = 50000;
var GRAVITY_TETHER_SPRING_CONSTANT = .1;
var REPULSION_TETHER_SPRING_CONSTANT = .5;
var STEP_HZ = 60;
var TOUCH_POINT_RADIUS = 60;
var RAINBOW_STRIP_DOT_WIDTH = 20;
var RAINBOW_STRIP_DOT_MAX = 210;
var BEE_SIZE = 20;

/* mode switches */
var PHYSICS_MODE_GRAVITY_WELL = 0;
var PHYSICS_MODE_REPULSION = 1;
var TETHER_MODE_OFF = 0;
var TETHER_MODE_ON = 1;
var DRAW_MODE_CIRCLES = 0;
var DRAW_MODE_RAINBOWS = 1;
var DRAW_MODE_BALLS = 2;
var DRAW_MODE_BEES = 3;
var BLUR_MODE_OFF = 0;
var BLUR_MODE_ON = 1;

/* finals */
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var CANVAS_LEFT;
var CANVAS_TOP;
var GRAVITY_PIXELS_PER_METER;

/* globals (sorry) */
var canvasElm, context, downevent, upevent, moveevent;
var particles = [];
var touchPoints = [];
var touchCount = 0;

/* initial settings */
var physicsMode = PHYSICS_MODE_REPULSION;
var tetherMode = TETHER_MODE_ON;
var drawMode = DRAW_MODE_RAINBOWS;
var blurMode = BLUR_MODE_ON;

document.addEventListener("DOMContentLoaded", sizeCanvas, false);

function sizeCanvas() {
    canvasElm = document.getElementById("canvas");
    canvasElm.width = document.documentElement.clientWidth;
    canvasElm.height = document.documentElement.clientHeight;
}

// Initialize the world
function setupWorld() {
    // Get canvas info
    context = canvasElm.getContext("2d");
    
    addParticles();
    
    // Determine correct events to register for
    if(navigator.msPointerEnabled) {
        downevent = "MSPointerDown";
        upevent = "MSPointerUp";
        moveevent = "MSPointerMove";
        document.addEventListener("MSPointerCancel", function(e){ removeTouchPoint(e); }, false);
        document.addEventListener("MSGestureInit", function(e){ e.preventManipulation(); }, false);
        document.addEventListener("MSGestureHold", function(e){ e.preventDefault(); }, false);
    }
    else {
        downevent = "mousedown";
        upevent = "mouseup";
        moveevent = "mousemove";
    }
    
    // Register invariant events
    canvasElm.addEventListener(downevent, addTouchPoint, false);
    document.addEventListener(upevent, removeTouchPoint, false);
    
    document.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);
    document.addEventListener("selectstart", function(e){ e.preventDefault(); }, false);
    window.addEventListener("resize", function(e){ sizeCanvas(); destroyParticles(); addParticles(); }, false);
    
    // b is for bees!
    document.addEventListener("keypress", function(e){ if(e.keyCode == 98){ coveredInBees(); } }, false);
    // c is for circles!
    document.addEventListener("keypress", function(e){ if(e.keyCode == 99){ setDrawMode(DRAW_MODE_CIRCLES); manuallyTurnButtonOn("circlebutton"); } }, false);
    // r is for reset!
    document.addEventListener("keypress", function(e){ if(e.keyCode == 114){ resetState(); } }, false);
    
    document.getElementById("democontrolsgripper").addEventListener(downevent, toggleControls, false);
    
    var buttons = document.querySelectorAll(".controlbutton");
    for(var i = 0; i < buttons.length; i++) {
        buttons.item(i).addEventListener(downevent, turnButtonOn, false);
    }
    
    document.getElementById("gravitybutton").addEventListener(downevent, function(e){ setPhysicsMode(PHYSICS_MODE_GRAVITY_WELL); }, false);
    document.getElementById("repulsionbutton").addEventListener(downevent, function(e){ setPhysicsMode(PHYSICS_MODE_REPULSION); setTetherMode(TETHER_MODE_ON); manuallyTurnButtonOn("tetheronbutton"); }, false);
    
    document.getElementById("tetheroffbutton").addEventListener(downevent, function(e){ setTetherMode(TETHER_MODE_OFF); }, false);
    document.getElementById("tetheronbutton").addEventListener(downevent, function(e){ setTetherMode(TETHER_MODE_ON); }, false);
    
    document.getElementById("rainbowbutton").addEventListener(downevent, function(e){ setDrawMode(DRAW_MODE_RAINBOWS); }, false);
    document.getElementById("ballbutton").addEventListener(downevent, function(e){ setDrawMode(DRAW_MODE_BALLS); }, false);
    document.getElementById("circlebutton").addEventListener(downevent, function(e){ setDrawMode(DRAW_MODE_CIRCLES); }, false);
    
    document.getElementById("bluroffbutton").addEventListener(downevent, function(e){ setBlurMode(BLUR_MODE_OFF); }, false);
    document.getElementById("bluronbutton").addEventListener(downevent, function(e){ setBlurMode(BLUR_MODE_ON); }, false);
    
    stepPhysics();
    paint();
    
    toggleControls(); // show the controls immediately
}

// Create physics objects for the particles
function addParticles() {
    CANVAS_WIDTH = parseInt(canvasElm.width);
    CANVAS_HEIGHT = parseInt(canvasElm.height);
    CANVAS_LEFT = canvasElm.offsetLeft;
    CANVAS_TOP = canvasElm.offsetTop;
    
    GRAVITY_PIXELS_PER_METER = CANVAS_WIDTH / GRAVITY_METERS_PER_SCREEN_WIDTH;
    
    var elemColumns = parseInt(CANVAS_WIDTH / MIN_PARTICLE_SPACING);
    var elemRows = parseInt(CANVAS_HEIGHT / MIN_PARTICLE_SPACING);
    var actualColumnSpacing = CANVAS_WIDTH / elemColumns;
    var actualRowSpacing = CANVAS_HEIGHT / elemRows;
    
    var i, j;
    
    for (i = 0; i < elemColumns; i++) {
        for (j = 0; j < elemRows; j++) {
            var elmX = i * actualColumnSpacing + actualColumnSpacing / 2;
            var elmY = j * actualRowSpacing + actualRowSpacing / 2;
            particles.push({x : elmX, y : elmY, vx : 0, vy : 0, startX : elmX, startY : elmY, hue : 0});
        }
    }
}

function destroyParticles() {
    while(particles.length > 0) {
        delete particles.pop();
    }
}

function paint() {
    // prep for draw
    switch(blurMode) {
        case BLUR_MODE_OFF:
        {
            context.globalAlpha = 1;
            break;
        }
        case BLUR_MODE_ON:
        {
            context.globalAlpha = 0.2;
            break;
        }
    }

    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.globalAlpha = 1;

    
    // draw glows for active contacts
    drawTouchGlows();
    
    // draw appropriate particles
    switch(drawMode) {
        case DRAW_MODE_RAINBOWS : drawRainbows(); break;
        case DRAW_MODE_BALLS : drawBalls(); break;
        case DRAW_MODE_CIRCLES : drawCircles(); break;
        case DRAW_MODE_BEES : drawBees(); break;
    }
    
    // Future-proof: when feature is fully standardized
    if (window.requestAnimationFrame) window.requestAnimationFrame(paint);
    // IE implementation
    else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(paint);
    // Firefox implementation
    else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(paint);
    // Chrome implementation
    else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(paint);
    // Other browsers that do not yet support feature
    else setTimeout(paint, 1000 / STEP_HZ);
}

/*************** Start touch handling ***************/
function addTouchPoint(e) {
    if(touchCount == 0) {
        document.addEventListener(moveevent, moveTouchPoint, false);
    }
    
    var pID = e.pointerId || 0;
    if(!touchPoints[pID]) {
        touchCount++;
        touchPoints[pID] = {x : e.clientX, y : e.clientY};
    }
}

function removeTouchPoint(e) {
    var pID = e.pointerId || 0;
    if(touchPoints[pID]) {
        delete touchPoints[pID];
        touchCount--;
        
        if(touchCount == 0) {
            document.removeEventListener(moveevent, moveTouchPoint, false);
        }
    }
}

function moveTouchPoint(e) {
    var pID = e.pointerId || 0;
    touchPoints[pID].x = e.clientX;
    touchPoints[pID].y = e.clientY;
}
/*************** End touch handling ***************/

/*************** Start physics ***************/
function setPhysicsMode(mode) {
    physicsMode = mode;
}

function setTetherMode(mode) {
    tetherMode = mode;
}

function stepPhysics() {
    // apply force to update the new frame's velocity
    switch(physicsMode) {
        case PHYSICS_MODE_GRAVITY_WELL : applyGravity(); break;
        case PHYSICS_MODE_REPULSION : applyRepulsion(); break;
    }
    
    if(tetherMode == TETHER_MODE_ON) {
        applyTether();
    }
    
    // dampen velocity
    applyDamping();
    // apply velocity to update the new frame's position
    updatePosition();
    
    // recalc hue based on new velocity if rainbows
    if(drawMode == DRAW_MODE_RAINBOWS) {
        calculateRainbowColor();
    }
    
    setTimeout(stepPhysics, 1000 / STEP_HZ);
}

function applyDamping() {
    var dampingFactor;
    
    switch(physicsMode) {
        case PHYSICS_MODE_GRAVITY_WELL : dampingFactor = GRAVITY_PARTICLE_DAMPING_FACTOR; break;
        case PHYSICS_MODE_REPULSION : dampingFactor = REPULSION_PARTICLE_DAMPING_FACTOR; break;
    }
    
    particles.forEach(function(p) {
        p.vx *= dampingFactor;
        p.vy *= dampingFactor;
    });
}

function updatePosition() {
    particles.forEach(function(p) {
        p.x += p.vx / STEP_HZ;
        p.y += p.vy / STEP_HZ;
    });
}

function applyGravity() {
    var distanceVec, distanceVecMag, forceVecMag;
    
    touchPoints.forEach(function(gw) {
        particles.forEach(function(p) {
            distanceVec = {x : (gw.x - p.x), y : (gw.y - p.y)};
            distanceVecMag = Math.sqrt(Math.pow(distanceVec.x, 2) + Math.pow(distanceVec.y, 2));
            forceVecMag = GRAVITY_WELL_MASS * PARTICLE_MASS / Math.max(Math.pow(distanceVecMag / GRAVITY_PIXELS_PER_METER, 2), PARTICLE_RADIUS);
            p.vx += forceVecMag * distanceVec.x / distanceVecMag;
            p.vy += forceVecMag * distanceVec.y / distanceVecMag;
        });
    });
}

function applyRepulsion() {
    var distanceVec, distanceVecMag, forceVecMag;
    
    touchPoints.forEach(function(s) {
        particles.forEach(function(p) {
            distanceVec = {x : (s.x - p.x), y : (s.y - p.y)};
            distanceVecMag = Math.sqrt(Math.pow(distanceVec.x, 2) + Math.pow(distanceVec.y, 2));
            forceVecMag = MAGNETIC_MAGNITUDE / (4 * Math.PI * Math.max(Math.pow(distanceVecMag / REPULSION_PIXELS_PER_METER, 2), PARTICLE_RADIUS));
            p.vx -= forceVecMag * distanceVec.x / distanceVecMag;
            p.vy -= forceVecMag * distanceVec.y / distanceVecMag;
        });
    });
}

function applyTether() {
    var distanceVec, distanceVecMag, springConstant;
    
    switch(physicsMode) {
        case PHYSICS_MODE_GRAVITY_WELL : springConstant = GRAVITY_TETHER_SPRING_CONSTANT; break;
        case PHYSICS_MODE_REPULSION : springConstant = REPULSION_TETHER_SPRING_CONSTANT; break;
    }
    
    particles.forEach(function(p) {
        distanceVec = {x : (p.startX - p.x), y : (p.startY - p.y)};
        distanceVecMag = Math.sqrt(Math.pow(distanceVec.x, 2) + Math.pow(distanceVec.y, 2));
        p.vx += distanceVec.x * springConstant / PARTICLE_MASS;
        p.vy += distanceVec.y * springConstant / PARTICLE_MASS;
    });
}
/*************** End physics ***************/

/*************** Start draws ***************/
function setDrawMode(mode) {
    drawMode = mode;
}

function setBlurMode(mode) {
    blurMode = mode;
}

function calculateRainbowColor() {
    var speed;
    
    particles.forEach(function(p) {
        speed = Math.sqrt(Math.pow(p.vx, 2) + Math.pow(p.vy, 2));
        p.hue = Math.min(Math.round(speed / 4), RAINBOW_STRIP_DOT_MAX);
    });
}

function drawBalls() {
    particles.forEach(function(p) {
        context.save();
        context.translate(p.x, p.y);
        context.drawImage(document.getElementById("ball"), -PARTICLE_RADIUS, -PARTICLE_RADIUS, PARTICLE_DIAMETER, PARTICLE_DIAMETER);
        context.restore();
    });
}

function drawCircles() {
    particles.forEach(function(p) {
        context.save();
        context.translate(p.x, p.y);
        context.drawImage(document.getElementById("circle"), -PARTICLE_RADIUS, -PARTICLE_RADIUS, PARTICLE_DIAMETER, PARTICLE_DIAMETER);
        context.restore();
    });
}

function drawRainbows() {
    particles.forEach(function(p) {
        context.save();
        context.translate(p.x, p.y);
        context.drawImage(document.getElementById("rainbowstrip"), RAINBOW_STRIP_DOT_WIDTH * p.hue, 0, RAINBOW_STRIP_DOT_WIDTH, RAINBOW_STRIP_DOT_WIDTH, -PARTICLE_RADIUS, -PARTICLE_RADIUS, PARTICLE_DIAMETER, PARTICLE_DIAMETER);
        context.restore();
    });
}

function drawBees() {
    particles.forEach(function(p) {
        context.save();
        context.translate(p.x, p.y);
        context.rotate(Math.atan(p.vy / p.vx) + (p.vx < 0 ? -Math.PI / 2 : Math.PI / 2));
        context.drawImage(document.getElementById("bee"), -BEE_SIZE / 2, -BEE_SIZE / 2, BEE_SIZE, BEE_SIZE);
        context.restore();
    });
}

function drawTouchGlows() {
    var gradient;
    var alpha = (blurMode == BLUR_MODE_ON ? .1 : .6);
    
    touchPoints.forEach(function(tp) {
        context.beginPath();
        gradient = context.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, TOUCH_POINT_RADIUS);
        gradient.addColorStop(0, "rgba(255, 255, 255, " + alpha + ")");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = gradient;
        context.arc(tp.x, tp.y, TOUCH_POINT_RADIUS, 0, 2 * Math.PI, false);
        context.fill();
    });
}
/*************** End draws ***************/

/*************** Start helpers ***************/
function toggleControls(e) {
    var controls = document.getElementById("DemoControls");
    if(controls.className.indexOf("democontrolsactive") != -1) {
        controls.className = controls.className.replace("democontrolsactive", "");
    }
    else {
        controls.className = "democontrolsactive";
    }
}

function turnButtonOn(e) {
    var buttons = e.target.parentNode.querySelectorAll(".controlbutton");
    for(var i = 0; i < buttons.length; i++) {
        buttons.item(i).className = buttons.item(i).className.replace(" controlbuttonon", "");
    }
    e.target.className += " controlbuttonon";
}

function manuallyTurnButtonOn(id) {
    var buttons = document.getElementById(id).parentNode.querySelectorAll(".controlbutton");
    for(var i = 0; i < buttons.length; i++) {
        buttons.item(i).className = buttons.item(i).className.replace(" controlbuttonon", "");
    }
    document.getElementById(id).className += " controlbuttonon";
}

function coveredInBees() {
    setPhysicsMode(PHYSICS_MODE_GRAVITY_WELL);
    manuallyTurnButtonOn("gravitybutton");
    setDrawMode(DRAW_MODE_BEES);
    manuallyTurnButtonOn("beebutton");
    setBlurMode(BLUR_MODE_OFF);
    manuallyTurnButtonOn("bluroffbutton");
    setTetherMode(TETHER_MODE_OFF);
    manuallyTurnButtonOn("tetheroffbutton");
}

function resetState() {
    setPhysicsMode(PHYSICS_MODE_GRAVITY_WELL);
    manuallyTurnButtonOn("gravitybutton");
    setDrawMode(DRAW_MODE_RAINBOWS);
    manuallyTurnButtonOn("rainbowbutton");
    setBlurMode(BLUR_MODE_ON);
    manuallyTurnButtonOn("bluronbutton");
    setTetherMode(TETHER_MODE_OFF);
    manuallyTurnButtonOn("tetheroffbutton");
    
    destroyParticles();
    addParticles();
}
/*************** End helpers ***************/

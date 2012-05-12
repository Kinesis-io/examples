/*!
  * kinesis.io Custom JavaScript - UIHorizontalScroll
  * http://kinesis.io/
  *
  * Copyright 2012, Kinesis.io
  * http://kinesis.io/license
  *
  * Copyright 2012, NotionQ LLP
  *
  * Date: Thu Feb 23 15:53:00 2012 +0530
*/

// activate tile
$.fn.activate = function() {
  var me = $(this);
  if(me)
    setTimeout(function() {
	    me.addClass('active');
	  }, 200 );
};

// animate slide left - move a tile towards left and make it active
$.fn.slideLeft = function() {
  var tiles = $(this);
  var _index = tiles.find('.column').index(tiles.find('.active')[0]);
  var _left = tiles.find('.column').width() * (_index + 1);
  if(_index < tiles.find('.column').length - 1) {
    $(this).css("-webkit-transform", "translate(-" + _left + "px, 0)");
    $(this).css("-moz-transform", "translate(-" + _left + "px, 0)");
    setTimeout(function() {
	    tiles.find('.active').removeClass('active').next().activate();
	  }, 200 );
  };
};

// animate slide right - move a tile towards right and make it active
$.fn.slideRight = function() {
  var tiles = $(this);
  var _index = tiles.find('.column').index(tiles.find('.active')[0]);
  var _left = tiles.find('.column').width() * (_index - 1);
  if(_index > 0) {
    $(this).css("-webkit-transform", "translate(-" + _left + "px, 0)");
    $(this).css("-moz-transform", "translate(-" + _left + "px, 0)");
    setTimeout(function() {
	    tiles.find('.active').removeClass('active').prev().activate();
	  }, 200 );
  };
};

// delegate method for swipe gesture call to action; depending upon the gesture corresponding functions are fired.

function swipeControl(gesture) {
  switch(gesture){
    case leftGesture:
      $('.gridHolder').slideLeft();
      break;
    case rightGesture:
      $('.gridHolder').slideRight();
      break;
  }
};

var kinesis = new Kinesis; // initialize kinesis

// start adding gestures from here //

// create swipe left gesture
var leftGesture         = new SwipeGestureListener("myswipeLeft");
// call to action for swipe left
leftGesture.toFire      = swipeControl;
// area within which the swipe left will be recognized; values in percentage(%)
leftGesture.bounds      = {min: {x: 80, y: 0, z: 0}};
// allowed joints for gesture
leftGesture.joints      = [JointTypes.JointTypeHandRight]; // right hand
// allowed direction for gesture
leftGesture.directions  = [GestureDirections.GestureDirectionLeft]; // left

// create swipe right gesture
var rightGesture        = new SwipeGestureListener("myswipeRight");
// call to action for swipe left
rightGesture.toFire     = swipeControl;
// area within which the swipe left will be recognized; values in percentage(%)
rightGesture.joints     = [JointTypes.JointTypeHandLeft];
// allowed joints for gesture
rightGesture.bounds     = {max: {x: 20, y: 100, z: 100}};
// allowed direction for gesture
rightGesture.directions = [GestureDirections.GestureDirectionRight];

kinesis.addGesture(leftGesture);  // insert leftGesture to kinesis
kinesis.addGesture(rightGesture); // insert rightGesture to kinesis
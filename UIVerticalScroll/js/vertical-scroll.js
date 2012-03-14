/*!
  * kinesis.io Custom JavaScript - UIVerticalScroll
  * http://kinesis.io/
  *
  * Copyright 2012, Kinesis.io
  * http://kinesis.io/license
  *
  * Copyright 2012, NotionQ LLP
  *
  * Date: Thu Feb 23 15:53:00 2012 +0530
*/

function currentYPosition() {
  // Firefox, Chrome, Opera, Safari
  if (self.pageYOffset) return self.pageYOffset;
  
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
      
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

// smooth scrolling animation
function smoothScroll(value) {
  var startY = currentYPosition();
  var stopY = startY + value
  
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY); return;
  }
  var speed = Math.round(distance / 100);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i=startY; i<stopY; i+=step) {
      setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
      leapY += step; if (leapY > stopY) leapY = stopY; timer++;
    } return;
  }
  for (var i=startY; i>stopY; i-=step) {
    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
    leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
  }
};

// smooth scroll page up
function scrollUp(value) {
  smoothScroll((value/3) * -1);
}

// smooth scroll page down
function scrollDown(value) {
  smoothScroll(value/3);
}

// scrolls the page up and down
// if cursor is at the top of page it scrolls down
// if cursor is at the bottom of page it scrolls up
// Layout is part of kinesis; it gives the pageSize (height and width of the window)
function movement(position) {
  if(position.y < Layout.pageSize.height * 0.2) 
    scrollUp((Layout.pageSize.height * 0.2) - position.y);
  if(position.y > Layout.pageSize.height * 0.8) 
    scrollDown(position.y - (Layout.pageSize.height * 0.8));
};

// smooth scroll to the specific tile directly
$('#nav li').click(function() {
  var offset = -100;
  var $anchor = $(this);
  $('html, body').stop().animate({
    scrollTop: $($anchor.attr('data-id')).offset().top + offset
  }, 1000);
});

// initialize kinesis
kinesis = new Kinesis;
// call to action on hand aka cursor movement
Kinesis.cursor = movement;
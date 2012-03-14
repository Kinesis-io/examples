UIHorizontalScroll
==================

This is a readymade solution to horizontal scrolling tiles. 

<img src="http://docs.kinesis.io/images/kinesis/uihorizontalscroll.png" width=800 alt="UIHorizontalScroll" />

Here is a walkthrough of the implementation so you can easily customize the look, feel and functionality.


STEP 1. Add tiles to the html
--------------------------------

Add the sample html with kinesis js and css.

      <!DOCTYPE html>
      <html>
        <head>
          <!-- kinesis stylesheet -->
          <link rel="stylesheet" type="text/css" href="/lib/css/kinesis.css">
        </head>
        <body>
          <!-- kinesis js sdk -->
          <script src="/lib/js/kinesis-js-sdk.min.js"></script>
          <script>    
            var kinesis = new Kinesis; // initialize kinesis
            // start adding gestures from here //
          </script>
        </body>
      </html>
      
Now, we will add the tiles which will scroll horizontally. Add the below code to our html body:

      <div id="gridHolder">
        <div class="banner">UIHorizontalScroll</div>
        <div class="tileItem">A</div>
        <div class="tileItem">B</div>
        <div class="tileItem">C</div>
        <div class="tileItem">D</div>
        <div class="tileItem">E</div>
      </div>


STEP 2. Add custom js and styles
--------------------------------

Include jQuery and jquery.mousewheel.js to our app for we will need it for smooth horizontal slide effects.
Next, create a custom css file ___horizontal_scroll.css___ and js file and add them to our app. ___horizontal_scroll.js___. Our __index.html__ now looks like this:

      <!DOCTYPE html>
      <html>
        <head>
          <title>Kinesis.io UIHorizontalScroll</title>
          <!-- kinesis stylesheet -->
          <link rel="stylesheet" type="text/css" href="../../lib/css/kinesis.css">
        	<link rel="stylesheet" href="css/horizontal-scroll.css" type="text/css"/>
        </head>
        <body>
          <div id="gridHolder">
            <div class="banner">UIHorizontalScroll</div>
            <div class="tileItem">A</div>
            <div class="tileItem">B</div>
            <div class="tileItem">C</div>
            <div class="tileItem">D</div>
            <div class="tileItem">E</div>
          </div>
          <script src="js/jquery-1.6.4.min.js"></script>
        	<script src="js/jquery.mousewheel.js"></script>
        	<script src="/lib/js/kinesis-js-sdk.min.js"></script>
        	<script src="js/horizontal-scroll.js"></script>
        	<script>    
            var kinesis = new Kinesis; // initialize kinesis
            // start adding gestures from here //
          </script>
        </body>
      </html>
      
STEP 3. Create slideLeft and slideRight effects
-----------------------------------------------


      Now, to create a slide left effect we will basically translate the tiles towards the left direction. Each tile that comes to focus is activated by giving it an ___active___ class.

      // animate slide left - move a tile towards left and make it active
      $.fn.slideLeft = function() {
        var tiles = $(this);
        var _index = tiles.find('.tile').index(tiles.find('.active')[0]);
        var _left = tiles.find('.tile').width() * (_index + 1);
        if(_index < tiles.find('.tile').length - 1) {
          $(this).css("-webkit-transform", "translate(-" + _left + "px, 0)");
          $(this).css("-moz-transform", "translate(-" + _left + "px, 0)");
          setTimeout(function() {
      	    tiles.find('.active').removeClass('active').next().activate();
      	  }, 200 );
        };
      };
      
Add active class to the current tile:
      
      // activate tile
      $.fn.activate = function() {
        var me = $(this);
        if(me)
          setTimeout(function() {
      	    me.addClass('active');
      	  }, 200 );
      };
      
Similarly, slide right is created by translating the tile towards right.
      
      // animate slide right - move a tile towards right and make it active
      $.fn.slideRight = function() {
        var tiles = $(this);
        var _index = tiles.find('.tile').index(tiles.find('.active')[0]);
        var _left = tiles.find('.tile').width() * (_index - 1);
        if(_index > 0) {
          $(this).css("-webkit-transform", "translate(-" + _left + "px, 0)");
          $(this).css("-moz-transform", "translate(-" + _left + "px, 0)");
          setTimeout(function() {
      	    tiles.find('.active').removeClass('active').prev().activate();
      	  }, 200 );
        };
      };

      
STEP 4. Adding and binding gestures
-----------------------------------

Now we create a swipe left gesture:
      
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

Similarly, we create a swipe right gesture:

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
      
Here is a delegate method for swipe gesture call to action; depending upon the gesture corresponding functions are fired.

      function swipeControl(gesture) {
        switch(gesture){
          case leftGesture:
            $('#gridHolder').slideLeft();
            break;
          case rightGesture:
            $('#gridHolder').slideRight();
            break;
        }
      };

 
STEP 5. Adding CSS style
------------------------

Here are the basic styles for the scroller:

      /* general styles starts */
      * {
        margin: 0;
        padding: 0;
      }

      .clear {
        overflow: hidden; 
      }
      /* general styles ends */

      /* css transitions styles starts */
      #gridHolder { 
        -webkit-transition: all 0.5s ease-in; 
        -moz-transition: all 0.5s ease-in; 
        -o-transition: all 0.5s ease-in; 
        -ms-transition: all 0.5s ease-in;
      }
      /* css transitions styles ends */

      /* grid styles starts */
      #gridHolder td {
        width: 550px;
        overflow: hidden;
      }

      #gridHolder td .tileItem, #gridHolder td .banner {
        float: left;
        width: 500px;
        margin: 100px;
        padding: 20px;
        opacity: 0.7;
        font-size: 36px;
        min-height: 400px;
        line-height: 400px;
        text-align: center;
        background-color: #F8F8F8;
      }

      #gridHolder td .tileItem {
        font-size: 200px;
      }

      #gridHolder td.active .tileItem {
        opacity: 1;
        background-color: #fff;
      }
      /* grid styles ends */
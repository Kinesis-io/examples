Kinesis Quickstart - Hello Kinect
=======================

Let's walk through creating your first application, Hello Kinect. 

Prerequisites
-------------

Make sure the following steps:

  1. Downloaded and installed kinesis-sdk.

  2. Open Kinesis Simulator.
  
  3. Click _Start Server_ and _Connect Kinect_.

Code
----

### 1. Create a HTML document 'hello-world.html' ###

Copy below code in index.html.

    :::term
    <!DOCTYPE html>
    <html>
      <head>
        <!-- kinesis stylesheet -->
        <link rel="stylesheet" type="text/css" href="http://cdn.kinesis.io/kinesis.css">
      </head>
      <body>
        <!-- kinesis js sdk -->
        <script src="http://cdn.kinesis.io/kinesis-js-sdk.min.js"></script>
        <script>    
          var kinesis = new Kinesis; // initialize kinesis
          // start adding gestures from here //
        </script>
      </body>
    </html>

### 2. Test your app ###

That's it, your app is now running on Kinesis!

  1.  Run index.html on your browser. 
  
  ![Alt Hello Kinesis ](http://docs.kinesis.io/images/kinesis/hello.png)
  
  2.  Open firebug console; you should see following messages; ___Connection Opened___ .
  
  3.  You can see kinesis cursor on the screen. In the next step we will simulate hand tracking.
  
  4.  Open the Kinesis Simulator and goto ___Hand Tracking___ tab. Click on the red ball and drag it around the area. You will see our kinesis cursor moving along with the red ball.

Video
-----

[http://www.youtube.com/embed/x9tagZ8GVrA](http://www.youtube.com/embed/x9tagZ8GVrA)
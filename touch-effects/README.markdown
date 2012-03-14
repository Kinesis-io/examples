Touch Effects -  2 min app
==========================

How to make a Kinect app under 2 minutes:

[http://www.youtube.com/embed/caQZgb0uZts](http://www.youtube.com/embed/caQZgb0uZts)

Microsoft IE Test Drive - Touch Effects Sample [http://ie.microsoft.com/testdrive/Graphics/TouchEffects/](http://ie.microsoft.com/testdrive/Graphics/TouchEffects/)

### Initialization code which was added to the example

    <link rel="stylesheet" type="text/css" href="http://cdn.kinesis.io/kinesis.css">
    <!-- js at the bottom to load the page faster -->
    <script src="http://cdn.kinesis.io/kinesis-js-sdk.min.js"></script>
    <script type="text/javascript">
	    function movement(position)
	    {
		    touchPoints[0] = {x : position.x, y : position.y};
	    }
	    kinesis = new Kinesis;
	    Kinesis.cursor = movement;
    </script>
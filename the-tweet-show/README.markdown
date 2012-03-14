The Tweet Show
==============

This demo is an extension of UIHorizontalScroll. Here we will demonstrate how easy it is to  modify existing UIHorizontalScroll to custom solution. 

<img src="http://docs.kinesis.io/images/kinesis/thetweetshow.png" width=800 alt="The Tweet Show Demo" />

Here are steps to display twitter feeds as a gesture based slideshow. 


STEP 1. Copy the UIHorizontalScroll demo
----------------------------------------

As we are extending the UIHorizontalScroll demo we simply copy it to a new project.

STEP 2. Fetch twitter feeds
---------------------------

We fetch tweets by making a get request to twitter api. First we create some variables:
    
    // twitter information setup
    // twitter handle
    twhandle    = 'kinesisio';  
    // tweet count                                         
    twcount     = 10;        
    // user timeline                                              
    api_url     = 'https://api.twitter.com/1/statuses/user_timeline.json'; 
    // callback function
    callback    = 'twitterCallback2'   
    // require entities                                    
    entities    = 'true'   
    
Now, we create a twitter api request from above variables:                                                

    // create twitter api url
    request_url = api_url + '?callback=' + callback +'&include_entities=' + entities + '&screen_name=' + twhandle + '&count=' + twcount;

    // insert request to twitter api for fetching tweets to our document
    document.write('<script type="text\/javascript" src=');
    document.write(request_url);
    document.write('><\/script>');

STEP 3. Insert tweets to our grid holder as tileItems
-----------------------------------------------------

As we can see in the above request, twitter callback is set to a function ___twitterCallback2___. Now, we define this function to parse the tweets fetched and insert them to our DOM.

As we see in the horizontal scroll example we needed a gridHolder that contained scrollable tiles which had tileItems inside them. So, we wrap tweets inside a tileItem class.

    // twitter callback; iterates over fetched tweets and creates tweet elements dynamically and injects them as tile-items in the grid holder.
    function twitterCallback2(twitters) {
      var statusHTML = [];
      for (var i=0; i<twitters.length; i++) {
        // fetch tweet information
        var tweet = {
                      username: twitters[i].user.screen_name,
                      uname   : twitters[i].user.name,
                      imageurl: twitters[i].user.profile_image_url,
                      location: twitters[i].location,
                      entities: twitters[i].entities,
                      pic     : getTweetPic(twitters[i].entities)
                    };
        var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
          return '<a href="'+url+'">'+url+'</a>';
        }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
          return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
        });
        statusHTML.push('<div class="tileItem tweetBlock">'+ '<div class="intro"><img src="'+tweet.imageurl+'"/><span class="name">' + tweet.uname + '</span><span class="sname">@' + tweet.username + '</span></div><div class="tweet"><span>' + status+'</span> <a class="time" href="http://twitter.com/'+tweet.username+'/statuses/'+twitters[i].id_str+'">'+relative_time(twitters[i].created_at)+'</a></div>');
        if (tweet.pic)
          statusHTML.push('<a href="' + tweet.pic + '"' + 'class="pic"><img class="interactive" src="'+tweet.pic+'"/>' + '</a></div>');
        else
          statusHTML.push('</div>');
      };
      var oldHtml = document.getElementById('gridHolder').innerHTML;
      document.getElementById('gridHolder').innerHTML   = oldHtml + statusHTML.join('');
      document.getElementById('spinner').style.display  = 'none';
    }

    // get tweet pic url from tweet entities
    function getTweetPic(entities) {
      if (entities.media != undefined)
      return entities.media[0].media_url;
    }
    
STEP 4. Curate tweets
---------------------

    /* general styles starts */
    body {
      background: url('../images/bg.png') no-repeat fixed center center;
    }
    /* general styles ends */

    /* grid styles starts */

    .banner {
      background:#efefef url('../images/logo.png') no-repeat center center !important;
    }

    #gridHolder .tileItem .tweet, #gridHolder .tileItem .intro {
      float: left;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #ddd;
    }

    #gridHolder .intro span {
      font-family : AllerLightRegular;
    }

    #gridHolder .tileItem .tweet span {
      color: #333;
      line-height: 36px;
    }

    #gridHolder td.active .tileItem .tweet span {
      color: #000;
    }

    #gridHolder .tileItem .tweet .time {
      float: right;
      color: #555;
      font-size: 17px;
      margin: 10px 0 0;
      font-family : AllerLightRegular;
    }

    #gridHolder .tileItem .intro img {
      float: left;
    }

    #gridHolder .tileItem .intro span {
      font-size: 18px;
      display: inline;
      width: 300px;
      margin: 0 15px;
    }

    #gridHolder .tileItem .intro .name {
      font-size: 22px;
    }

    #gridHolder span {
      width: 450px;
      font-size: 32px;
      float: left;
      color: #000;
      font-family: GoudyStM;
    }
    
    #gridHolder .tweet a {
      font-size: 32px;
      color: #0084B4;
    }

    #gridHolder .pic {
      height: 340px;
      overflow: hidden;
      width: 455px;
      display: block;
      box-shadow: 0 2px 4px #333333;
    }

    #gridHolder .pic img {
      width: 455px;
    }

    #gridHolder span a:hover {
      text-decoration: underline;
      color: #666666;
    }

    #spinner {
      background: url('../images/ajax-loader.gif') no-repeat top left;
      width: 66px;
      height: 66px;
      position: absolute;
      top: 50%;
      left: 50%;
    }

    #fancybox-close label.interactive {
      color: transparent;
      padding: 0 5px 15px;
      text-indent: -9999px;
    }

    /* grid styles ends */

Demo Video
----------

[http://www.youtube.com/embed/bjXfxGn_v3o](http://www.youtube.com/embed/bjXfxGn_v3o)



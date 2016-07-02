var router = require('express').Router();
var watchslide=require('./watchslide.js');
var watchlistdetails=require('../watchlists/watchlists.js');

router.use('/',function(req,res,next){
  console.log("reached in the watchslide router");
  next();
});

//create a new slide for the user and the watchlist to that slide
///userslides/:username/:slidename (in paramers, new slide Name)
router.put('/user/:username/slide/:slideName', function (req, res) {
  console.log("slidename:"+req.params.slideName+" username is "+req.params.username);
  var slidename=req.params.slideName;
  console.log("this is my slide name"+slidename);
  var slide={"slidename":slidename, "watchlists":[]};
  watchslide.update({username:req.params.username},
    {$push: {mySlides:slide}},
    function (err, savedSlide) {
      if (err) {
        console.log("Error in adding a new slide: ", err);
        res.status(500).json({"error": err});
      }

      console.log("Saved slide: ", savedSlide);
      // res.send(watchslide+"returening from route");
      res.status(201).json(savedSlide);
    }
  );
});

// /userslides/:username/default

// for getting a specific slide details of a specific user
///userslides/:username/:slidename
//If there is no mention of a slidename in the URI, all slides of the user will be returned
router.get('/userdefaultslide/:slidename/:username', function (req, res) {
  console.log("Request is comming here ");
  var username=req.params.username;
  var slidename=req.params.slidename;
  console.log(username,"---",slidename);
  watchslide.find({username:username},'defaultSlide', function(err, watchslideData){
    if(err){
      console.log("Error is "+err);
    }
    console.log("from routes"+watchslideData+"find");
    res.send(watchslideData);
  });
});

router.get('/userslides/:slidename/:username', function (req, res) {
  console.log("Request is comming here ");
  var username=req.params.username;
  var slidename=req.params.slidename;
  console.log(username,"---",slidename);
  watchslide.find({username:username}, 'mySlides.slidename',function(err, watchslideData){
    if(err){
      console.log("Error is "+err);
    }
    console.log("from routes of getting a patricular slide"+watchslideData+"find");
    res.send(watchslideData);
  });
});
//for gettting all the slides of specific user
// No need of separate api
router.get('/allslides/:username', function (req, res, next) {
  console.log("inside route all slides");
  var username=req.params.username;
  watchslide.find({username: username}, 'mySlides.slidename', function(err, watchslideData){
    if(err){
      console.log("Error in fetching slides of user: ", err);
    }
    if(watchslideData.length == 0) {
      //go create a new entry for the user in the watchslide
    }
    console.log("from the all sldies router"+watchslideData);
    res.send(watchslideData);
  });
});

//delete a specified slide for the specified user
///userslides/:username/:slidename
router.delete('/:slidename/:username', function (req, res) {
  var username=req.params.username;
  var slidename=req.params.slidename;
  watchslide.remove({username: username,slidename:slidename},function(err, watchslideData){
    if(err){
      Object.keys(err.errors).forEach(function(key) {
        var message = err.errors[key].message;
        console.log('Validation error for "%s": %s', key, message);
      });
    }
    res.send(watchslideData);
  });
});
//getall watchlist data for org lside
router.get('/orgwatchlists', function (req, res) {
  watchlistdetails.find({}, function(err, watchslideData){
    if(err){
      console.log("Error is "+err);
    }
    console.log("from routes"+watchslideData+"find");
    res.send(watchslideData);
  });
});
// to add a watchlistname to a particular slide for a user
router.post('/addwatch/:username/:slidename/:watchname', function (req, res) {
  var username=req.params.username;
  var slidename=req.params.slidename;
  var watchname=req.params.watchname;
  watchslide.update({username: username,slidename:slidename,"myslides.1.watchname":watchname},function(err, watchslideData){
    if(err){
      Object.keys(err.errors).forEach(function(key) {
        var message = err.errors[key].message;
        console.log('Validation error for "%s": %s', key, message);
      });
    }
    res.send(watchslideData);
  });
});

module.exports=router;

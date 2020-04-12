var express = require("express"),
	router 		= express.Router(),
	Campground  = require("../models/campground"),
	middlewareObj =require("../middleware");
	
router.get("/",function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
		res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
});

router.post("/", middlewareObj.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id:req.user._id,
		username:req.user.username
	}
	var newCampground = {name:name, image:image, description:desc, author:author}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);	
		} else{
			console.log("*********");
			 console.log(newlyCreated);
			console.log("++++++++++++++");
			res.redirect("/campgrounds");
		}
	});
	
});

router.get("/new", middlewareObj.isLoggedIn, function(req, res){
	res.render("campgrounds/new.ejs")
});

//SHOW- SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec (function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
		//render show template with the 		campground
		res.render("campgrounds/show",{campground:foundCampground});
		}
	});
});

//Edit Campground Router
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
	res.render("campgrounds/edit", {campground:foundCampground});
	});
});
//Update Campground Route
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
	//find and update the correct campgrounds
	  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err){
			req.redirect("/campgrounds");
		} else{
			//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id); 

		}
		
	});
});

// Destroy ROute
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.rediect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports= router;
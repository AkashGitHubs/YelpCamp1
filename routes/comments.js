var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Campground 	= require("../models/campground"),
	Comment 	= require ("../models/comment"),
	middlewareObj = require("../middleware");



// var person = {
// 	name: "akash",
// 	age: "20"
// }



//Comments New
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});


// Comments Create	
router.post("/", middlewareObj.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
		  
        Comment.create( req.body.comment, function(err, kbho){
           if(err){
               console.log(err);
           } else {
			   	 kbho.author.id= req.user._id;
		  		 kbho.author.username= req.user.username;
		  		 kbho.save();
               campground.comments.push(kbho);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   });

//COMMENT EDIT ROUTE
// router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res){
// 	Comment.findById(req.params.comment_id, function(err, foundComment){
// 		if(err){
// 			req.flash("error", "something went wrong");
// 			res.redirect("back");
// 		} else{
// 			req.flash("success", "successfully edited");
// 			res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
// 		}
// 	});
	
// });
// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});


//Comment Update Router
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "success updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Delete router
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "successfully deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;
var express 	= require("express"),
 	app 		= express(),
	bodyParser 	= require("body-parser"),
 	mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground.js"),
	Comment 	= require("./models/comment.js"),
	seedDB		= require("./seeds"),
	flash  		= require("connect-flash"),
	User		= require("./models/user"),
	passport	= require("passport"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");

var campgroundRoutes = require("./routes/campgrounds.js"),
	commentRoutes	 = require("./routes/comments.js"),
	indexRoutes		 = require("./routes/index.js");

	
//seedDB();
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v11";
mongoose.connect(url, 
{useNewUrlParser: true,
useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static( __dirname + "/public"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use (require("express-session")({
		 secret:"Once again Rusty wins cutest dog",
		 resave:false,
		 saveUninitialized:false
		 }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use (function(req, res, next){
	res.locals.currentUser	= req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});



app.use("/campgrounds", campgroundRoutes);
app.use( "/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);



// *****first time ****
// 	heroku login -i
// 	git init	//	for single project
// 	git add .
// 	git status
// 	git commit -m "change name"
// heroku create // for single application
// git push heroku master





app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Yelp Camp server has started");
});
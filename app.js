var express = require("express"),
    app = express(),
    expressSession = require("express-session"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Camp = require("./models/campground"),
    flash = require("connect-flash"),
    comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seed"),
    methodOverride = require("method-override");

//ROUTE VARS
var commentRoutes = require("./routes/comment"),
    lookcampsRoutes = require("./routes/lookcamps"),
    authRoutes = require("./routes/index");


//CONNECTING TO MONGOOSE
mongoose.connect("mongodb+srv://sachin95:J6LeU31eae5flR8Z@shcluster-jxxfr.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

//BASIC CONFIG
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true

}));
app.use(methodOverride("_method"));
app.use(flash());

//SEEDING DB


//PASSPORT CONFIG
app.use(expressSession({
    secret: "ASLD<ASDL ASLD<QWEK ASLDQWLEK ASLDKQWEK",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTES
app.use("/lookcamps", lookcampsRoutes);
app.use("/", authRoutes);
app.use("/lookcamps/:id/comment", commentRoutes);


app.get("*", function (req, res) {
    res.render("nopage");
});
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("looK v3 server running..");
});

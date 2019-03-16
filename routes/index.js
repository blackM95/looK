var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

//HOME ROUTE
router.get("/", function (req, res) {
    res.render("landing");
});



//AUTH ROUTES
//REGISTER ROUTE

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome To looK!  " + user.username);
            res.redirect("/lookcamps");
        });


    })

});

//LOGIN ROUTE
router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/lookcamps",
    failureRedirect: "/login",
    failureFlash: "Incorrect Username or password"
}), function (req, res) {

});

//LOGOUT ROUTE
router.get("/logout", function (req, res) {

    req.logout();
    req.flash("success", "logged you out!");
    res.redirect("/")
});

module.exports = router;

var comment = require("../models/comment"),
    Camp = require("../models/campground")
var middleware = {};
middleware.authenticateUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        comment.findById(req.params.id1, function (err, comment) {
            if (err && !comment) {
                req.flash("error", "comment not found");
                res.redirect("back");
            }
            else if (comment.author.id.equals(req.user._id)) {
                next();
            }
            else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that!!");
        res.redirect("/login");
    }

}
middleware.authenticateUserCamp = function (req, res, next) {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, function (err, camp) {
            if (err || !camp) {

                req.flash("error", "Camp not Found!");
                res.redirect("back");
            }
            else if (camp.author.id.equals(req.user._id)) {
                next();
            }
            else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that!!");
        res.redirect("/login");
    }
}

middleware.loggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be Logged In to do that");
    res.redirect("/login");
}
module.exports = middleware;

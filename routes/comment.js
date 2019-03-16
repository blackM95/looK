var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Camp = require("../models/campground"),
    comment = require("../models/comment"),
    middleware = require("../middleware/index");

//COMMENT ROUTES

router.get("/new", middleware.loggedIn, function (req, res) {
    Camp.findById(req.params.id, function (err, camp) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("newcomment", { camp: camp });
        }
    });
});


router.post("/", middleware.loggedIn, function (req, res) {
    Camp.findById(req.params.id, function (err, camp) {
        if (err) {
            console.log(err);
        }
        else {
            comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", " Something went wrong!");
                    res.redirect("back");
                }
                else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/lookcamps/" + camp._id);
                }
            });
        }
    });
});

//EDIT THE COMMENT
router.get("/:id1/edit", middleware.authenticateUser, function (req, res) {
    Camp.findById(req.params.id, function (err, camp) {
        if (err || !camp) {
            req.flash("error", "Camp not Found");
            res.redirect("back");
        }
        else {
            comment.findById(req.params.id1, function (err, comment) {
                if (err && !comment) {
                    req.flash("error", "comment not found");
                    res.redirect("back");
                }
                else {
                    res.render("editComment", {
                        camp: camp,
                        comment: comment
                    });
                }
            });
        }
    });

});

router.put("/:id1", middleware.authenticateUser, function (req, res) {
    Camp.findById(req.params.id, function (err, camp) {
        if (err) {
            res.redirect("back");
        }
        comment.findByIdAndUpdate(req.params.id1, req.body.comment, function (err, comment) {
            if (err) {
                res.redirect("back");
            }
            else {
                res.redirect("/lookcamps/" + camp._id);
            }
        });
    });
});

//DELETE THE COMMENT
router.delete("/:id1", middleware.authenticateUser, function (req, res) {
    Camp.findById(req.params.id, function (err, camp) {
        if (err) {
            res.redirect("back");
        }
        else {
            comment.findByIdAndRemove(req.params.id1, function (err) {
                if (err) {
                    res.redirect("/lookcamps/" + camp._id);
                }
                req.flash("success", "Comment deleted!");
                res.redirect("/lookcamps/" + camp._id);
            });
        }
    });
});




module.exports = router;

var express = require("express"),
    router = express.Router(),
    Camp = require("../models/campground"),
    middleware = require("../middleware/index");
//LOOK ALL CAMPS ROUTE
router.get("/", function (req, res) {
    Camp.find({}, function (err, Camp) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("lookcamps", {
                camps: Camp
            });
        }
    });
});
router.get("/new", middleware.loggedIn, function (req, res) {
    res.render("new");
});
router.post('/', middleware.loggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = { username: req.user.username, id: req.user._id };
    var newCamp = {
        name: name,
        image: image,
        description: desc,
        author: author,
        price: price
    };
    Camp.create(newCamp, function (err, Camp) {
        if (err) {
            console.log("some err");
            console.log(err);
        }
        else {
            console.log("Camp added..!");
            console.log(Camp);
        }
    });
    res.redirect("/lookcamps");
});
router.get("/:id", function (req, res) {
    Camp.findById(req.params.id).populate("comments").exec(function (err, camp) {
        if (err || !camp) {
            req.flash("error", "Camp not found!");
            res.redirect("back");
        }
        else {

            res.render("show", {
                camp: camp,
                comment: camp.comments
            });
        }
    });
});
//Edit Campground route 
router.get("/:id/edit", middleware.authenticateUserCamp, function (req, res) {
    Camp.findById(req.params.id, function (err, camp) {
        if (err) {
            req.flash("error", "Camp not Found!");
            res.redirect("back");
        }
        else {
            res.render("edit", { camp: camp });
        }
    });

});


//Update Campground Route

router.put("/:id", middleware.authenticateUserCamp, function (req, res) {
    Camp.findByIdAndUpdate(req.params.id, req.body.camp, function (err, updateCamp) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/lookcamps/" + req.params.id);
        }
    });
});

//DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.authenticateUserCamp, function (req, res) {
    Camp.findById(req.params.id, function (err, camp) {
        if (err) {
            res.redirect("back");
        }
        else {
            camp.remove();
            res.redirect("/lookcamps");
        }
    });
});



module.exports = router;

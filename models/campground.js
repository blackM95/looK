var mongoose = require("mongoose");
const Comment = require('./comment');
//SCHEMA SETUP

var campSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            href: "User"
        }
    }
});
campSchema.pre('remove', async function (next) {
    try {
        await Comment.remove({
            _id: {
                $in: this.comments
            }

        });
        next();
    }
    catch (err) {
        next(err);
    }


});
module.exports = mongoose.model("Camp", campSchema);

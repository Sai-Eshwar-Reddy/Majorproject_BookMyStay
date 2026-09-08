const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expresserrors.js");
const { reviewJoiSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// reviews route
router.post("/",
    wrapAsync(async (req, res) => {
        let result = reviewJoiSchema.validate(req.body);
        if (result.error) {
            throw new ExpressError(400, result.error.details[0].message);
        }
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        let new_review = new Review(req.body.review);
        await new_review.save();
        listing.reviews.push(new_review);
        await listing.save();
        req.flash("reviewSuccess","Review added");
        res.redirect(`/listings/${listing.id}`);
    })
);


//Delete review route
router.delete("/:reviewid",
    wrapAsync(
        async(req,res)=>{
            let {id,reviewid}=req.params;
            await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
            await Review.findByIdAndDelete(reviewid);
            req.flash("reviewDelete", "Review deleted");
            res.redirect(`/listings/${id}`);
        }
    )
);

module.exports = router;
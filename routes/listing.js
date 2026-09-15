const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expresserrors.js")
const {listingJoiSchema,reviewJoiSchema}= require("../schema.js");
const {isLoggedin} = require("../middleware.js");

//Index Route 
router.get("/",
    wrapAsync(
    async (req,res) =>
    {
        let all_data = await Listing.find({});
        res.render("listings/index.ejs",{all_data});
    }
));

//Add route(Renders a form to add listings)
router.get("/new",isLoggedin,(req,res)=>{
    res.render("listings/addnew.ejs");
})

//Show Route(Renders individual listing details)
router.get("/:id",
    wrapAsync(   
    async (req,res) =>
    {
        let individual_data = await Listing.findById(req.params.id).populate("reviews").populate("owner");
        if (!individual_data) 
        {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/show.ejs",{individual_data});
    }
));

//create Rooute
router.post("/",
    wrapAsync(
    async (req,res) =>
    {
        let result = listingJoiSchema.validate(req.body.new_listing);
        if (result.error) {
            throw new ExpressError(400, result.error.details[0].message);
        }
        let new_listing = new Listing(req.body.new_listing);
        await new_listing.save();
        req.flash("success","Post Added");
        res.redirect("/listings");
    }
));

//Edit Route(Renders Edit Form)
router.get('/:id/edit',isLoggedin,
    wrapAsync(
    async (req,res) =>
    {
        let individual_data = await Listing.findById(req.params.id);
        if (!individual_data) {
            throw new ExpressError(404, "Listing not found");
        }
        if (!individual_data.owner.equals(req.user._id)) {
            req.flash("error", "You are not authorized to edit this listing");
            return res.redirect(`/listings/${req.params.id}`);
        }
        res.render("listings/edit.ejs",{individual_data});
    }
));

router.put(
    "/:id",
    wrapAsync(async (req, res) => {
        let result = listingJoiSchema.validate(req.body.individual_data);
        if (result.error) {
            throw new ExpressError(
                400,
                result.error.details[0].message
            );
        }
        // Find the listing
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        // Check ownership
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "Authorization Failed");
            return res.redirect(`/listings/${req.params.id}`);
        }
        // Update listing
        let updated_listing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body.individual_data,
            {
                runValidators: true
            }
        );
        req.flash("listingUpdated", "Listing updated successfully");
        res.redirect(`/listings/${req.params.id}`);
    })
);

//Delete route 
router.delete("/:id", isLoggedin,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        // Find the listing
        let listing = await Listing.findById(id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        // Check ownership/authorization
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "Authorization Failed");
            return res.redirect(`/listings/${id}`);
        }
        // Proceed with deletion if authorized
        await Listing.findByIdAndDelete(id);
        req.flash("error", "Post deleted");
        res.redirect("/listings");
    })
);

module.exports = router;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expresserrors.js")
const Joischema = require("./schema.js")
//to test api directly can remove later
const cors = require("cors");
app.use(cors());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

async function main() 
{
    await mongoose.connect("mongodb://127.0.0.1:27017/Bookmystay");
}
main()
.then(()=>{
    console.log("Database is connected");
})
.catch((err)=>{
    console.log(err);
})

//Index Route 
app.get("/listings",
    wrapAsync(
    async (req,res) =>
    {
        let all_data = await Listing.find({});
        res.render("listings/index.ejs",{all_data});
    }
));

//Add route(Renders a form to add listings)
app.get("/listings/new",(req,res)=>{
    res.render("listings/addnew.ejs");
})

//Show Route(Renders individual listing details)
app.get("/listings/:id",
    wrapAsync(   
    async (req,res) =>
    {
        let individual_data = await Listing.findById(req.params.id);
        if (!individual_data) 
        {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/show.ejs",{individual_data});
    }
));

//create Rooute
app.post("/listings",
    wrapAsync(
    async (req,res) =>
    {
        let result = Joischema.validate(req.body.new_listing);
        if (result.error) {
            throw new ExpressError(400, result.error.details[0].message);
        }
        let new_listing = new Listing(req.body.new_listing);
        await new_listing.save();
        res.redirect("/listings");
    }
));

//Edit Route(Renders Edit Form)
app.get('/listings/:id/edit',
    wrapAsync(
    async (req,res) =>
    {
        let individual_data = await Listing.findById(req.params.id);
        if (!individual_data) {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/edit.ejs",{individual_data});
    }
));

//Update route
app.put(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let result = Joischema.validate(req.body.individual_data);
        if (result.error) {
            throw new ExpressError(400,result.error.details[0].message);
        }
        let updated_listing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body.individual_data,
            {
                runValidators: true
            }
        );
        if (!updated_listing) {
            throw new ExpressError(404, "Listing not found");
        }
        res.redirect(`/listings/${req.params.id}`);
    })
);

//Delete route 
app.delete("/listings/:id",
    wrapAsync(
        async (req,res)=>
        {
            let deleted_listing = await Listing.findByIdAndDelete(req.params.id);
            if (!deleted_listing) {
                throw new ExpressError(404, "Listing not found");
            }
            res.redirect("/listings");
        }
));

//Home or root route
app.get ('/',(req,res)=>{
        res.send("hi");
})

//Page not found handling
app.all("*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

//Error handler 
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs",{message})
});

//Server listner
app.listen(3000,()=>{
    console.log("server is running at 3000")
})
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/listings",async (req,res)=>{
    let all_data = await Listing.find({});
    res.render("listings/index.ejs",{all_data});
})

//Add route(Renders a form to add listings)
app.get("/listings/new",async (req,res)=>{
    res.render("listings/addnew.ejs");
})

//Show Route(Renders individual listing details)
app.get("/listings/:id",async (req,res)=>{
    let individual_data = await Listing.findById(req.params.id);
    res.render("listings/show.ejs",{individual_data});
})

//create Rooute
app.post("/listings",async(req,res)=>{
    let new_listing = new Listing(req.body.new_listing);
    new_listing.save()
    res.redirect("/listings");
})

//Edit Route(Renders Edit Form)
app.get('/listings/:id/edit',async (req,res)=>{
    let individual_data = await Listing.findById(req.params.id);
    res.render("listings/edit.ejs",{individual_data});
})

//Update route
app.put("/listings/:id",async (req,res)=>{
    await Listing.findByIdAndUpdate(req.params.id,req.body.individual_data);
    res.redirect(`/listings/${req.params.id}`);
})

//Delete route 
app.delete("/listings/:id",async (req,res)=>{
    let deleted_listing = await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
})

//Home or root route
app.get ('/',(req,res)=>{
        res.send("hi");
})

//Server listner
app.listen(3000,()=>{
    console.log("server is running at 3000")
})
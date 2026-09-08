const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const flash = require("connect-flash");
const ExpressError = require("./utils/expresserrors.js");
const session = require("express-session");
const {listingJoiSchema,reviewJoiSchema}= require("./schema.js");
const Review = require("./models/review.js");
//to test api directly can remove later
const cors = require("cors");
app.use(cors());

//Router imports
const listings_router = require("./routes/listing.js");
const reviews_router = require('./routes/review.js');

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

//Express-sessions
const session_options = {
    secret : "Shouldberandom",
    resave : false,
    saveUninitialized : true,
    Cookie: {
        expires: Date.now() + 3 * 60 * 1000,
        maxAge: 3 * 60 * 1000,
        httpOnly : true
    }
}

//Session and flash middleware
app.use(session(session_options));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("delete");
    res.locals.reviewSuccess = req.flash("reviewSuccess");
    res.locals.reviewDelete = req.flash("reviewDelete");
    res.locals.listingUpdated = req.flash("listingUpdated");
    next();
})

//Router
app.use('/listings',listings_router);
app.use('/listings/:id/reviews',reviews_router);

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
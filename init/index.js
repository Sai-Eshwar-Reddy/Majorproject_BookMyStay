const mongoose = require("mongoose");
const Data = require('./initdata.js');
const Listing = require('../models/listing.js');

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

const initdata = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(Data.data)
    .then(()=>{
        console.log("data is initialized");
    })
    .catch((err)=>{
        console.log(err);
    })
}
initdata();
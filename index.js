const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.get('/',(req,res)=>{
    res.send("hi");
})
app.listen(3000,()=>{
    console.log("server is running at 3000")
})
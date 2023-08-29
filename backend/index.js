const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const { create } =require( "./controller");

const app=express();

mongoose.connect(process.env.DATABASE);



const CalculatorSchema = new mongoose.Schema(
  {
  Calculations:{
    type:String
  }

  },
  { timestamps: true }
);



module.exports = CalculatorDetails=mongoose.model("CalculatorDetails", CalculatorSchema);

app.use(bodyParser.json({limit:"2mb"}));
app.listen(process.env.PORT,()=>{
    console.log("Backend Sever")
})

app.post("/api/create",async(req,res)=> {
   console.log(req.body)
     try {
    const {Calculations} = req.body;
    console.log(Calculations)
    const resultdata = await new CalculatorDetails({Calculations}).save()
    console.log(resultdata)
     res.json(resultdata);
  
  } catch (err) {
   
    console.log(err)
    res.status(400).send("Create Failed.Please check the data again.");
  }
}
)

app.get("/api/get", async (req, res) =>
  res.json(await CalculatorDetails.find({}).sort({ createdAt: -1 }).exec()))




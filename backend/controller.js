const CalculatorDetails = require("./index.js");


exports.create=async(req,res)=> {
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

const { HoldingsModel } = require("../model/HoldingsModel");

module.exports.index = async(req,res) =>{
    const allHolding = await HoldingsModel.find({ userId: req.userId });
     res.json(allHolding);  
}


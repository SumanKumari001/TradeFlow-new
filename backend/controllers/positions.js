const { PositionsModel } = require("../model/PositionsModel");

const getAllPositions = async (req, res) => {

  try {

    const positions = await PositionsModel.find({
      userId: req.userId
    });

    res.status(200).json(positions);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error fetching positions"
    });

  }
};

module.exports = {
  getAllPositions
};
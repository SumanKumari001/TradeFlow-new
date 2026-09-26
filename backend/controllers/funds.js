
const { FundsModel } = require("../model/FundModel");

module.exports.index = async (req, res) => {
    try {
        let funds = await FundsModel.findOne({
            userId: req.userId
        });

        // Create funds for user if they don't have one yet
        if (!funds) {
            funds = await FundsModel.create({
                userId: req.userId
            });
        }

        res.json(funds);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


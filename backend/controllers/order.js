
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { FundsModel } = require("../model/FundModel");
const { PositionsModel } = require("../model/PositionsModel");

// ================= GET ORDERS =================

module.exports.getOrders = async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({
      userId: req.userId
    });

    res.json(allOrders);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// ================= BUY FORM =================

module.exports.renderNewForm = (req, res) => {
  res.json({
    message: "Buy form route"
  });
};


// ================= ADD ORDER =================

module.exports.addNewOrder = async (req, res) => {
console.log("🔥 ADD NEW ORDER CALLED");

  try {

    console.log("USER ID:", req.userId);

    const { name, qty, price } = req.body;
      
    const mode = String(req.body.mode || "").toUpperCase();

    // ---------- Validate order ----------

    if (
      !name ||
      !Number.isFinite(Number(qty)) ||
      Number(qty) <= 0 ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !["BUY", "SELL"].includes(mode)
    ) {
      return res.status(400).json({
        error: "Invalid order details"
      });
    }


    // ---------- Find funds ----------

    let funds = await FundsModel.findOne({
      userId: req.userId
    });

    // Create funds account if it doesn't exist

    if (!funds) {
      funds = await FundsModel.create({
        userId: req.userId
      });
    }


    // ---------- Find existing holding ----------

    let existing = await HoldingsModel.findOne({
      userId: req.userId,
      name
    });


    // =================================================
    // ====================== BUY =======================
    // =================================================

    if (mode === "BUY") {

      const orderValue = Number(qty) * Number(price);
      console.log("BUY ORDER VALUE:", orderValue);
      console.log("CASH BEFORE:", funds.availableCash);

      // Check available money

      if (funds.availableCash < orderValue) {

        return res.status(400).json({
          error: "Insufficient funds"
        });

      }


      // ---------- Existing holding ----------

      if (existing) {

        const totalQty =
          existing.qty + Number(qty);

        const newAvg =
          (
            existing.qty * existing.avg +
            Number(qty) * Number(price)
          ) / totalQty;


        existing.qty = totalQty;
        existing.avg = newAvg;
        existing.price = Number(price);

        existing.net =
          ((price - newAvg) * totalQty).toFixed(2);

        existing.day = "0.00";

        await existing.save();

      }

      // ---------- New holding ----------

      else {

        await HoldingsModel.create({

          userId: req.userId,
          name,
          qty: Number(qty),
          avg: Number(price),
          price: Number(price),
          net: "0.00",
          day: "0.00"

        });

      }


      // ---------- Create order ----------

      await OrdersModel.create({

        userId: req.userId,
        name,
        qty: Number(qty),
        price: Number(price),
        mode

      });


      // ---------- Update funds ----------

      funds.availableCash -= orderValue;

      await funds.save();
      console.log("CASH AFTER:", funds.availableCash);

      return res.json({
        message: "BUY successful"
      });

    }


    // =================================================
    // ====================== SELL ======================
    // =================================================

    if (mode === "SELL") {


      // User must own the stock

      if (!existing) {

        return res.status(400).json({
          error: "You don't own this stock"
        });

      }


      // User cannot sell more than owned quantity

      if (existing.qty < Number(qty)) {

        return res.status(400).json({
          error: "Not enough quantity"
        });

      }

      let position = await PositionsModel.findOne({
          userId: req.userId,
          name
      });
      const orderValue =
        Number(qty) * Number(price);


      // ---------- Reduce holding ----------

      existing.qty -= Number(qty);


      if (existing.qty === 0) {

        await HoldingsModel.deleteOne({
          userId: req.userId,
          name
        });

      }

      else {

        existing.price = Number(price);

        existing.net =
          ((price - existing.avg) * existing.qty).toFixed(2);

        existing.day = "0.00";

        await existing.save();

      }


      // ---------- Create sell order ----------

      await OrdersModel.create({

        userId: req.userId,
        name,
        qty: Number(qty),
        price: Number(price),
        mode

      });


      // ---------- Add money back ----------

      funds.availableCash += orderValue;


      if (position) {
          const totalQty = position.qty + Number(qty);

          position.avg =
              (
                  position.qty * position.avg +
                  Number(qty) * Number(price)
              ) / totalQty;

          position.qty = totalQty;
          position.price = Number(price);
          position.product = "CNC";
          position.day = "0.00";
          position.isLoss = false;

          await position.save();

      } else {
          await PositionsModel.create({
              userId: req.userId,
              product: "CNC",
              name,
              qty: Number(qty),
              avg: Number(price),
              price: Number(price),
              net: "0.00",
              day: "0.00",
              isLoss: false
          });
      }
      await funds.save();


      return res.json({
        message: "SELL successful"
      });

    }


  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

};


// ### One important filename check 🔴

// You currently have:


// const { FundsModel } = require("../model/FundModel");
// ```

// But earlier we used:

// ```text
// FundsModel.js
// ```

// **The filename must match exactly.**

// If your file is:

// ```text
// model/FundsModel.js
// ```

// then use:

// ```js
// const { FundsModel } = require("../model/FundsModel");
// ```

// If your actual file is:

// ```text
// model/FundModel.js
// ```

// then your current import is correct.

// So **don't change it blindly**. Check the actual filename in your `model` folder.

// ---

// ### What happens now?

// Suppose the user has:

// ```text
// Opening Balance = ₹10,000
// Available Cash  = ₹10,000
// ```

// They BUY:

// ```text
// 2 shares × ₹2,000 = ₹4,000
// ```

// The controller does:

// ```text
// BUY
//  ↓
// Check ₹10,000 >= ₹4,000
//  ↓
// Create/update Holding
//  ↓
// Create Order
//  ↓
// Available Cash = ₹10,000 - ₹4,000
//  ↓
// ₹6,000
// ```

// Then the Funds page should show:

// ```text
// Available margin   ₹6,000
// Available cash     ₹6,000
// Opening Balance    ₹10,000
// ```

// Then if they SELL those 2 shares at ₹2,200:

// ```text
// 2 × ₹2,200 = ₹4,400
// ```

// Cash becomes:

// ```text
// ₹6,000 + ₹4,400 = ₹10,400
// ```

// That means your simple trading simulation now reflects **actual cash movement**, including profit/loss from the sale. 💰📈

// **One more thing:** I deliberately did **not** update `usedMargin`. For your current delivery-style simulation, `availableCash` is enough. We can later decide what `usedMargin` should represent instead of making that number mathematically misleading.

// After replacing the controller, **restart the backend** and test one BUY. Then check `/api/funds` again.

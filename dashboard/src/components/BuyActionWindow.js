import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid ,mode}) => {
  const apiUrl = `http://${window.location.hostname}:3002`;
  
  const [stockQuantity, setStockQuantity] = useState(1); //default value is 1 because we cannot buy 0 stock
  const [stockPrice, setStockPrice] = useState(0.0);//0.0 because its value is set by user. If we want, we can take its value as props along with uid that is default market value
  //   Case 2: Limit Order (what your code is doing)
  // User says: “I want to buy this stock at ₹100, not more”
  // So: If current price = ₹105 → order waits  || If price drops to ₹100 → order executes
  
const { closeBuyWindow ,triggerOrdersRefresh} = useContext(GeneralContext);
const handleClick = async () => {
    try{
      await axios.post(`${apiUrl}/api/allOrders/newOrder`, {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode: mode,
    },
  {
    withCredentials:true
  });
     console.log("BUTTON CLICKED"); 

    triggerOrdersRefresh();
    console.log("Triggering refresh...");

    closeBuyWindow(mode); //jaise hi order place ho gaya successfully window apne ap close ho jayega
  } catch (err) {
    alert(err.response?.data?.error || err.response?.data?.message || "Order failed");
  }
  };


  const handleCancelClick = () => {
    closeBuyWindow(mode);
  };

  return (
    <div className="container_details" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(Number(e.target.value))}//e	-> event object,  target ->	the input box  ,value ->	what user typed
              //e.target.value is always a string, we have to change it into number so that calculaiton or comparision can be done on sell logic controllers
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
      {/* {mode === "BUY" ? (
        <button className="btn btn-blue" onClick={handleBuyClick}>
          Buy
        </button>
      ) : (
        <button className="btn btn-red" onClick={handleSellClick}>
          Sell
        </button>
      )} */}
    <button
    className={`btn ${mode?.toUpperCase() === "BUY" ? "btn btn-success btn-sm" : "btn btn-danger btn-sm"} `}
    onClick={handleClick}
    
    >
      
    {mode?.toUpperCase() === "BUY" ? "Buy" : "Sell"}
  </button>

  <button className="btn btn-grey" onClick={handleCancelClick}>
    Cancel
  </button>
</div>
      </div>
    </div>
  );
};

export default BuyActionWindow;

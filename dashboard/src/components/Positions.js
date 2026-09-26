import React, { useState, useEffect } from "react";
import axios from "axios";

function Positions() {
  const [allPositions, setAllPositions] = useState([]);

  // const fetchPositions = async () => {
  // const res = await axios.get("http://localhost:3002/api/positions");
  // setAllPositions(res.data);
  // };
  useEffect(() => {
    axios.get(`http://${window.location.hostname}:3002/api/allPositions`, {
      withCredentials: true
    })
      .then((res) => {
        setAllPositions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>
          <tbody>
          {allPositions.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const isProfit = curValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={stock._id}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td className={profClass}>
                  {(curValue - stock.avg * stock.qty).toFixed(2)}
                </td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;

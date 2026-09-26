import React, { useState, useEffect,useContext } from "react";
import axios from "axios"; // removed { all }
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";

function Orders() {
  const apiUrl = `http://${window.location.hostname}:3002`;
  const [allOrders, setAllOrders] = useState([]);
  const { refreshOrders } = useContext(GeneralContext);
  useEffect(() => {
    console.log("REFETCH TRIGGERED"); 
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/allOrders`,
          {
            withCredentials: true
          }
        );
        console.log("Orders fetched:", allOrders);
        setAllOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [refreshOrders]); // dependency added

  return (
    <div className="orders">
      {allOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>

          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <>
          <h3 className="title">Orders ({allOrders.length})</h3>

          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg.</th>
                </tr>
              </thead>

              <tbody>
                {allOrders.map((stock) => (
                  <tr key={stock._id}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{stock.price}</td>
                    <td>{stock.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
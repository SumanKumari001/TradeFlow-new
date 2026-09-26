import React, { useEffect, useState } from "react";

import Menu from "./Menu";

const TopBar = () => {

    const apiUrl = `http://${window.location.hostname}:3002`;

    const [indices, setIndices] = useState([]);

    useEffect(() => {

        const fetchIndices = async () => {

            try {

                const res = await fetch(
                    `${apiUrl}/api/market/indices`
                );

                const data = await res.json();

                setIndices(data);

            } catch (err) {

                console.log("Failed to fetch indices:", err);

            }

        };

        fetchIndices();

        const interval = setInterval(
            fetchIndices,
            30000
        );

        return () => clearInterval(interval);

    }, []);


    const nifty = indices.find(
        (index) => index.symbol === "^NSEI"
    );

    const sensex = indices.find(
        (index) => index.symbol === "^BSESN"
    );


    return (
        <div className="topbar-container">

            <div className="indices-container">

                <div className="nifty">

                    <p className="index">
                        NIFTY 50
                    </p>

                    <p className="index-points">
                        {nifty
                            ? nifty.price
                            : "Loading..."}
                    </p>

                    <p
                        className={
                            nifty?.isDown
                                ? "percent down"
                                : "percent up"
                        }
                    >
                        {nifty
                            ? `${nifty.percent}%`
                            : ""}
                    </p>

                </div>


                <div className="sensex">

                    <p className="index">
                        SENSEX
                    </p>

                    <p className="index-points">
                        {sensex
                            ? sensex.price
                            : "Loading..."}
                    </p>

                    <p
                        className={
                            sensex?.isDown
                                ? "percent down"
                                : "percent up"
                        }
                    >
                        {sensex
                            ? `${sensex.percent}%`
                            : ""}
                    </p>

                </div>

            </div>

            <Menu />

        </div>
    );
};

export default TopBar;

import React from "react";
import Hero from "./Hero";
import Options from "./InvestOptions";
import Steps from "./Steps";
import Benefits from "./Benefits";
import OpenAccount from "../OpenAccount";
function Signup(){
    console.log("Signup loaded");
    return(
        <div>
        <Hero />
        <Options />
        <Steps />
        <Benefits />
        <OpenAccount />
        </div>
    );
}

export default Signup;
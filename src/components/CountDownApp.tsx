import { Fragment } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Heading } from "@chakra-ui/react";

import React, { Component } from "react";

import { motion } from "framer-motion";

import "./progressbar.css";

const today = new Date();
var hours = today.getHours();
var mins = today.getMinutes();
var secs = today.getSeconds();

const initialTotalTimeMS = 100 * 7200; //2 Hours

let finishTimeSeconds = initialTotalTimeMS / 1000;
let finsihTimeMinutes = Math.floor(finishTimeSeconds / 60);
let finishTimeHours = Math.floor(finsihTimeMinutes / 60);

const finishTime = today;
finishTime.setHours(today.getHours() + finishTimeHours);
finishTime.setMinutes(today.getMinutes() + finsihTimeMinutes);
finishTime.setHours(today.getSeconds() + finishTimeSeconds);

export const CountDownApp = () => {
  const timeMS = useCountdown(initialTotalTimeMS, () =>
    console.log("Times up!!")
  );

  let timeTotalSeconds = timeMS / 1000;
  let timeTotalMinutes = Math.floor(timeTotalSeconds / 60);
  let timeTotalHours = Math.floor(timeTotalMinutes / 60);

  let displayMinutes = timeTotalMinutes % 60;
  let displaySeconds = timeTotalSeconds % 60;

  if (timeTotalSeconds === 0) {
    return <Heading>TIMES UP!</Heading>;
  } else {
    return (
      <Fragment>
        <Heading>
          {timeTotalHours} : {displayMinutes} : {displaySeconds}
        </Heading>

        <div className="progressbar-container">
          <div className="progressbar">
            <motion.div
              className="bar"
              animate={{ width: "0%" }}
              transition={{ duration: timeTotalSeconds }}
            />
          </div>
        </div>
      </Fragment>
    );
  }
};

export default CountDownApp;

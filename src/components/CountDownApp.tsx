import { Fragment } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Heading } from "@chakra-ui/react";

import React, { Component } from "react";

import { motion } from "framer-motion";

import "./progressbar.css";

export const CountDownApp = () => {
  const initialTotalTimeMS = 100 * 10000;
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

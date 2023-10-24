<<<<<<< HEAD
import { useCountdown } from "./useCountdown";
import { Heading } from "@chakra-ui/react";
export const CountDownApp = () => {
  const initialTotalTimeMS = 9000 * 1000;
=======
import { Fragment } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Heading } from "@chakra-ui/react";

import React, { Component } from "react";

import { motion } from "framer-motion";

import "./progressbar.css";

export const CountDownApp = () => {
  const initialTotalTimeMS = 100 * 1000;
>>>>>>> main
  const timeMS = useCountdown(initialTotalTimeMS, () =>
    console.log("Times up!!")
  );

  let timeTotalSeconds = timeMS / 1000;
  let timeTotalMinutes = Math.floor(timeTotalSeconds / 60);
  let timeTotalHours = Math.floor(timeTotalMinutes / 60);

  let displayMinutes = timeTotalMinutes % 60;
  let displaySeconds = timeTotalSeconds % 60;

<<<<<<< HEAD
  console.log("Seconds: ", timeMS / 1000);

  if (timeTotalSeconds === 0) {
    return <Heading textAlign={"right"}>TIMES UP!!!!</Heading>;
  } else {
    return (
      <Heading textAlign={"right"}>
        {timeTotalHours} : {displayMinutes} : {displaySeconds}
      </Heading>
=======
  if (timeTotalSeconds === 0) {
    return <Heading>TIMES UP!!!!</Heading>;
  } else {
    return (
      <Fragment>
        <Heading>
          {timeTotalHours} : {displayMinutes} : {displaySeconds}
        </Heading>

        <div>
          <div className="progressbar">
            <motion.div
              className="bar"
              animate={{
                width: "0%",
              }}
              transition={{ duration: timeTotalSeconds }}
            />
          </div>
        </div>
      </Fragment>
>>>>>>> main
    );
  }
};

export default CountDownApp;

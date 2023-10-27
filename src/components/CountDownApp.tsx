import { Fragment, useEffect, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Heading } from "@chakra-ui/react";

import React, { Component } from "react";

import { motion } from "framer-motion";

import "./progressbar.css";
import { currentUser } from "../pages/LoginForm";
import patchData from "../hooks/patchData";
import { currentExam } from "./StartExamButton";

const stamp = Date.now();

const timeTakeaway = stamp - currentExam.time_started;

const initialTotalTimeMS = 3600000; //2 Hours

export const CountDownApp = () => {
  const [hasStarted, setHasStarted] = useState(currentExam.has_started);

  useEffect(() => {
    // Update hasStarted state whenever currentExam.has_started changes
    setHasStarted(currentExam.has_started);
  }, [currentExam.has_started]);

  const timeMS = hasStarted
    ? useCountdown(initialTotalTimeMS, () => console.log("Times up!!"))
    : initialTotalTimeMS;

  let timeTotalSeconds = timeMS / 1000;
  let timeTotalMinutes = Math.floor(timeTotalSeconds / 60);
  let timeTotalHours = Math.floor(timeTotalMinutes / 60);

  let displayMinutes = timeTotalMinutes % 60;
  let displaySeconds = timeTotalSeconds % 60;

  if (timeTotalSeconds === 0) {
    if (currentUser.userType === "student") {
      patchData({ terminated: true }, "update_terminate", currentUser.id);
    }
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

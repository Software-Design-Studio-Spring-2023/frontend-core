import { Fragment, useEffect, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Heading } from "@chakra-ui/react";

import React, { Component } from "react";

import { motion } from "framer-motion";

import "./progressbar.css";
import { currentUser } from "../pages/LoginForm";
import patchData from "../hooks/patchData";
import { currentExam } from "./StartExamButton";

const initialTotalTimeMS = 3600000; //1 Hour

export const CountDownApp = () => {
  const [hasStarted, setHasStarted] = useState(false);
  currentExam.has_started && setHasStarted(true);
  const [timeTakeaway, setTimeTakeaway] = useState<number | null>(null);
  const [startingTimeMS, setStartingTimeMS] = useState<number | null>(null);

  useEffect(() => {
    if (hasStarted && timeTakeaway === null) {
      const calculatedTimeTakeaway = Date.now() - currentExam.time_started;
      setTimeTakeaway(calculatedTimeTakeaway);
      setStartingTimeMS(initialTotalTimeMS - calculatedTimeTakeaway);
    }
  }, [hasStarted]);

  const timeMS = useCountdown(startingTimeMS, () => console.log("Times up!!"));

  let timeTotalSeconds = timeMS / 1000;
  let timeTotalMinutes = Math.floor(timeTotalSeconds / 60);
  let timeTotalHours = Math.floor(timeTotalMinutes / 60);

  let displayMinutes = timeTotalMinutes % 60;
  let displaySeconds = timeTotalSeconds % 60;

  const progressBarWidthPercentage = (timeMS / initialTotalTimeMS) * 100;

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
              animate={{ width: `${progressBarWidthPercentage}%` }}
              transition={{ duration: timeTotalSeconds }}
            />
          </div>
        </div>
      </Fragment>
    );
  }
};

export default CountDownApp;

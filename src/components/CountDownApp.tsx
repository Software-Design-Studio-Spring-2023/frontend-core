import { Fragment, useEffect, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Heading, Box, HStack } from "@chakra-ui/react";

import React, { Component } from "react";

import { motion } from "framer-motion";

import "./progressbar.css";
import { currentUser } from "../pages/LoginForm";
import patchData from "../hooks/patchData";
import { currentExam } from "./StartExamButton";

const initialTotalTimeMS = 3600000; //1 Hour

export const CountDownApp = () => {
  const [timeTakeaway, setTimeTakeaway] = useState(null);
  const [startingTimeMS, setStartingTimeMS] = useState(null);

  useEffect(() => {
    if (currentExam.has_started === true && timeTakeaway === null) {
      const calculatedTimeTakeaway = Date.now() - currentExam.time_started;
      console.log(calculatedTimeTakeaway);
      setTimeTakeaway(calculatedTimeTakeaway);
      const total = initialTotalTimeMS - calculatedTimeTakeaway;
      console.log(total);

      setStartingTimeMS(total);
    }
  }, [currentExam.has_started]);

  const shouldStart = startingTimeMS !== null && startingTimeMS !== 0;
  const timeMS = useCountdown(
    startingTimeMS,
    () => console.log("Times up!!"),
    1000,
    shouldStart
  );

  if (!startingTimeMS) {
    return null;
  }
  let timeTotalSeconds = timeMS / 1000;
  let timeTotalMinutes = Math.floor(timeTotalSeconds / 60);
  let timeTotalHours = Math.floor(timeTotalMinutes / 60);

  let displayMinutes = timeTotalMinutes % 60;
  let displaySeconds = Math.round(timeTotalSeconds % 60);

  let displaySecondsFormatted =
    displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds;

  const progressBarWidthPercentage = (timeMS / initialTotalTimeMS) * 100;

  if (timeTotalSeconds === 0) {
    if (currentUser.userType === "student") {
      patchData({ terminated: true }, "update_terminate", currentUser.id);
    }
    return <Heading marginRight={5}>TIMES UP!</Heading>;
  } else {
    return (
      <HStack marginRight={5}>
        <Fragment>
          <Heading>
            {timeTotalHours} : {displayMinutes} : {displaySecondsFormatted}
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
      </HStack>
    );
  }
};

export default CountDownApp;

import { StyleSheet, Text, View } from "react-native";
import React, { Component } from "react";
import { Heading } from "@chakra-ui/react";
import { useState } from "react";

import CountDownApp from "./CountDownApp";
import StartExamButton from "./StartExamButton";

function BackgroundTimerTracker() {
  const [timerActive, setActiveStatus] = useState(false);

  const handleToggle = () => {
    setActiveStatus((current) => true);
  };

  if (this.timerActive) {
    return <Heading>Exam Active</Heading>;
  } else {
    return <Heading>Exam Inactive</Heading>;
  }
}

export default BackgroundTimerTracker;
function setActiveStatus(arg0: (current: any) => boolean) {
  throw new Error("Function not implemented.");
}

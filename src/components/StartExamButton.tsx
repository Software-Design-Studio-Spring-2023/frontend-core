import { Component, useState } from "react";
import { Button, Heading, Box } from "@chakra-ui/react";
import CountDownApp from "./CountDownApp";
import patchData from "../hooks/patchData";

const StartExamButton = () => {
  const [started, setStarted] = useState(false);
  const handleStartExam = () => {
    setStarted(true);

    patchData({ has_started: true }, "update_exam", 112);
  };

  return (
    <>
      <Box hidden={started ? false : true}>
        <CountDownApp></CountDownApp>
      </Box>
      <Button
        colorScheme={"red"}
        hidden={started ? true : false}
        onClick={handleStartExam}
      >
        Start Exam
      </Button>
    </>
  );
};

export default StartExamButton;

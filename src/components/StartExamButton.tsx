import { Component, useEffect, useState } from "react";
import { Button, Heading, Box } from "@chakra-ui/react";
import CountDownApp from "./CountDownApp";
import patchData from "../hooks/patchData";
import useExams, { Exam } from "../hooks/useExams";

export var currentExam: Exam | undefined = {
  id: 0,
  examName: "",
  has_started: false,
  time_started: 0,
};

const StartExamButton = () => {
  const { data, loading, error } = useExams();
  const [started, setStarted] = useState(false);
  // const currentExam = data.find((obj) => obj.id === 112);

  useEffect(() => {
    const currentExam = data && data.find((obj) => obj.id === 112);
    if (currentExam && currentExam.has_started) {
      setStarted(true);
    }
  }, [data]);

  const handleStartExam = () => {
    setStarted(true);
    console.log(currentExam);
    const startTime = Date.now();
    patchData({ time_started: startTime }, "update_started", 112);
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

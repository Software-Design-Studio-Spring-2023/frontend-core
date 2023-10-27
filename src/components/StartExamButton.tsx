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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const examFromData = data && data.find((obj) => obj.id === 112);
    if (examFromData) {
      currentExam = examFromData;
      setLoaded(true);
      if (examFromData.has_started) {
        setStarted(true);
      }
    }
  }, [data]);
  //exam is definitely set

  const handleStartExam = () => {
    setStarted(true);
    currentExam.has_started = started;
    const startTime = Date.now();
    currentExam.time_started = startTime;
    patchData({ time_started: startTime }, "update_started", 112);
    patchData({ has_started: true }, "update_exam", 112);
    console.log(currentExam);
  };

  return (
    <>
      <Box hidden={started ? false : true}>
        <CountDownApp></CountDownApp>
      </Box>
      <Button
        colorScheme={"red"}
        isDisabled={loaded ? false : true}
        hidden={started ? true : false}
        onClick={handleStartExam}
      >
        Start Exam
      </Button>
    </>
  );
};

export default StartExamButton;

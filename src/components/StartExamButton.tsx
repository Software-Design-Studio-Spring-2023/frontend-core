import { Component, useEffect, useState } from "react";
import { Button, Heading, Box } from "@chakra-ui/react";
import CountDownApp from "./CountDownApp";
import patchData from "../hooks/patchData";
import useExams, { Exam } from "../hooks/useExams";
import { currentUser } from "../pages/LoginForm";

export var examBool = {
  has_started: false,
};

const StartExamButton = () => {
  const { data, loading, error } = useExams();
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const examFromData = data && data.find((obj) => obj.id === 112);
    if (examFromData) {
      setLoaded(true);
      if (examFromData.has_started) {
        setStarted(true);
      }
    }
  }, [data]);
  //exam is definitely set

  const handleStartExam = () => {
    setStarted(true);

    const startTime = Date.now();

    patchData({ time_started: startTime }, "update_started", 112);
    patchData({ has_started: true }, "update_exam", 112);
    // console.log(currentExam);
  };

  if (started === true) {
    examBool.has_started = true;
  }

  return (
    <>
      <Box hidden={started ? false : true}>
        <CountDownApp></CountDownApp>
      </Box>

      <Box hidden={currentUser.userType === "student" ? true : false}>
        <Button
          colorScheme={"red"}
          isDisabled={loaded ? false : true}
          hidden={started ? true : false}
          onClick={handleStartExam}
        >
          Start Exam
        </Button>
      </Box>
    </>
  );
};

export default StartExamButton;

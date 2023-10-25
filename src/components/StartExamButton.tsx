import { Component } from "react";
import { Button, Heading } from "@chakra-ui/react";
import CountDownApp from "./CountDownApp";
import patchData from "../hooks/patchData";
import { ReactDOM } from "react";
import BackgroundTimerTracker from "./BackgroundTimerTracker";

/* import currentExam from "../hooks/useCurrentExams";
import { currentUser } from "../pages/LoginForm"; */

import a from "./instanceOfTimer";
import setCurrentExam from "../hooks/useCurrentExams";

class StartExamButton extends Component {
  appearance = "a";
  examStatus = false;
  idNumber = 111;
  currentExam = setCurrentExam();

  handleStartExam = (idNumber: number) => {
    console.log(this.examStatus);
    this.appearance = "hidden";
    this.examStatus = true;
    patchData({ has_started: true }, "update_exam", idNumber);
    console.log(this.currentExam.id);
  };

  render() {
    if (this.examStatus == true) {
      return (
        <>
          <CountDownApp></CountDownApp>
          <Button
            colorScheme={"red"}
            visibility={this.appearance}
            onClick={this.handleStartExam(this.idNumber)}
          >
            Start Exam
          </Button>
        </>
      );
    } else {
      return (
        <Button
          colorScheme={"red"}
          visibility={this.appearance}
          onClick={this.handleStartExam}
        >
          Start Exam
        </Button>
      );
    }
  }
}

export default StartExamButton;

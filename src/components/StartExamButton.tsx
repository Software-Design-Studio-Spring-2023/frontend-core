import React, { Component } from "react";
import { Button } from "@chakra-ui/react";
import CountDownApp from "./CountDownApp";

class StartExamButton extends Component {
  appearance = "a";
  examStatus = false;

  handleStartExam = () => {
    console.log(this.examStatus);
    this.appearance = "hidden";
    this.examStatus = true;
  };

  render() {
    if (this.examStatus == true) {
      return (
        <>
          <CountDownApp></CountDownApp>
          <Button
            colorScheme={"red"}
            visibility={this.appearance}
            onClick={this.handleStartExam}
          >
            Startfr
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

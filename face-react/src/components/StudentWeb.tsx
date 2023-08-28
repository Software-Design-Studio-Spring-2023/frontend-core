import React from "react";

import Webcam from "react-webcam";

import { useNavigate } from "react-router-dom";

import { currentUser } from "./LoginForm";

const detected: boolean = true;

const StudentWeb = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <label>
          <Webcam />
          {currentUser.email}
        </label>
      </div>
      <div>
        <p>This is where the checklist will be</p>
      </div>
      <div>
        <button onClick={() => navigate("/studentexam")}>Start Exam</button>
      </div>
    </>
  );
};

export default StudentWeb;

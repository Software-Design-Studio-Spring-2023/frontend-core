import React, { useEffect } from "react";

import Webcam from "react-webcam";

import { useNavigate } from "react-router-dom";

import { currentUser } from "./LoginForm";

const detected: boolean = true;
let name = "";

const StudentWeb = () => {
  return (
    <>
      <div>
        <label>
          <Webcam />
          {name}
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

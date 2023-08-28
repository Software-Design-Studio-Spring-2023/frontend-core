import React, { useEffect } from "react";

import Webcam from "react-webcam";

import { useNavigate } from "react-router-dom";

import { currentUser } from "./LoginForm";

let name = "";

let warnings: number;

const StudentExam = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/");
  // }, []);

  if (currentUser !== undefined) {
    name = currentUser.firstName;
    warnings = currentUser.warnings;
  }

  return (
    <div>
      <div>
        <label>
          <Webcam />
          {name}
        </label>
      </div>
      <div>
        <p>Warnings: {warnings}</p>
      </div>
      <div>
        <button onClick={() => alert("are you sure?")}>Finish Exam</button>
      </div>
    </div>
  );
};

export default StudentExam;

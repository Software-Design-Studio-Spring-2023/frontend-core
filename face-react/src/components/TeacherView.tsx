import React, { useState } from "react";

import Webcam from "react-webcam";

import { useNavigate } from "react-router-dom";

import { currentUser } from "./LoginForm";

// if (currentUser) {
//   warnings = currentUser.warnings;
// }

let warnings: number;

if (currentUser !== undefined) {
  warnings = currentUser.warnings;
}

const TeacherView = () => {
  const navigate = useNavigate();

  const [warning, setWarning] = useState(warnings);

  let safe = true;

  if (warning === 2) {
    safe = false;
  }

  return (
    <>
      <div>
        <label>
          <Webcam />
        </label>
      </div>
      <div>
        <p>Warnings: {warning}</p>
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (warning <= 1) setWarning(warning + 1);
            if (currentUser !== undefined) {
              currentUser.warnings = warning;
            }
          }}
        >
          Issue Warning
        </button>
      </div>
      <div>
        <button disabled={safe} onClick={() => alert("Are You sure?")}>
          Terminate Exam
        </button>
      </div>
    </>
  );
};

export default TeacherView;

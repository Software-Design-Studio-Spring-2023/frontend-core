import { useEffect, useState } from "react";

import Webcam from "react-webcam";

import { useNavigate } from "react-router-dom";

import { currentUser } from "./LoginForm";
import TerminateExam from "./alerts/TerminateExam";
import LogOut from "./alerts/LogOut";

// if (currentUser) {
//   warnings = currentUser.warnings;
// }

let warnings: number;

if (currentUser !== undefined) {
  warnings = currentUser.warnings;
}

const TeacherView = () => {
  const navigate = useNavigate();
  if (currentUser?.loggedIn === false) {
    useEffect(() => {
      navigate("/");
    }, []);
  } else if (currentUser?.userType === "student") {
    useEffect(() => {
      navigate("/*");
    }, []);
  }

  const [warning, setWarning] = useState(warnings);

  let safe = true;

  if (warning === 2) {
    safe = false;
  }

  return (
    <>
      <div>
        <LogOut handleLogout={() => navigate("/")} />

        <label>
          <Webcam />
          {/* {currentUser?.firstName} replace this with name of the viewed user */}
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
      <div hidden={safe}>
        <TerminateExam
          handleTerminate={() =>
            // add the logic here for stopping a webcam
            {
              if (currentUser !== undefined) {
                currentUser.loggedIn = false;
              }
            }
          }
        />
      </div>
    </>
  );
};

export default TeacherView;

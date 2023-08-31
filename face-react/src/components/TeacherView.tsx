import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import TerminateExam from "./alerts/TerminateExam";
import { User } from "../hooks/useUsers";
import { currentUser } from "./LoginForm";
import { useNavigate } from "react-router-dom";
import LogOut from "./alerts/LogOut";
// import { Button } from "@chakra-ui/react";

interface Props {
  user: User;
}

// if (currentUser) {
//   warnings = currentUser.warnings;
// }

let warnings: number;

const TeacherView = ({ user }: Props) => {
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

  if (user !== undefined) {
    warnings = user.warnings;
  }

  if (warning === 2) {
    safe = false;
  }

  return (
    <>
      <div>
        <div>
          <LogOut handleLogout={() => navigate("/")} />
        </div>
        <div>
          <button onClick={() => navigate("/teacher")}>Go Back</button>
        </div>

        <label>
          <Webcam />
          {user.firstName}
        </label>
      </div>
      <div>
        <p>Warnings: {warning}</p>
      </div>
      <div>
        <button
          onClick={(e) => {
            //this needs to be sent back to the database so the warnings reset clicking on a new user
            e.preventDefault();
            if (warning <= 1) setWarning(warning + 1);
            if (user !== undefined) {
              user.warnings = warning;
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
              if (user !== undefined) {
                user.loggedIn = false;
              }
            }
          }
        />
      </div>
    </>
  );
};

export default TeacherView;

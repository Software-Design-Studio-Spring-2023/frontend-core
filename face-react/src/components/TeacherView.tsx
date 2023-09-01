import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import TerminateExam from "./alerts/TerminateExam";
import { User } from "../hooks/useUsers";
import { currentUser } from "./LoginForm";
import { useNavigate } from "react-router-dom";
import LogOut from "./alerts/LogOut";
import IssueWarning from "./alerts/IssueWarning";
// import { Button } from "@chakra-ui/react";

interface Props {
  user: User;
}

// if (currentUser) {
//   warnings = currentUser.warnings;
// }

let warnings: number;

const TeacherView = ({ user }: Props) => {
  useEffect(() => {
    const handleBeforeUnloadEvent = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnloadEvent);

    return () => {
      // window.removeEventListener("popstate", handleBackButtonEvent);
      window.removeEventListener("beforeunload", handleBeforeUnloadEvent);
    };
  }, []);

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
        <label>
          <Webcam />
          {user.firstName}
        </label>
      </div>
      <div>
        <p>Warnings: {warning}</p>
      </div>
      <div hidden={warning === 2 ? true : false}>
        <IssueWarning
          handleWarning={() => {
            //this needs to be sent back to the database so the warnings reset clicking on a new user
            // this is the code for adding warning without database

            if (warning <= 1) setWarning(warning + 1);
            if (user !== undefined) {
              user.warnings = warning;
            }
          }}
        />
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

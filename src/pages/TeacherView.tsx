//when a teacher clicks on a student from the grid, they are directed to this page

import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import TerminateExam from "../components/alerts/TerminateExam";
import { User } from "../hooks/useUsers";
import { currentUser } from "./LoginForm";
import { useNavigate } from "react-router-dom";
// import LogOut from "./alerts/LogOut";
import IssueWarning from "../components/alerts/IssueWarning";
import { Box, Heading, VStack } from "@chakra-ui/react";
import patchData from "../hooks/patchData";
import preventLoad from "../hooks/preventLoad";
import preventAccess from "../hooks/preventAccess";

interface Props {
  user: User;
}

let warnings: number;

const TeacherView = ({ user }: Props) => {
  preventAccess("student");
  preventLoad(false, true);

  const navigate = useNavigate();

  useEffect(() => {
    if (user !== undefined) {
      setWarning(user.warnings);
    }
  }, [user]);

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
      <Box position="absolute" top="0" left="50%" transform="translateX(-50%)">
        <Heading padding={"10px"}>{`Warnings: ${user.warnings}`}</Heading>
      </Box>
      <VStack justifyContent="center" alignItems="center" spacing={2.5}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Webcam height={"90%"} width={"90%"} />
        </div>
        <div hidden={warning === 2 ? true : false}>
          <IssueWarning
            user={user}
            handleWarning={() => {
              patchData({ warnings: warning + 1 }, "update_warnings", user.id);
              setWarning(warnings + 1);
              if (user !== undefined) {
                user.warnings = warning;
              }
            }}
          />
        </div>
        <div hidden={safe}>
          <TerminateExam
            user={user}
            handleTerminate={() =>
              // add the logic here for stopping a webcam
              {
                patchData({ terminated: true }, "update_terminate", user.id);
                if (user !== undefined) {
                  user.terminated = true;
                }
                navigate("/teacher");
              }
            }
          />
        </div>
      </VStack>
    </>
  );
};

export default TeacherView;

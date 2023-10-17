import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Box,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { currentUser } from "../../pages/LoginForm";

const LoginSuccess = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 3000; // 3 seconds in total
    const startTime = Date.now();

    function updateProgress() {
      const elapsed = Date.now() - startTime;

      if (elapsed >= totalDuration) {
        setProgress(0);
        setShowAlert(false);
      } else {
        setProgress(totalDuration - elapsed);
        requestAnimationFrame(updateProgress);
      }
    }

    requestAnimationFrame(updateProgress);

    return () => {}; // No cleanup required for RAF in this instance.
  }, []);

  return (
    <>
      {showAlert && currentUser.userType === "student" && (
        <Box
          width={"50%"}
          position="relative"
          margin="auto"
          display="block"
          marginBottom={"10px"}
        >
          <Alert display={"flex"} width={"100%"} status="success">
            <AlertIcon />
            <AlertTitle mr={2}>Login Successful</AlertTitle>
            <AlertDescription flex="1">
              Welcome {currentUser.name}! Good Luck On Your Exam!
            </AlertDescription>
          </Alert>
          <Progress
            size="xs"
            value={(progress / 3000) * 100} // Adjust the denominator to your total duration
            position="absolute"
            width="100%"
            bottom="0"
            colorScheme="green"
          />
        </Box>
      )}

      {showAlert && currentUser.userType === "staff" && (
        <Box
          width={"50%"}
          position="relative"
          margin="auto"
          display="block"
          marginBottom={"10px"}
        >
          <Alert display={"flex"} width={"100%"} status="success">
            <AlertIcon />
            <AlertTitle mr={2}>Login Successful</AlertTitle>
            <AlertDescription flex="1">
              Welcome {currentUser.name}! Happy Supervising!
            </AlertDescription>
          </Alert>
          <Progress
            size="xs"
            value={(progress / 3000) * 100} // Adjust the denominator to your total duration
            position="absolute"
            width="100%"
            bottom="0"
            colorScheme="green"
          />
        </Box>
      )}
    </>
  );
};

export default LoginSuccess;

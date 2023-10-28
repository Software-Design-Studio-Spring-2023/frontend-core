import React, { useEffect, useState } from "react";
import { currentUser } from "../../pages/LoginForm";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Box,
} from "@chakra-ui/react";

const ExamStarted = () => {
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

    return () => {};
  }, []);

  return (
    <>
      {showAlert && (
        <Box
          width={"50%"}
          position="relative"
          margin="auto"
          display="block"
          marginBottom={"10px"}
        >
          <Alert display={"flex"} width={"100%"} status="success">
            <AlertIcon />
            <AlertTitle mr={2}>Exam Started</AlertTitle>
            <AlertDescription flex="1">
              Good Luck On Your Exam, {currentUser.name}!
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

export default ExamStarted;

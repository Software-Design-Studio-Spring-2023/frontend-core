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

const TimeDeduction = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 10; // update every 50ms
    const totalDuration = 3000; // 3 seconds in total

    // Initialize the progress state to totalDuration
    setProgress(totalDuration);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextValue = prev - interval;
        if (nextValue <= 0) {
          clearInterval(timer);
          setShowAlert(false);
          return 0;
        }
        return nextValue;
      });
    }, interval);

    return () => clearInterval(timer);
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
          <AlertTitle mr={2}>Your exam has started.</AlertTitle>
          <AlertDescription flex="1">
            You are now deducting form your available exam time. Ensure you meet all the requirements and your exam will immediately commence.
          </AlertDescription>
        </Alert>
        <Progress
          size="xs"
          value={(progress / 3000) * 100} // Adjust the denominator to your total duration
          position="absolute"
          width="100%"
          bottom="0"
          colorScheme="green"
          isIndeterminate
        />
      </Box>
    )}
    </>
  );
};

export default TimeDeduction;

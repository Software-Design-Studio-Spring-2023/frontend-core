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

const CameraTip = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 5000; // 5 seconds in total
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
            <Alert display={"flex"} width={"100%"} status="info">
              <AlertIcon />
              <AlertDescription flex="1">
                Ensure you are in a well-lit, quiet and private room.”
              </AlertDescription>
            </Alert>
            <Progress
              size="xs"
              value={(progress / 5000) * 100} // Adjust the denominator to your total duration
              position="absolute"
              width="100%"
              bottom="0"
              colorScheme="blue"
            />
          </Box>
        )}
    </>
  );
};

export default CameraTip;

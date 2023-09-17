import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Box,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";

const LoginFailed = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 10; // update every 10ms for the loading bar smooth animation
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
          height={"300px"} // Fixing the height so that the space is always reserved
          position="relative"
          margin="auto"
          display="block"
          marginBottom={"10px"}
        >
          <Alert
            display={"flex"}
            width={"100%"}
            status="error"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon />
            <AlertTitle mr={2}>Login Failed</AlertTitle>
            <AlertDescription flex="1">
              Invalid email or password.
              <br />
              Contact the University for assistance if the problem persists.
            </AlertDescription>
          </Alert>
          <Progress
            size="xs"
            value={(progress / 3000) * 100} // Adjust denominator to total duration
            position="relative"
            width="100%"
            bottom="0"
            colorScheme="red"
          />
        </Box>
      )}
    </>
  );
};

export default LoginFailed;

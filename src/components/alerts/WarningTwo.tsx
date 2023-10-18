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
import { User } from "../../hooks/useUsers";

interface Props {
  user: User;
}

const WarningTwo = ({ user }: Props) => {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sound = new Audio("/sounds/warning.mp3");
    sound.play(); // alert sounds
    const totalDuration = 3000; // 3 seconds in total for the progress bar
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
            <AlertTitle mr={2}>Final Warning</AlertTitle>
            <AlertDescription flex="1">
              You have been warned for:
              <br />
              {user.warningTwo}
              <br />
              This is your last chance to complete your exam and avoid exam
              termination.
            </AlertDescription>
          </Alert>
          <Progress
            size="xs"
            value={(progress / 3000) * 100}
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

export default WarningTwo;

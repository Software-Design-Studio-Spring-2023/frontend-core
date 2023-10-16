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

const WarningOne = ({ user }: Props) => {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sound = new Audio("/sounds/warning.mp3"); // Path to your sound file
    sound.play(); // Play the sound

    const interval = 10; // update every 10ms
    const totalDuration = 3000; // 5 seconds in total

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
          // height={"300px"} // Fixing the height so that the space is always reserved
          position="relative"
          margin="auto"
          display="block"
          marginBottom={"10px"}
        >
          <Alert
            display={"flex"}
            width={"100%"}
            status="warning"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon />
            <AlertTitle mr={2}>Warning</AlertTitle>
            <AlertDescription flex="1">
              You have been warned for:
              <br />
              {user.warningOne}
              <br />
              You may be terminated from your exam.
            </AlertDescription>
          </Alert>
          <Progress
            size="xs"
            value={(progress / 3000) * 100} // Adjust the denominator to your total duration
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

export default WarningOne;

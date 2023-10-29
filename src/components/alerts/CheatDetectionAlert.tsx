import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Progress,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { User } from "../../hooks/useUsers";
import patchData from "../../hooks/patchData";

interface Props {
  handleCheatDetectedWarning: () => void;
  user: User;
}

const CheatDetectionAlert = ({ handleCheatDetectedWarning, user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleNoClick = () => {
    // Execute your additional logic here
    console.log("No button was clicked");
    patchData({ isSuspicious: false }, "update_isSuspicious", user.id);
    // Close the alert dialog
    onClose();
  };

  useEffect(() => {
    patchData({ isSuspicious: false }, "update_isSuspicious", user.id);
  }, []); //patch suspicious right away to prevent spam

  useEffect(() => {
    onOpen();
    const interval = 10; // update every 10ms
    const totalDuration = 5000; // 5 seconds in total

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
        <AlertDialog
          motionPreset="scale"
          size={/Android|iPhone/i.test(navigator.userAgent) ? "xs" : "lg"}
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Misconduct Suspected!
              </AlertDialogHeader>
              <AlertDialogBody>
                {`Misconduct suspected from student: ${user.name}`}
                <br />
                {"View students camera?"}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={handleNoClick}>
                  No
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    handleCheatDetectedWarning();
                    handleNoClick();
                  }} //opens teacher view for student on click and patches false after action handled
                  ml={3}
                >
                  Yes
                </Button>
              </AlertDialogFooter>
              <Progress
                size="xs"
                value={(progress / 5000) * 100} // Adjust the denominator to your total duration
                position="relative"
                width="100%"
                bottom="0"
                colorScheme="red"
              />
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};

export default CheatDetectionAlert;

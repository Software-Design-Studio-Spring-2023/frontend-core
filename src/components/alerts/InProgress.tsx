// cant use this until exam database is up
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

const EndExam = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        motionPreset="scale"
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>

            <AlertDialogBody>
              Exam is already in progress. Please contact your university for
              support.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Okay
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default EndExam;

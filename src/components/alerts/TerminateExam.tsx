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

interface Props {
  handleTerminate: () => void;
}

const EndExam = ({ handleTerminate }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleConfirmTerminate = () => {
    handleTerminate();
    onClose();
  };

  return (
    <>
      <button onClick={onOpen}>Terminate Exam</button>
      <AlertDialog
        motionPreset="scale"
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Terminate Exam
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to terminate this student's exam?
              {/* We can include the actual persons name here when we set up the database */}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleConfirmTerminate} ml={3}>
                {/* termination is logically the same as end exam */}
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default EndExam;

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
      <button onClick={onOpen}>Finish Exam</button>
      <AlertDialog
        motionPreset="scale"
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              End Exam
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't join this exam session again and your
              results will be submitted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleConfirmTerminate} ml={3}>
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

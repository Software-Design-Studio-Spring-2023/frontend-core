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
import { User } from "../../hooks/useUsers";

interface Props {
  handleTerminate: () => void;
  user: User;
}

const TerminateExam = ({ handleTerminate, user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleConfirmTerminate = () => {
    handleTerminate();
    onClose();
  };

  return (
    <>
      <Button
        color="#FFF5F5"
        bgColor={"red.500"}
        variant="outline"
        borderColor={"red.100"}
        onClick={onOpen}
      >
        Terminate Exam
      </Button>
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
              Are you sure you want to terminate this {user.name}'s exam?
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

export default TerminateExam;

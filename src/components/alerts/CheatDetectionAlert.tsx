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
} from "@chakra-ui/react";
import { useRef } from "react";
import { User } from "../../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import patchData from "../../hooks/patchData";

interface Props {
  handleCheatDetectedWarning: () => void;
  user: User;
}

const CheatDetectionAlert = ({ handleCheatDetectedWarning, user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  return (
    <>
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

              {"\nView students camera?"}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCheatDetectedWarning} //opens teacher view for student on click
                ml={3}
              >
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CheatDetectionAlert;

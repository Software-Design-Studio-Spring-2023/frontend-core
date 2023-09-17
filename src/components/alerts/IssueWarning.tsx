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
  handleWarning: () => void;
  user: User;
}

const IssueWarning = ({ handleWarning, user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleConfirmWarning = () => {
    handleWarning();
    onClose();
  };

  return (
    <>
      <Button
        color="#FFF5F5"
        bgColor={"red.500"}
        variant="solid"
        onClick={onOpen}
      >
        Issue Warning
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
              Issue Warning
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to issue a warning to {user.name}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleConfirmWarning} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default IssueWarning;

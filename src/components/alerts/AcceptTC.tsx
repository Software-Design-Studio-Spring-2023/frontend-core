import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
  handleCancel: () => void;
}

const AcceptTC = ({ handleCancel }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleConfirmTerminate = () => {
    handleCancel();
    onClose();
  };

  return (
    <>
      <button onClick={onOpen}>
        <Text as='u'>Cancel</Text>
        </button>
      <AlertDialog
        motionPreset="scale"
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Are you sure?
            </AlertDialogHeader>

            <AlertDialogBody>
              You will be not permitted to start your exam without your consent.
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

export default AcceptTC;

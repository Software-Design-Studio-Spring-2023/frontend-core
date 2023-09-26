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
import { currentUser } from "../../pages/LoginForm";
import patchData from "../../hooks/patchData";

interface Props {
  handleLogout: () => void;
}

const LogOut = ({ handleLogout }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleConfirmLogout = () => {
    handleLogout();
    onClose();
    patchData({ loggedIn: false }, "update_login", currentUser.id);
  };

  return (
    <>
      <Button
        colorScheme="teal"
        variant="solid"
        onClick={onOpen}
        size={/Android|iPhone/i.test(navigator.userAgent) ? "sm" : ""}
      >
        Log Out
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
              Log Out
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleConfirmLogout} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default LogOut;

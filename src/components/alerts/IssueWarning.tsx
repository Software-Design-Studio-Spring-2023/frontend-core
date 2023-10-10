import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Input,
  Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { User } from "../../hooks/useUsers";
import patchData from "../../hooks/patchData";

interface Props {
  handleWarning: () => void;
  user: User;
}

const IssueWarning = ({ handleWarning, user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

  const handleConfirmWarning = () => {
    const warningReason =
      selectedReason === "other" ? otherReason : selectedReason;
    user.warnings === 0 &&
      patchData({ warningOne: warningReason }, "update_warning_one", user.id);
    user.warnings === 1 &&
      patchData({ warningTwo: warningReason }, "update_warning_two", user.id);
    handleWarning();
    setSelectedReason("");
    setOtherReason("");
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
        onClose={() => {
          setSelectedReason("");
          setOtherReason("");
          onClose();
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Issue Warning
            </AlertDialogHeader>

            <AlertDialogBody paddingTop={"-2"} fontWeight="bold">
              Warning reason for {user.name}:
            </AlertDialogBody>

            <Box paddingLeft={"6"} paddingRight={"6"} paddingTop={"2"}>
              <RadioGroup
                colorScheme={"teal"}
                value={selectedReason}
                onChange={setSelectedReason}
              >
                <Stack spacing={4}>
                  <Radio value="Unidentified user">Unidentified user</Radio>
                  <Radio value="Another person present">
                    Another person present
                  </Radio>
                  <Radio value="Phone detected">Phone detected</Radio>
                  <Radio value="other">Other:</Radio>
                  {selectedReason === "other" && (
                    <Input
                      placeholder="Please specify"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                    />
                  )}
                </Stack>
              </RadioGroup>
            </Box>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmWarning}
                ml={3}
                isDisabled={
                  !selectedReason ||
                  (selectedReason === "other" && !otherReason)
                }
              >
                Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default IssueWarning;

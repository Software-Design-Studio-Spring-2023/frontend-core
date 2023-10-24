import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Box,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { User } from "../../hooks/useUsers";
import warningCountdown from "../../hooks/warningCountdown";

interface Props {
  user: User;
}

const WarningTwo = ({ user }: Props) => {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  warningCountdown(setProgress, setShowAlert);

  return (
    <>
      {showAlert && (
        <Box
          width={"50%"}
          position="relative"
          margin="auto"
          display="block"
          marginBottom={"10px"}
        >
          <Alert
            display={"flex"}
            width={"100%"}
            status="error"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon />
            <AlertTitle mr={2}>Final Warning</AlertTitle>
            <AlertDescription flex="1">
              You have been warned for:
              <br />
              {user.warningTwo}
              <br />
              This is your last chance to complete your exam and avoid exam
              termination.
            </AlertDescription>
          </Alert>
          <Progress
            size="xs"
            value={(progress / 3000) * 100}
            position="relative"
            width="100%"
            bottom="0"
            colorScheme="red"
          />
        </Box>
      )}
    </>
  );
};

export default WarningTwo;

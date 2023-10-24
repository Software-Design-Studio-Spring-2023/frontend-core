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

const WarningOne = ({ user }: Props) => {
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
            status="warning"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon />
            <AlertTitle mr={2}>Warning</AlertTitle>
            <AlertDescription flex="1">
              You have been warned for:
              <br />
              {user.warningOne}
              <br />
              You may be terminated from your exam.
            </AlertDescription>
          </Alert>
          <Progress
            size="xs"
            value={(progress / 3000) * 100} // Adjust the denominator to make alert longer
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

export default WarningOne;

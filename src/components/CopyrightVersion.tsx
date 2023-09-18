import { Box, Text } from "@chakra-ui/react";

const CopyrightVersion = () => {
  return (
    <>
      <Box
        position="absolute"
        bottom="2"
        width="100%"
        zIndex="1000"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text>© 2023 Copyright eyedentify</Text>
      </Box>
      <Box
        position="absolute"
        bottom="2"
        right="6"
        zIndex="1000"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Text>Version X.X Alpha</Text>
      </Box>
    </>
  );
};

export default CopyrightVersion;

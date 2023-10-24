import { Box, Text } from "@chakra-ui/react";
import { version } from "../../package.json";
interface Props {
  bottomVal: number;
}

const CopyrightVersion = ({ bottomVal }: Props) => {
  return (
    <>
      <Box
        position="fixed"
        bottom={bottomVal}
        width="100%"
        zIndex="1000"
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingTop={2.5}
        paddingBottom={2.5}
        backgroundColor={"#111"}
      >
        <Text>© 2023 Copyright eyedentify</Text>
        <Text
          hidden={/Android|iPhone/i.test(navigator.userAgent) ? true : false}
          position="fixed"
          bottom={bottomVal}
          right="6"
          zIndex="1000"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          paddingTop={2.5}
          paddingBottom={2.5}
        >
          Version {version}
        </Text>
      </Box>
    </>
  );
};

export default CopyrightVersion;

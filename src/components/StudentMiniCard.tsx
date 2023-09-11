import { Card, CardBody, Heading, VStack, Text, Box } from "@chakra-ui/react";
import React from "react";
import Webcam from "react-webcam";

interface Props {
  name: string;
  warnings: number;
}

const StudentMiniCard = ({ name, warnings }: Props) => {
  return (
    <>
      <Box
        // boxShadow={"dark-lg"}
        overflow={"hidden"}
        borderColor={warnings ? { 0: "green", 1: "yellow", 2: "red" } : "green"}
        borderWidth={"1px"}
        borderRadius={"lg"}
      >
        <Webcam />
        <Heading paddingTop={"2px"} paddingLeft={"2px"} fontSize="1xl">
          {name}
        </Heading>
        <Text paddingLeft={"2px"} paddingBottom={"2px"} fontSize={"x-small"}>
          Warnings: {warnings}
        </Text>
      </Box>
    </>
  );
};

export default StudentMiniCard;

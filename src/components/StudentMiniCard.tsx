import {
  Card,
  CardBody,
  Heading,
  VStack,
  Text,
  Box,
  border,
} from "@chakra-ui/react";
import React from "react";
import Webcam from "react-webcam";

interface Props {
  name: string;
  warnings: number;
}

const StudentMiniCard = ({ name, warnings }: Props) => {
  const borderColor = () => {
    switch (warnings) {
      case 0:
        return "green";
      case 1:
        return "#D69E2E";
      case 2:
        return "red";
      default:
        return "green"; // Default color in case warnings is undefined or out of range
    }
  };
  return (
    <>
      <Box
        overflow={"hidden"}
        borderColor={borderColor()}
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

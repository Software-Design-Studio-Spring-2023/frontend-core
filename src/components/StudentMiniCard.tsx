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
      <Box borderColor={"white"} border={"6px"}>
        <Webcam />
        <Heading paddingTop={"2px"} fontSize="1xl">
          {name}
        </Heading>
        <Text fontSize={"x-small"}>Warnings: {warnings}</Text>
      </Box>
    </>
  );
};

export default StudentMiniCard;

import { Card, CardBody, Heading, VStack, Text } from "@chakra-ui/react";
import React from "react";
import Webcam from "react-webcam";

interface Props {
  name: string;
  warnings: number;
}

const StudentCard = ({ name, warnings }: Props) => {
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
    <Card
      overflow={"hidden"}
      borderColor={borderColor()}
      borderWidth={"1px"}
      borderRadius={"10px"}
    >
      <Webcam />
      <CardBody>
        <VStack>
          <Heading marginTop={"-8px"}>{name}</Heading>
          <Text>Warnings: {warnings}</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default StudentCard;

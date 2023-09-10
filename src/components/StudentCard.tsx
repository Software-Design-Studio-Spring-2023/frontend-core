import { Card, CardBody, Heading, VStack, Text } from "@chakra-ui/react";
import React from "react";
import Webcam from "react-webcam";

interface Props {
  name: string;
  warnings: number;
}

const StudentCard = ({ name, warnings }: Props) => {
  return (
    <Card borderRadius={"10px"} overflow={"hidden"}>
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

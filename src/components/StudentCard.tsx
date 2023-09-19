//This is what will be rendered in the grid, and represents a student and their stream.
//We will need to replace the Webcam and make the card loading as a student is connecting.

import { Card, CardBody, Heading, VStack, Text } from "@chakra-ui/react";
import Webcam from "react-webcam";
import setBorder from "../hooks/setBorder";
import { useRef, useEffect } from "react";

interface Props {
  name: string;
  warnings: number;
  stream: MediaStream | null;
}

const StudentCard = ({ name, warnings, stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Card
      overflow={"hidden"}
      borderColor={setBorder(warnings)}
      borderWidth={"1px"}
      borderRadius={"10px"}
    >
      <video ref={videoRef} autoPlay={true} muted={true} />
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

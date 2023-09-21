//This is what will be rendered in the grid, and represents a student and their stream.
//We will need to replace the Webcam and make the card loading as a student is connecting.

import {
  Card,
  CardBody,
  Heading,
  VStack,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import Webcam from "react-webcam";
import setBorder from "../hooks/setBorder";
import { useRef, useEffect } from "react";

interface Props {
  name: string;
  warnings: number;
  stream: MediaStream | null;
  loading: boolean;
}

const StudentCard = ({ name, warnings, stream, loading }: Props) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.innerHTML = ""; // clear the inner HTML to ensure no other elements
      videoRef.current.appendChild(stream);
    }
  }, [stream]);

  return loading ? (
    <Card
      overflow={"hidden"}
      borderColor={"gray.200"}
      borderWidth={"1px"}
      borderRadius={"10px"}
    >
      <Skeleton height="auto" width="100%" />
      <CardBody>
        <VStack>
          <Skeleton height="20px" width="60%" />
          <Skeleton height="20px" width="40%" />
        </VStack>
      </CardBody>
    </Card>
  ) : (
    <Card
      overflow={"hidden"}
      borderColor={setBorder(warnings)}
      borderWidth={"1px"}
      borderRadius={"10px"}
    >
      <div ref={videoRef} style={{ width: "100%", height: "auto" }}></div>
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

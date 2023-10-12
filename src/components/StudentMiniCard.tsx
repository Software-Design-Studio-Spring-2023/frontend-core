//This is what will be rendered in the grid when viewing a student, and represents a student and their stream.
//We will need to replace the Webcam and make the card loading as a student is connecting.

import {
  Heading,
  Text,
  Box,
  Skeleton,
  VStack,
  HStack,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import Webcam from "react-webcam";
import setBorder from "../hooks/setBorder";
import { useRef, useEffect, useContext } from "react";
import { StreamsContext } from "../contexts/StreamContext";
import { TiTick, TiTimes } from "react-icons/ti";

interface Props {
  name: string;
  warnings: number;
  id: number;
  ready: boolean;
  loading: boolean;
  disconnected: boolean;
}

const StudentMiniCard = ({
  name,
  id,
  warnings,
  loading,
  ready,
  disconnected,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streams = useContext(StreamsContext);
  const stream = streams[id];

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return loading ? (
    <>
      <Box
        overflow={"hidden"}
        borderColor={"RGBA(0, 0, 0, 0.80)"}
        borderWidth={"1px"}
        borderRadius={"lg"}
      >
        <Skeleton height="80px" overflow="hidden" />

        <Skeleton
          marginTop={"2px"}
          marginLeft={"2px"}
          height="20px"
          width="60%"
        />
        <Skeleton
          marginLeft={"2px"}
          marginBottom={"2px"}
          height="15px"
          width="50%"
        />
      </Box>
    </>
  ) : (
    <>
      <Box
        overflow={"hidden"}
        borderColor={setBorder(warnings)}
        borderWidth={"1px"}
        borderRadius={"lg"}
      >
        <VStack spacing={0.5} align="start">
          {disconnected ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="80px" // Adjust the height to the desired spinner container size
              width="100%" // Optional: Adjust the width as needed
            >
              <Spinner thickness="3px" size={"md"} color="teal" />
            </Box>
          ) : (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{
                borderRadius: "2px",
                overflow: "hidden",
                width: "100%",
                height: "auto",
              }}
            ></video>
          )}
          <Heading paddingLeft={"2px"} fontSize="1xl">
            <HStack>
              <div>{name}</div>
              <Spacer />
              <Box marginTop={ready ? "0" : "0.5"} marginLeft={"-3"}>
                {ready ? <TiTick /> : <TiTimes />}
              </Box>
            </HStack>
          </Heading>
          <Text paddingLeft={"2px"} paddingBottom={"2px"} fontSize={"x-small"}>
            Warnings: {warnings}
          </Text>
        </VStack>
      </Box>
    </>
  );
};

export default StudentMiniCard;

//This is what will be rendered in the grid when viewing a student, and represents a student and their stream.
//We will need to replace the Webcam and make the card loading as a student is connecting.

import { Heading, Text, Box, Skeleton } from "@chakra-ui/react";
import Webcam from "react-webcam";
import setBorder from "../hooks/setBorder";
import { useRef, useEffect } from "react";

interface Props {
  name: string;
  warnings: number;
  stream: MediaStream | null;
  loading: boolean;
}

const StudentMiniCard = ({ name, warnings, stream, loading }: Props) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.innerHTML = ""; // clear the inner HTML to ensure no other elements
      videoRef.current.appendChild(stream);
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
        <div ref={videoRef} style={{ width: "200%", height: "auto" }}></div>
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

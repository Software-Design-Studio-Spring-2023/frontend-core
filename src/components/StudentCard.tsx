//This is what will be rendered in the grid, and represents a student and their stream.
//We will need to replace the Webcam and make the card loading as a student is connecting.

import {
  Card,
  CardBody,
  Heading,
  VStack,
  Text,
  Skeleton,
  HStack,
  Box,
  Spinner,
} from "@chakra-ui/react";
import Webcam from "react-webcam";
import setBorder from "../hooks/setBorder";
import { useRef, useEffect, useContext, useState } from "react";
import { StreamsContext } from "../contexts/StreamContext";
import { TiTick, TiTimes } from "react-icons/ti";
import * as faceapi from "face-api.js";

interface Props {
  name: string;
  warnings: number;
  id: number;
  ready: boolean;
  loading: boolean;
  disconnected: boolean;
}

const StudentCard = ({
  name,
  warnings,
  id,
  loading,
  ready,
  disconnected,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const streams = useContext(StreamsContext);
  const stream = streams[id];

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      hiddenVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      // ... load other models as needed
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const getFace = async () => {
      if (hiddenVideoRef.current && canvasRef.current && modelsLoaded) {
        const detections = await faceapi.detectAllFaces(
          hiddenVideoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // clear previous drawings

        // Set the canvas dimensions equal to the video element's
        canvasRef.current.width = hiddenVideoRef.current.videoWidth;
        canvasRef.current.height = hiddenVideoRef.current.videoHeight;

        if (detections && detections.length > 0) {
          // faceapi.draw.drawDetections(canvasRef.current, detections);
          console.log("Face Detected: ", detections[0].box);
          const { box } = detections[0]; // using the first detected face
          console.log("Box: ", box);

          ctx.drawImage(
            hiddenVideoRef.current, // source video element
            box.x,
            box.y,
            box.width,
            box.height, // source coordinates
            box.x,
            box.y,
            box.width,
            box.height // destination coordinates
          );
        }
      }
    };

    const faceInterval = setInterval(() => {
      getFace();
    }, 100); // adjust interval for performance/accuracy balance

    return () => clearInterval(faceInterval); // cleanup interval on component unmount
  }, [modelsLoaded, hiddenVideoRef, canvasRef]);

  return loading ? (
    <Card
      overflow={"hidden"}
      borderColor={"RGBA(0, 0, 0, 0.80)"}
      borderWidth={"1px"}
      borderRadius={"10px"}
    >
      <Skeleton height="200px" overflow="hidden" />
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
      <CardBody
        style={{
          display: "flex",
          flexDirection: "column", // ensure children are stacked vertically
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {disconnected ? (
          <Spinner thickness="4px" size={"xl"} color="teal" />
        ) : (
          <div style={{ position: "relative" }}>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{
                filter: "blur(10px)",
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
                height: "auto",
              }}
            ></video>
            <video
              ref={hiddenVideoRef}
              playsInline
              autoPlay
              muted
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1, // Ensure canvas is above the video
              }}
            ></video>
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: -30,
                left: -50,
                zIndex: 2, // Ensure canvas is above the video
              }}
            ></canvas>
          </div>
        )}
        <VStack>
          <Heading marginTop={"8px"}>
            <HStack>
              <div>{name}</div>
              <Box marginTop={ready ? "0" : "1.5"}>
                {ready ? <TiTick /> : <TiTimes />}
              </Box>
            </HStack>
          </Heading>
          <Text>Warnings: {warnings}</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default StudentCard;

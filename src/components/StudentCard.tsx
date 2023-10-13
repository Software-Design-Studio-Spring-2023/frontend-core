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
import { useRef, useEffect, useContext, useCallback } from "react";
import { StreamsContext } from "../contexts/StreamContext";
import { TiTick, TiTimes } from "react-icons/ti";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-core";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import "@mediapipe/selfie_segmentation";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streams = useContext(StreamsContext);
  const stream = streams[id];

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const applyBokehEffect = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const segmenter = await bodySegmentation.createSegmenter(
      bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
      {
        runtime: "mediapipe",
        solutionPath:
          "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
        modelType: "general",
      }
    );

    const foregroundThreshold = 0.5;
    const backgroundBlurAmount = 20;
    const edgeBlurAmount = 5;
    const flipHorizontal = false;

    const drawEffect = async () => {
      if (!video || video.readyState !== 4) return;

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.width = video.videoWidth;
        video.height = video.videoHeight;
      } else {
        console.error("Video dimensions not available");
      }

      const segmentation = await segmenter.segmentPeople(video);

      if (!segmentation) {
        console.error("Segmentation failed!");
        return;
      }

      if (canvas.width === 0 || canvas.height === 0) {
        console.error("Canvas dimensions are zero!");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas rendering context!");
        return;
      }

      await bodySegmentation.drawBokehEffect(
        canvas,
        video,
        segmentation,
        foregroundThreshold,
        backgroundBlurAmount,
        edgeBlurAmount,
        flipHorizontal
      );

      requestAnimationFrame(drawEffect);
    };

    drawEffect();
  }, [videoRef, canvasRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoPlay = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error("Video dimensions are zero!");
        return;
      }
      applyBokehEffect();
    };

    video.addEventListener("play", handleVideoPlay);

    return () => {
      // Cleanup event listener on component unmount.
      video.removeEventListener("play", handleVideoPlay);
    };
  }, [videoRef, applyBokehEffect]);

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
            <canvas
              ref={canvasRef}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
                height: "auto",
              }}
            ></canvas>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{
                borderRadius: "10px",
                position: "absolute",
                overflow: "hidden",
                width: "100%",
                height: "auto",
                visibility: "hidden",
              }}
            ></video>
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

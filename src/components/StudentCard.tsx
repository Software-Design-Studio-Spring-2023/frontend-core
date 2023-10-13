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

  useEffect(() => {
    tf.ready()
      .then(() => {
        console.log("TensorFlow.js is ready!");
        console.log("Using backend: ", tf.getBackend()); // Should log: "webgl" if WebGL is used
        // Here you can initiate anything that needs TensorFlow.js to be ready,
        // perhaps starting video processing, fetching models, etc.
      })
      .catch((err) => {
        console.error("Error initializing TensorFlow.js!", err);
      });
  }, []);

  const applyBokehEffect = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video) return;

    try {
      const segmenter = await bodySegmentation.createSegmenter(
        bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
        { runtime: "tfjs" }
      );

      // Ensure video is still available and loaded
      if (!video || video.readyState !== 4) return;

      const segmentation = await segmenter.segmentPeople(video);
      console.log(segmentation);

      const foregroundThreshold = 1;
      const backgroundBlurAmount = 20;
      const edgeBlurAmount = 5;
      const flipHorizontal = false;

      // const canvas = document.createElement("canvas");
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.width = video.videoWidth;
        video.height = video.videoHeight;
      } else {
        console.error("Video dimensions not available");
      }

      console.log(
        canvas.height,
        canvas.width,
        video.videoWidth,
        video.videoHeight,
        video.width,
        video.height
      );

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
    } catch (error) {
      console.error("Error applying bokeh effect:", error);
    }
  }, [videoRef, canvasRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadataLoaded = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error("Video dimensions are zero!");
        return;
      }
      // Now you should be able to access video.videoWidth and video.videoHeight.
      applyBokehEffect();
    };

    video.addEventListener("loadedmetadata", handleMetadataLoaded);

    return () => {
      // Cleanup event listener on component unmount.
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
    };
  }, [videoRef, canvasRef, applyBokehEffect]);

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
          <div>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
                height: "auto",
              }}
            ></video>
            <canvas
              ref={canvasRef}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
                height: "auto",
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

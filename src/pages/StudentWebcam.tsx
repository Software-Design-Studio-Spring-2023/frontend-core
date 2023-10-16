import { useCallback, useEffect, useRef, useState } from "react";
import { currentUser } from "./LoginForm";
import EndExam from "../components/alerts/EndExam";
import { Box, Button, HStack, Heading, Spacer, VStack } from "@chakra-ui/react";
import { HiEye } from "react-icons/hi";
import LoginSuccess from "../components/alerts/LoginSuccess";
import WarningOne from "../components/alerts/WarningOne";
import WarningTwo from "../components/alerts/WarningTwo";
import CopyrightVersion from "../components/CopyrightVersion";
import preventLoad from "../hooks/preventLoad";
import * as faceapi from "face-api.js";

import preventAccess from "../hooks/preventAccess";
import { useNavigate } from "react-router-dom";
import {
  LocalParticipant,
  LocalTrackPublication,
  Room,
  RoomEvent,
  createLocalVideoTrack,
} from "livekit-client";
import patchData from "../hooks/patchData";
import useUsers from "../hooks/useUsers";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/selfie_segmentation";
import Webcam from "react-webcam";

let name = "";

// let room: Room | null = null;

const StudentWebcam = () => {
  let [warnings, setWarnings] = useState<number>(0);
  let [terminated, setTerminated] = useState<boolean>(false);
  let [warningOne, setWarningOne] = useState<string>("");
  let [warningTwo, setWarningTwo] = useState<string>("");
  const webcamRef = useRef(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [startCapture, setStartCapture] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const { data, loading, error } = useUsers();
  const localVideoRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ready, isReady] = useState<boolean>(false);
  const [lkParticipant, setLkParticipant] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `https://eyedentify-69d961d5a478.herokuapp.com/api/get_student_token/${currentUser.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const tokenData = await response.json(); // assuming the response is in JSON format
        setToken(tokenData.token); // update the state with the fetched token
        // console.log(token);
      } catch (error) {
        console.error("Error fetching the token:", error);
      }
    };
    fetchToken();
  }, [currentUser.id]);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const room = new Room({
          // automatically manage subscribed video quality
          adaptiveStream: true,

          // optimize publishing bandwidth and CPU for published tracks
          dynacast: true,

          disconnectOnPageLeave: false,

          // default capture settings
          videoCaptureDefaults: {
            facingMode: "user",
          },
        });
        setRoom(room);
        room.prepareConnection(
          "wss://eyedentify-90kai7lw.livekit.cloud",
          token
        );

        room.on(RoomEvent.Connected, () => {
          console.log("connected to room", room.name);
          patchData({ terminated: false }, "update_terminate", currentUser.id);
          publishTracks(room.localParticipant);
        });

        room.on(RoomEvent.Disconnected, handleDisconnect);

        await room.connect("wss://eyedentify-90kai7lw.livekit.cloud", token);
      } catch (error) {
        console.error(error);
      }
    };

    connectToRoom();
  }, [token]);

  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    }
    loadModels();
  }, []);

  const checkFacesInFrame = async () => {
    const video = webcamRef.current?.video;
    if (!video) return;

    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detections.length > 1) {
      // console.log("More than one person detected");
      // Handle the case when more than one face is detected
      patchData({ isSuspicious: true }, "update_isSuspicious", currentUser.id);
    } else {
      // console.log("One person detected or none at all");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkFacesInFrame, 1000); // Check every 5 seconds
    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, []);

  const applyBokehEffect = useCallback(async () => {
    const video = webcamRef.current?.video;
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

      // console.log(segmentation);
      // console.log(segmentation.length);
      // if there is more than one person in the frame, set isSuspicious to true
      if (segmentation.length !== 1 && currentUser.isSuspicious === false) {
        patchData(
          { isSuspicious: true },
          "update_isSuspicious",
          currentUser.id
        );
      }

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
  }, [webcamRef, canvasRef]);

  useEffect(() => {
    const video = webcamRef.current?.video;
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
  }, [webcamRef, applyBokehEffect]);

  const publishTracks = async (participant: LocalParticipant) => {
    await participant.setCameraEnabled(false);
    await participant.setMicrophoneEnabled(false);
    await participant.setScreenShareEnabled(false);

    try {
      const videoTrack = await createLocalVideoTrack();
      await participant.publishTrack(videoTrack); // Ensure this completes before moving on

      const canvasStream = canvasRef.current.captureStream(30);
      const canvasVideoTrack = canvasStream.getVideoTracks()[0];

      await videoTrack.replaceTrack(canvasVideoTrack); // Ensure track is replaced only after being published

      // participant.tracks.forEach((publication) => {
      //   if (publication.track.kind === "video" && localVideoRef.current) {
      //     publication.track.attach(localVideoRef.current);
      //   }
      // });
    } catch (error) {
      console.error("Error in publishing or replacing tracks:", error);
    }
  };

  preventLoad(true, true);
  preventAccess("staff");

  useEffect(() => {
    if (data && currentUser) {
      const foundUser = data.find((user) => user.id === currentUser.id);
      if (foundUser) {
        setWarnings(foundUser.warnings);
        setWarningOne(foundUser.warningOne);
        setWarningTwo(foundUser.warningTwo);
        setTerminated(foundUser.terminated);
        currentUser.warnings = foundUser.warnings;
        currentUser.warningOne = foundUser.warningOne;
        currentUser.warningTwo = foundUser.warningTwo;
        currentUser.terminated = foundUser.terminated;
      }
    }
  }, [data, currentUser]);

  if (currentUser !== undefined) {
    name = currentUser.name;
  }

  const [frameCaptureInterval, setFrameCaptureInterval] = useState<
    number | null
  >(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const capturedChunksRef = useRef<BlobPart[]>([]);

  // const frames: string[] = [];

  // const captureFrame = () => {
  //   const video = webcamRef.current?.video;
  //   const canvas = canvasRef.current;

  //   if (video && canvas && startCapture) {
  //     const context = canvas.getContext("2d");

  //     if (context) {
  //       // Draw the video frame to the canvas.
  //       context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //       // You can now save the image data from the canvas or do further processing.
  //       const imageDataUrl = canvas.toDataURL("image/png");
  //       frames.push(imageDataUrl);
  //       console.log(frames);
  //       // code for downloading the frame, for now its being pushed to an array
  //       // const downloadLink = document.createElement("a");
  //       // downloadLink.href = imageDataUrl;
  //       // downloadLink.download = "captured_frame.png"; // You can change the name here
  //       // downloadLink.click();
  //     }
  //   }
  // };

  const handleStartCapture = () => {
    // if (webcamRef.current && webcamRef.current.stream) {
    //   const stream = webcamRef.current.stream;
    //   const recorder = new MediaRecorder(stream, {
    //     mimeType: "video/webm",
    //   });
    //   setMediaRecorder(recorder);

    //   (recorder.ondataavailable = (e: BlobEvent) => {
    //     if (e.data.size > 0) {
    //       capturedChunksRef.current.push(e.data);
    //     }
    //   }),
    //     [capturedChunksRef];

    //   recorder.onstop = handleDownload;

    //   recorder.start();
    patchData({ ready: true }, "update_ready", currentUser.id);
    isReady(true);
    // }
  };

  const downloadVideo = () => {
    console.log("Downloading video...");

    const blob = new Blob(capturedChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    a.click();
    URL.revokeObjectURL(url);
    // capturedChunksRef;
  };

  const handleDownload = () => {
    console.log("Checking for chunks:", capturedChunksRef.current.length);

    if (capturedChunksRef.current.length) {
      downloadVideo();
    }
  };

  const handleStopCapture = () => {
    //   if (frameCaptureInterval) {
    //     window.clearInterval(frameCaptureInterval);
    //     setFrameCaptureInterval(null);
    //   }
    // }
    if (room && room.localParticipant) {
      const participant = room.localParticipant;
      participant.tracks.forEach((publication: LocalTrackPublication) => {
        // Check if the publication is a video track
        if (publication.track.kind === "video") {
          // Stop and unpublish the video track
          publication.track.stop();
          participant.unpublishTrack(publication.track);
        }
      });
    }

    patchData({ terminated: true }, "update_terminate", currentUser.id);
    patchData({ warningOne: "" }, "update_warning_one", currentUser.id);
    patchData({ warningTwo: "" }, "update_warning_two", currentUser.id);
    patchData({ ready: false }, "update_ready", currentUser.id);

    navigate("/");
    isReady(false);
  };

  function handleDisconnect() {
    console.log("disconnected from room");
    if (room && room.localParticipant) {
      const participant = room.localParticipant;
      participant.tracks.forEach((publication: LocalTrackPublication) => {
        // Check if the publication is a video track
        if (publication.track.kind === "video") {
          // Stop and unpublish the video track
          publication.track.stop();
          participant.unpublishTrack(publication.track);
        }
      });
    }
  }

  currentUser.terminated === true && handleStopCapture(); //make an alert

  return (
    <>
      <Box
        hidden={ready ? false : true}
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
      >
        <Heading padding={"10px"}>{`Warnings: ${warnings}`}</Heading>
      </Box>
      <HStack>
        <Box paddingLeft={"10px"}>
          <HiEye color={"#81E6D9"} size={"3em"} />
        </Box>
        <Heading padding={"10px"}>{currentUser.name}</Heading>
        <Spacer />
        <Box paddingRight={"30px"}>
          <div hidden={ready ? false : true}>
            <EndExam handleTerminate={handleStopCapture} />
          </div>
        </Box>
      </HStack>
      <LoginSuccess />
      {/* Warning Alerts */}
      {warnings === 1 && <WarningOne user={currentUser} />}
      {warnings === 2 && <WarningTwo user={currentUser} />}
      <VStack padding={"20px"} minHeight="91vh">
        <Box
          borderRadius={"10px"}
          overflow={"hidden"}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div style={{ position: "relative" }}>
            <canvas
              ref={canvasRef}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                width: "50%",
                height: "auto",
                position: "relative",
                zIndex: 2, // Ensure the canvas is in front
                marginLeft: "25%",
              }}
            ></canvas>
            <Webcam
              audio={false}
              height={720}
              width={1280}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                visibility: "hidden",
                zIndex: 0, // Place the webcam behind the canvas
              }}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
            />
          </div>
        </Box>
        <div hidden={ready ? true : false}>
          <p>This is where the checklist will be</p>
        </div>
        <Button
          colorScheme="teal"
          variant="solid"
          padding={"10px"}
          hidden={ready ? true : false}
          onClick={handleStartCapture}
        >
          {"Ready"}
        </Button>
        <CopyrightVersion bottomVal={-2} />
      </VStack>
    </>
  );
};

export default StudentWebcam;

import { useCallback, useEffect, useRef, useState } from "react";
import { currentUser } from "./LoginForm";
import EndExam from "../components/alerts/EndExam";
import {
  Box,
  Button,
  HStack,
  Heading,
  Spacer,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { HiEye } from "react-icons/hi";
import LoginSuccess from "../components/alerts/LoginSuccess";
import WarningOne from "../components/alerts/WarningOne";
import WarningTwo from "../components/alerts/WarningTwo";
import CopyrightVersion from "../components/CopyrightVersion";
import WaitingRoom from "../components/alerts/WaitingRoom";
import TimeDeduction from "../components/alerts/TimeDeduction";
import CameraTip from "../components/alerts/CameraTip";
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

const StudentWebcam = () => {
  let [warnings, setWarnings] = useState<number>(0);
  let [terminated, setTerminated] = useState<boolean>(false);
  let [warningOne, setWarningOne] = useState<string>("");
  let [warningTwo, setWarningTwo] = useState<string>("");
  const webcamRef = useRef(null);
  const [faceVerified, setFaceVerified] = useState(false);

  const [peopleVerified, setPeopleVerified] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const { data, loading, error } = useUsers();
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [componentLoading, setComponentLoading] = useState(true);
  const [ready, isReady] = useState<boolean>(false);
  const [lkParticipant, setLkParticipant] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [showCameraTip, setShowCameraTip] = useState(false);
  const [isOnePerson, setIsOnePerson] = useState(true);

  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setComponentLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isFaceVerified || !isOnePerson) {
        setShowCameraTip(true);
      }
    }, 10000); // 10 seconds
  
    return () => clearTimeout(timer);
  }, [isFaceVerified, isOnePerson]);
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `https://eyedentify-69d961d5a478.herokuapp.com/api/get_student_token/${currentUser.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const tokenData = await response.json();
        setToken(tokenData.token);
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
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setModelsLoaded(true);
    }
    loadModels();
  }, []);

  useEffect(() => {
    const computeReferenceDescriptor = async (imgElement) => {
      const detections = await faceapi
        .detectSingleFace(imgElement)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detections) {
        setReferenceDescriptor(detections.descriptor);
      }
    };
    const loadReferenceImageFromURL = (url) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Required for CORS if the image is on a different domain
      img.src = url;
      img.onload = () => {
        computeReferenceDescriptor(img);
      };
    };

    loadReferenceImageFromURL(currentUser.imageURL);
  }, [modelsLoaded]);

  const checkFacesInFrame = async () => {
    const video = webcamRef.current?.video;
    if (!video) return;

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length > 1 || detections.length === 0) {
      // more than one person detected
      if (currentUser.ready === true) {
        patchData(
          { isSuspicious: true },
          "update_isSuspicious",
          currentUser.id
        );
      } //patch data only if exam has started
      setPeopleVerified(true);
    } else {
      setPeopleVerified(false);
    }

    if (detections.length === 0) {
      //no people means no face :)
      setFaceVerified(false);
    }

    //facial recognition
    for (let detection of detections) {
      if (referenceDescriptor) {
        const distance = faceapi.euclideanDistance(
          referenceDescriptor,
          detection.descriptor
        );
        if (distance < 0.6) {
          // Threshold, can adjust
          console.log(`Match found for ${currentUser.name}`);
          setFaceVerified(true);
        } else {
          console.log(`No match found for ${currentUser.name}`);
          setFaceVerified(false);
          //patch data only if examinee is ready
          if (currentUser.ready === true) {
            patchData(
              { isSuspicious: true },
              "update_isSuspicious",
              currentUser.id
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!modelsLoaded || !referenceDescriptor) return;

    const intervalId = setInterval(checkFacesInFrame, 1000); // Check every second
    return () => clearInterval(intervalId);
  }, [modelsLoaded, referenceDescriptor]);

  //blurring function
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

      const segmentation = await segmenter.segmentPeople(video); // segment the people
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
      //blur the background
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
      video.removeEventListener("play", handleVideoPlay);
    };
  }, [webcamRef, applyBokehEffect]);

  //function to publish blurred video to LK room
  const publishTracks = async (participant: LocalParticipant) => {
    await participant.setCameraEnabled(false);
    await participant.setMicrophoneEnabled(false);
    await participant.setScreenShareEnabled(false);

    try {
      const videoTrack = await createLocalVideoTrack();
      await participant.publishTrack(videoTrack);

      const canvasStream = canvasRef.current.captureStream(30);
      const canvasVideoTrack = canvasStream.getVideoTracks()[0];

      await videoTrack.replaceTrack(canvasVideoTrack); // Ensure track is replaced only after being published
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

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const capturedChunksRef = useRef<BlobPart[]>([]);

  const handleUpload = async () => {
    console.log("handleUpload started");
    console.log("capturedChunks length:", capturedChunksRef.current.length);
    console.log(
      "MediaRecorder state:",
      mediaRecorder ? mediaRecorder.state : "No MediaRecorder"
    );

    if (capturedChunksRef.current.length) {
      const blob = new Blob(capturedChunksRef.current, { type: "video/webm" });

      // Fetch the presigned URL
      const response = await fetch(
        `https://eyedentify-69d961d5a478.herokuapp.com/api/presigned_url/${currentUser.id}`
      );
      const { url } = await response.json();
      console.log("Presigned URL:", url);
      // Upload the blob to the presigned URL
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: blob,
      });
      console.log("Blob size:", blob.size);
      console.log("Upload response:", await uploadResponse.text());
    }
  };

  const handleStartCapture = () => {
    if (canvasRef.current) {
      const stream = canvasRef.current.captureStream(30); // Assuming 30fps
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      recorder.ondataavailable = (e: BlobEvent) => {
        console.log("Data chunk size:", e.data.size);

        if (e.data.size > 0) {
          capturedChunksRef.current.push(e.data);
        }
      };

      warnings === 0 && (recorder.onstop = handleUpload);

      setMediaRecorder(recorder);
      recorder.start();

      patchData({ ready: true }, "update_ready", currentUser.id);
      currentUser.ready = true;
      isReady(true);
    }
  };

  const handleStopCapture = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
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
        if (publication.track.kind === "video") {
          publication.track.stop();
          participant.unpublishTrack(publication.track);
        }
      });
    }
  }

  currentUser.terminated === true && handleStopCapture();

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

      <VStack padding={"20px"} minHeight="91vh">
        {componentLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <Spinner thickness="4px" size={"xl"} color="teal" />
          </Box>
        ) : (
          <></>
        )}{" "}
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
        <Box hidden={componentLoading ? true : false}>
          <HStack hidden={ready ? true : false}>
            <Box>{`Face Verified: ${faceVerified ? "✅" : "❌"}`}</Box>
            <Box>{`One Person: ${peopleVerified ? "❌" : "✅"}`}</Box>
          </HStack>
        </Box>
        <Box hidden={componentLoading ? true : false}>
          <Button
            colorScheme="teal"
            variant="solid"
            padding={"10px"}
            hidden={ready ? true : false}
            isDisabled={faceVerified === false || peopleVerified === true}
            onClick={handleStartCapture}
          >
            {"Ready"}
          </Button>
        </Box>
        <Box width={"75%"}>
          <LoginSuccess />
          {warnings === 1 && <WarningOne user={currentUser} />}
          {warnings === 2 && <WarningTwo user={currentUser} />}
          {/* add warning related to lighting conditions */}
          {showCameraTip && ( 
            <CameraTip />
          )}
          {/* add warnings for students who are exam ready */}
          <WaitingRoom />
          {/* add warnings for students who are late to exam such as delayed verification */}
          <TimeDeduction />
        </Box>
        <CopyrightVersion bottomVal={-2} />
      </VStack>
    </>
  );
};

export default StudentWebcam;

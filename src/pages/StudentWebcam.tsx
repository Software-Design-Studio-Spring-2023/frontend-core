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
import preventLoad from "../hooks/preventLoad";
import {
  TinyFaceDetectorOptions,
  detectAllFaces,
  detectSingleFace,
  euclideanDistance,
  nets,
} from "@vladmandic/face-api";

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
import {
  createSegmenter,
  SupportedModels,
  drawBokehEffect,
} from "@tensorflow-models/body-segmentation";
import { load } from "@tensorflow-models/coco-ssd";

import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/selfie_segmentation";
import Webcam from "react-webcam";
import StartExamButton from "../components/StartExamButton";

let name = "";

const StudentWebcam = () => {
  let [phoneDetected, setPhoneDetected] = useState<boolean>(false);
  let [warnings, setWarnings] = useState<number>(0);
  let [terminated, setTerminated] = useState<boolean>(false);
  let [warningOne, setWarningOne] = useState<string>("");
  let [warningTwo, setWarningTwo] = useState<string>("");
  const webcamRef = useRef(null);
  const [faceVerified, setFaceVerified] = useState(false);

  const [peopleInvalid, setPeopleInvalid] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const { data, loading, error } = useUsers();
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [componentLoading, setComponentLoading] = useState(true);
  const [ready, isReady] = useState<boolean>(false);
  const navigate = useNavigate();
  const [objectDetectionModel, setObjectDetectionModel] = useState(null);

  const [token, setToken] = useState(null);

  useEffect(() => {
    // Function to load the model
    const loadObjectDetectionModel = async () => {
      try {
        const model = await load();
        setObjectDetectionModel(model); // Set the model into state
      } catch (error) {
        console.error("Failed to load the object detection model:", { error });
      }
    };
    // Load the model`
    loadObjectDetectionModel();
  }, []);

  const checkVideoFrameForObjects = async () => {
    function containsHighConfidencePhone(entries: any[]) {
      return entries.some(
        (entry) => entry.class === "cell phone" && entry.score > 0.6
      );
    }

    function containsMoreThanOnePerson(entries: any[]) {
      return entries.filter((entry) => entry.class === "person").length > 1;
    }

    if (!objectDetectionModel || !webcamRef.current) {
      return;
    }

    // Get video element from webcam reference
    const video = webcamRef.current.video;

    try {
      // Now we can run the model on each frame we get from the video
      const predictions = await objectDetectionModel.detect(video);

      if (predictions.length > 0) {
        // Here, you'd handle any objects detected. This could mean updating state,
        // triggering alerts, or any other application logic.
        console.log("Detected objects:", predictions);
        if (containsHighConfidencePhone(predictions)) {
          setPhoneDetected(true);
          if (currentUser.ready) {
            patchData(
              { isSuspicious: true },
              "update_isSuspicious",
              currentUser.id
            );
          }
        } else {
          setPhoneDetected(false);
        }
        if (containsMoreThanOnePerson(predictions)) {
          setPeopleInvalid(true);
          if (currentUser.ready) {
            patchData(
              { isSuspicious: true },
              "update_isSuspicious",
              currentUser.id
            );
          }
        } else {
          setPeopleInvalid(false);
        }
      }
    } catch (error) {
      console.error("Error during object detection:", { error });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setComponentLoading(false);
    }, 1500);
  }, []);

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
      await nets.tinyFaceDetector.loadFromUri("/models");
      await nets.ssdMobilenetv1.loadFromUri("/models");
      await nets.faceLandmark68Net.loadFromUri("/models");
      await nets.faceRecognitionNet.loadFromUri("/models");
      setModelsLoaded(true);
    }
    loadModels();
  }, []);

  useEffect(() => {
    const computeReferenceDescriptor = async (imgElement) => {
      const detections = await detectSingleFace(imgElement)
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

    const detections = await detectAllFaces(
      video,
      new TinyFaceDetectorOptions()
    )
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
      setPeopleInvalid(true);
    } else {
      setPeopleInvalid(false);
    }

    if (detections.length === 0) {
      //no people means no face :)
      setFaceVerified(false);
    }

    //facial recognition
    for (let detection of detections) {
      if (referenceDescriptor) {
        const distance = euclideanDistance(
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

  useEffect(() => {
    // You might adjust the interval as needed for performance reasons
    const intervalId = setInterval(checkVideoFrameForObjects, 1000); // Check every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [objectDetectionModel, webcamRef]); // Dependencies ensure useEffect reruns if they change

  //blurring function
  const applyBokehEffect = useCallback(async () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const segmenter = await createSegmenter(
      SupportedModels.MediaPipeSelfieSegmentation,
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
      await drawBokehEffect(
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
        <StartExamButton />
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
            <Box>{`One Person: ${peopleInvalid ? "❌" : "✅"}`}</Box>
            <Box>{`No Prohibited Items: ${phoneDetected ? "❌" : "✅"}`}</Box>
          </HStack>
        </Box>
        <Box hidden={componentLoading ? true : false}>
          <Button
            colorScheme="teal"
            variant="solid"
            padding={"10px"}
            hidden={ready ? true : false}
            isDisabled={
              faceVerified === false ||
              peopleInvalid === true ||
              phoneDetected === true
            }
            onClick={handleStartCapture}
          >
            {"Ready"}
          </Button>
        </Box>
        <Box width={"75%"}>
          <LoginSuccess />
          {warnings === 1 && <WarningOne user={currentUser} />}
          {warnings === 2 && <WarningTwo user={currentUser} />}
        </Box>
        <CopyrightVersion bottomVal={-2} />
      </VStack>
    </>
  );
};

export default StudentWebcam;

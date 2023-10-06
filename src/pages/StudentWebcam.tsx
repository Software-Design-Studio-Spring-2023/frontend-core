import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { currentUser } from "./LoginForm";
import EndExam from "../components/alerts/EndExam";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  HStack,
  Heading,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { LiveKitRoom } from "@livekit/components-react";
import { HiEye } from "react-icons/hi";
import LoginSuccess from "../components/alerts/LoginSuccess";
import WarningOne from "../components/alerts/WarningOne";
import WarningTwo from "../components/alerts/WarningTwo";
import CopyrightVersion from "../components/CopyrightVersion";
import preventLoad from "../hooks/preventLoad";
import preventAccess from "../hooks/preventAccess";
import { useNavigate } from "react-router-dom";
import {
  DefaultReconnectPolicy,
  LocalParticipant,
  LocalTrackPublication,
  Room,
  RoomEvent,
  VideoPresets,
} from "livekit-client";
import StudentConnect from "../components/StudentConnect";

let name = "";

// let room: Room | null = null;

let warnings: number;

let userId = currentUser.id;

const StudentWebcam = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [startCapture, setStartCapture] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);

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
            // resolution: VideoPresets.h2160.resolution,
            facingMode: "user",
          },
        });
        setRoom(room);
        room.prepareConnection(
          "wss://eyedentify-90kai7lw.livekit.cloud",
          token
        );
        room.on(RoomEvent.Disconnected, handleDisconnect);

        await room.connect("wss://eyedentify-90kai7lw.livekit.cloud", token);
        console.log("connected to room", room.name);

        // publish local camera and mic tracks
        const p = room.localParticipant;
        // turn on the local user's camera and mic, this may trigger a browser prompt
        // to ensure permissions are granted
        await p.setCameraEnabled(true);
        await p.setMicrophoneEnabled(false);
        await p.setScreenShareEnabled(false);
      } catch (error) {
        console.error("Error connecting to room:", room);
      }
    };

    connectToRoom();
  }, [token]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowAlert(false);
  //     setStartCapture(true);
  //   }, 3000); // Set timeout to 10 seconds

  //   return () => clearTimeout(timer); // Clear the timer if the component is unmounted before 10 seconds
  // }, []);

  preventLoad(true, true);
  preventAccess("staff");

  if (currentUser !== undefined) {
    name = currentUser.name;
    warnings = currentUser.warnings;
  }
  const webcamRef = useRef<(Webcam & HTMLVideoElement) | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameCaptureInterval, setFrameCaptureInterval] = useState<
    number | null
  >(null);
  const [recording, setRecording] = useState<boolean>(false);
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

  useEffect(() => {
    const publishTrackToRoom = async () => {
      if (isConnected && webcamRef.current && room) {
        const stream = webcamRef.current.stream;
        console.log("Stream:", stream);

        if (stream) {
          const track = stream.getVideoTracks()[0];
          console.log("Track:", track);

          if (track) {
            try {
              // Adding a timeout here
              setTimeout(async () => {
                try {
                  await room.localParticipant.publishTrack(track);
                  console.log("Track published successfully.");
                } catch (error) {
                  console.error("Error publishing video track:", error);
                }
              }, 2000); // 2000 milliseconds = 2 seconds delay
            } catch (error) {
              console.error("Error with timeout function:", error);
            }
          } else {
            console.error("No video track found in the stream.");
          }
        } else {
          console.error("Webcam stream is undefined");
        }
      } else {
        console.error("Webcam not loaded or room not connected.");
      }
    };

    if (isConnected) {
      publishTrackToRoom();
    }
  }, [isConnected, room, webcamRef]);

  const handleStartCapture = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      const stream = webcamRef.current.stream;
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      setMediaRecorder(recorder);

      (recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          capturedChunksRef.current.push(e.data);
        }
      }),
        [capturedChunksRef];

      recorder.onstop = handleDownload;

      recorder.start();
      setRecording(true);
    }
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
    if (mediaRecorder && webcamRef.current?.stream) {
      mediaRecorder.stop();
      setRecording(false);
      // captureFrame();
      //this is to permanently shut the camera off once exam is confirmed done
      const stream = webcamRef.current?.stream;
      const tracks = stream.getTracks();
      if (lkParticipant) {
        tracks.forEach((track) => {
          lkParticipant.unpublishTrack(track);
          track.stop();
        });
      } else {
        tracks.forEach((track) => track.stop());
      }

      if (frameCaptureInterval) {
        window.clearInterval(frameCaptureInterval);
        setFrameCaptureInterval(null);
      }
    }
    navigate("/");
  };

  return (
    <>
      <Box
        hidden={recording ? false : true}
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
      >
        <Heading
          padding={"10px"}
        >{`Warnings: ${currentUser.warnings}`}</Heading>
      </Box>
      <HStack>
        <Box paddingLeft={"10px"}>
          <HiEye color={"#81E6D9"} size={"3em"} />
        </Box>
        <Heading padding={"10px"}>{currentUser.name}</Heading>
        <Spacer />
        <Box paddingRight={"30px"}>
          <div hidden={recording ? false : true}>
            <EndExam handleTerminate={handleStopCapture} />
          </div>
        </Box>
      </HStack>
      <LoginSuccess />

      {/* Warning Alerts */}
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {warnings === 1 && <WarningOne />}
      </Box>
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {warnings === 2 && <WarningTwo />}
      </Box>
      {/* {currentUser.warnings === 1 && <WarningOne/>}
      {currentUser.warnings === 2 && <WarningTwo/>} */}
      <VStack padding={"20px"} minHeight="91vh">
        <Box
          borderRadius={"10px"}
          overflow={"hidden"}
          // borderWidth={"4px"}
          // borderColor={"#1A202C"}
        >
          <Webcam audio={false} ref={webcamRef} />
        </Box>
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ display: "none" }}
        ></canvas>{" "}
        {/* Hide the canvas element */}
        <div hidden={recording ? true : false}>
          <p>This is where the checklist will be</p>
        </div>
        {/* {showAlert && (
          <Alert padding={"30px"} size={"medium"} status="warning">
            <AlertIcon />
            <AlertTitle>You have just received a warning!</AlertTitle>
            <AlertDescription>
              Suspicious activity has been detected on your video feed.
            </AlertDescription>
          </Alert>
        )} */}
        <Button
          colorScheme="teal"
          variant="solid"
          padding={"10px"}
          hidden={recording ? true : false}
          onClick={handleStartCapture}
        >
          {"Start Exam"}
        </Button>
        <CopyrightVersion bottomVal={-2} />
      </VStack>
    </>
  );
};

export default StudentWebcam;

function handleDisconnect() {
  console.log("disconnected from room");
}

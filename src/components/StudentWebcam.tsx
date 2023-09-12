import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import { currentUser } from "./LoginForm";

import { useNavigate } from "react-router-dom";
import EndExam from "./alerts/EndExam";
import { Alert, AlertIcon, Button, VStack } from "@chakra-ui/react";
// import { useDisclosure } from "@chakra-ui/react";

let name = "";

let warnings: number;

const StudentWebcam = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const handleBackButtonEvent = (e: PopStateEvent) => {
      e.preventDefault();

      // Keep pushing the current state to history whenever popstate is triggered
      window.history.pushState({}, "", window.location.pathname);
    };

    const handleBeforeUnloadEvent = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("popstate", handleBackButtonEvent);
    window.addEventListener("beforeunload", handleBeforeUnloadEvent);

    // Push the current state once when component mounts
    window.history.pushState({}, "", window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handleBackButtonEvent);
      window.removeEventListener("beforeunload", handleBeforeUnloadEvent);
    };
  }, []);

  const navigate = useNavigate();
  if (currentUser?.loggedIn === false) {
    useEffect(() => {
      navigate("/");
    }, []);
  } else if (currentUser?.userType === "teacher") {
    useEffect(() => {
      navigate("/*");
    }, []);
  }

  if (currentUser !== undefined) {
    name = currentUser.firstName;
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

  const frames: string[] = [];

  const captureFrame = () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        // Draw the video frame to the canvas.
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // You can now save the image data from the canvas or do further processing.
        const imageDataUrl = canvas.toDataURL("image/png");
        frames.push(imageDataUrl);
        console.log(frames);
        // code for downloading the frame, for now its being pushed to an array
        // const downloadLink = document.createElement("a");
        // downloadLink.href = imageDataUrl;
        // downloadLink.download = "captured_frame.png"; // You can change the name here
        // downloadLink.click();
      }
    }
  };

  const handleWebcamLoad = () => {
    // This will be triggered once the webcam is loaded and ready.
    //useful for immediate user identification
    const intervalId = window.setInterval(captureFrame, 1000 / 30); // for 30 fps
    setFrameCaptureInterval(intervalId);
  };

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
    // else {
    //   // Optional: add a slight delay before checking again
    //   setTimeout(() => {
    //     if (capturedChunksRef.current.length) {
    //       downloadVideo();
    //     }
    //   }, 1000);
    // }
  };

  const handleStopCapture = () => {
    if (mediaRecorder && webcamRef.current?.stream) {
      mediaRecorder.stop();
      setRecording(false);
      captureFrame();
      //this is to permanently shut the camera off once exam is confirmed done
      const stream = webcamRef.current?.stream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      if (frameCaptureInterval) {
        window.clearInterval(frameCaptureInterval);
        setFrameCaptureInterval(null);
      }
    }
    // if (currentUser?.loggedIn === true) {
    // currentUser.loggedIn = false;
    navigate("/");
    // }
  };

  return (
    <VStack minHeight="100vh" justifyContent="center" alignItems="center" spacing={5}>
      <div>
        <Webcam audio={false} ref={webcamRef} onUserMedia={handleWebcamLoad} />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ display: "none" }}
        ></canvas>{" "}
        {/* Hide the canvas element */}
      </div>
      <div>
        <p>{name}</p>
      </div>
      <div hidden={recording ? true : false}>
        <p>This is where the checklist will be</p>
      </div>
      <div hidden={recording ? false : true}>
        <p>Warnings: {warnings}</p>
      </div>
      <div>
        <Button colorScheme='teal' variant='solid' hidden={recording ? true : false} onClick={handleStartCapture}>
          {"Start Exam"}
        </Button>
        <div hidden={recording ? false : true}>
          {/* {"Finish Exam"} */}
          <EndExam handleTerminate={handleStopCapture} />
        </div>
      </div>
    </VStack>
  );
};

export default StudentWebcam;

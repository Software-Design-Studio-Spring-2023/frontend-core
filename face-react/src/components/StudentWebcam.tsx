import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

import { currentUser } from "./LoginForm";

import { useNavigate } from "react-router-dom";

let name = "";

let warnings: number;

const StudentWebcam = () => {
  //   const navigate = useNavigate();
  // useEffect(() => {
  //   navigate("/");
  // }, []);

  if (currentUser !== undefined) {
    name = currentUser.firstName;
    warnings = currentUser.warnings;
  }
  const webcamRef = useRef<(Webcam & HTMLVideoElement) | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const capturedChunksRef = useRef<BlobPart[]>([]);

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
    } else {
      // Optional: add a slight delay before checking again
      setTimeout(() => {
        if (capturedChunksRef.current.length) {
          downloadVideo();
        }
      }, 1000);
    }
  };

  const handleStopCapture = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
    alert("Are you sure?");
  };

  return (
    <div>
      <div>
        <Webcam audio={false} ref={webcamRef} />
      </div>
      <div>
        <p>{name}</p>
      </div>
      <div hidden={recording ? true : false}>
        <p>This is where the checklist will be</p>
      </div>
      <div hidden={true}>
        <p>Warnings: {warnings}</p>
      </div>
      <div>
        <button
          disabled={false}
          onClick={recording ? handleStopCapture : handleStartCapture}
        >
          {recording ? "Finish Exam" : "Start Exam"}
        </button>
      </div>
    </div>
  );
};

export default StudentWebcam;

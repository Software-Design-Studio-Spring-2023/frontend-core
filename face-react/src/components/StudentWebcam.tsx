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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const capturedChunksRef = useRef<BlobPart[]>([]);

  const captureFrame = () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        // Draw the video frame to the canvas.
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // You can now save the image data from the canvas or do further processing.
        // For example, to get the image as a data URL:
        const imageDataUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = imageDataUrl;
        downloadLink.download = "captured_frame.png"; // You can change the name here
        downloadLink.click();
      }
    }
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
    if (mediaRecorder && webcamRef.current?.stream) {
      mediaRecorder.stop();
      setRecording(false);
      captureFrame();
      //   const stream = webcamRef.current?.stream;
      //   const tracks = stream.getTracks();
      //   tracks.forEach((track) => track.stop());
    }
    alert("Are you sure?");
  };

  return (
    <div>
      <div>
        <Webcam audio={false} ref={webcamRef} />
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

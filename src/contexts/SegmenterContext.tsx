import { createContext, useContext, useEffect, useState } from "react";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-core";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import "@mediapipe/selfie_segmentation";

const SegmenterContext = createContext(null);

export const SegmenterProvider = ({ children }) => {
  const [segmenter, setSegmenter] = useState(null);

  useEffect(() => {
    const loadSegmenter = async () => {
      const seg = await bodySegmentation.createSegmenter(
        bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
        {
          runtime: "mediapipe",
          solutionPath:
            "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
          modelType: "general",
        }
      );
      setSegmenter(seg);
    };

    loadSegmenter();
  }, []);

  return (
    <SegmenterContext.Provider value={segmenter}>
      {children}
    </SegmenterContext.Provider>
  );
};

export const useSegmenter = () => {
  return useContext(SegmenterContext);
};

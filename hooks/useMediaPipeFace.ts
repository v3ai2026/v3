import { useState, useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { FaceLandmark } from '../types';

interface MediaPipeHookResult {
  faceLandmarks: FaceLandmark[][] | null;
  isReady: boolean;
  error: Error | null;
  processFrame: (video: HTMLVideoElement) => void;
}

export const useMediaPipeFace = (): MediaPipeHookResult => {
  const [faceLandmarks, setFaceLandmarks] = useState<FaceLandmark[][] | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    const initializeMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1
        });

        faceLandmarkerRef.current = faceLandmarker;
        setIsReady(true);
      } catch (err) {
        console.error('MediaPipe initialization error:', err);
        setError(err as Error);
      }
    };

    initializeMediaPipe();

    return () => {
      faceLandmarkerRef.current?.close();
    };
  }, []);

  const processFrame = (video: HTMLVideoElement) => {
    if (!faceLandmarkerRef.current || !isReady) return;

    const nowInMs = Date.now();
    if (video.currentTime === lastVideoTimeRef.current) return;
    lastVideoTimeRef.current = video.currentTime;

    try {
      const results = faceLandmarkerRef.current.detectForVideo(video, nowInMs);
      
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks.map(faceLandmark => 
          faceLandmark.map(point => ({
            x: point.x,
            y: point.y,
            z: point.z || 0
          }))
        );
        setFaceLandmarks(landmarks);
      } else {
        setFaceLandmarks(null);
      }
    } catch (err) {
      console.error('Frame processing error:', err);
    }
  };

  return {
    faceLandmarks,
    isReady,
    error,
    processFrame
  };
};

// Helper function to calculate glasses position from face landmarks
export const calculateGlassesTransform = (
  landmarks: FaceLandmark[]
): { position: [number, number, number]; rotation: [number, number, number]; scale: number } | null => {
  if (!landmarks || landmarks.length < 468) return null;

  // Key landmark indices for glasses positioning
  const leftEye = landmarks[33]; // Left eye outer corner
  const rightEye = landmarks[263]; // Right eye outer corner
  const noseBridge = landmarks[6]; // Nose bridge

  // Calculate center position between eyes
  const centerX = (leftEye.x + rightEye.x) / 2;
  const centerY = (leftEye.y + rightEye.y) / 2;
  const centerZ = (leftEye.z + rightEye.z) / 2;

  // Calculate distance between eyes for scaling
  const eyeDistance = Math.sqrt(
    Math.pow(rightEye.x - leftEye.x, 2) +
    Math.pow(rightEye.y - leftEye.y, 2) +
    Math.pow(rightEye.z - leftEye.z, 2)
  );

  // Calculate rotation based on eye positions
  const rotationY = Math.atan2(rightEye.z - leftEye.z, rightEye.x - leftEye.x);
  const rotationZ = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

  return {
    position: [centerX, centerY, centerZ],
    rotation: [0, rotationY, rotationZ],
    scale: eyeDistance * 2
  };
};

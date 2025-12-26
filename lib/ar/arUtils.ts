/**
 * AR Utilities for face and body tracking
 */

import { FaceLandmark } from '../../types';

/**
 * Check if browser supports required AR features
 */
export const checkARSupport = (): {
  camera: boolean;
  webgl: boolean;
  webxr: boolean;
  mediaPipe: boolean;
} => {
  return {
    camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    webgl: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl') || 
          canvas.getContext('experimental-webgl')
        );
      } catch (e) {
        return false;
      }
    })(),
    webxr: 'xr' in navigator,
    mediaPipe: true // MediaPipe runs via WASM, always available
  };
};

/**
 * Request camera permissions
 */
export const requestCameraPermission = async (
  facingMode: 'user' | 'environment' = 'user'
): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    return stream;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return null;
  }
};

/**
 * Get available cameras
 */
export const getAvailableCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Failed to enumerate devices:', error);
    return [];
  }
};

/**
 * Calculate eye-to-eye distance for scaling
 */
export const calculateEyeDistance = (
  landmarks: FaceLandmark[]
): number => {
  if (landmarks.length < 468) return 0;

  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  return Math.sqrt(
    Math.pow(rightEye.x - leftEye.x, 2) +
    Math.pow(rightEye.y - leftEye.y, 2) +
    Math.pow(rightEye.z - leftEye.z, 2)
  );
};

/**
 * Calculate face orientation (pitch, yaw, roll)
 */
export const calculateFaceOrientation = (
  landmarks: FaceLandmark[]
): { pitch: number; yaw: number; roll: number } | null => {
  if (landmarks.length < 468) return null;

  const noseTip = landmarks[1];
  const noseBridge = landmarks[6];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const chin = landmarks[152];

  // Calculate yaw (left-right rotation)
  const yaw = Math.atan2(
    rightEye.x - leftEye.x,
    rightEye.z - leftEye.z
  );

  // Calculate pitch (up-down rotation)
  const pitch = Math.atan2(
    noseTip.y - noseBridge.y,
    noseTip.z - noseBridge.z
  );

  // Calculate roll (tilt)
  const roll = Math.atan2(
    rightEye.y - leftEye.y,
    rightEye.x - leftEye.x
  );

  return { pitch, yaw, roll };
};

/**
 * Check if face is centered and well-lit
 */
export const assessFaceQuality = (
  landmarks: FaceLandmark[]
): {
  centered: boolean;
  tooClose: boolean;
  tooFar: boolean;
  confidence: number;
} => {
  if (landmarks.length < 468) {
    return {
      centered: false,
      tooClose: false,
      tooFar: false,
      confidence: 0
    };
  }

  const noseTip = landmarks[1];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  // Check if centered (nose should be near 0.5, 0.5)
  const centered = 
    Math.abs(noseTip.x - 0.5) < 0.2 && 
    Math.abs(noseTip.y - 0.5) < 0.2;

  // Check distance based on eye separation
  const eyeDistance = calculateEyeDistance(landmarks);
  const tooClose = eyeDistance > 0.3;
  const tooFar = eyeDistance < 0.1;

  // Simple confidence based on landmark visibility
  const confidence = Math.min(1, eyeDistance * 5);

  return { centered, tooClose, tooFar, confidence };
};

/**
 * Smooth landmark positions to reduce jitter
 */
export class LandmarkSmoother {
  private history: FaceLandmark[][] = [];
  private maxHistory: number;

  constructor(historySize: number = 3) {
    this.maxHistory = historySize;
  }

  smooth(landmarks: FaceLandmark[]): FaceLandmark[] {
    this.history.push(landmarks);
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    if (this.history.length === 1) {
      return landmarks;
    }

    // Average positions
    const smoothed: FaceLandmark[] = [];
    for (let i = 0; i < landmarks.length; i++) {
      let sumX = 0, sumY = 0, sumZ = 0;
      
      for (const frame of this.history) {
        sumX += frame[i].x;
        sumY += frame[i].y;
        sumZ += frame[i].z;
      }

      smoothed.push({
        x: sumX / this.history.length,
        y: sumY / this.history.length,
        z: sumZ / this.history.length
      });
    }

    return smoothed;
  }

  reset() {
    this.history = [];
  }
}

/**
 * Convert screen coordinates to 3D world coordinates
 */
export const screenToWorld = (
  screenX: number,
  screenY: number,
  depth: number,
  camera: { fov: number; aspect: number; position: { z: number } }
): { x: number; y: number; z: number } => {
  const vFOV = camera.fov * Math.PI / 180;
  const height = 2 * Math.tan(vFOV / 2) * (camera.position.z - depth);
  const width = height * camera.aspect;

  return {
    x: (screenX - 0.5) * width,
    y: -(screenY - 0.5) * height,
    z: depth
  };
};

/**
 * Create screenshot with overlay
 */
export const captureARScene = (
  videoElement: HTMLVideoElement,
  canvasOverlay: HTMLCanvasElement
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw video
  ctx.drawImage(videoElement, 0, 0);

  // Draw overlay
  ctx.drawImage(canvasOverlay, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/png');
};

/**
 * AR Performance Monitor
 */
export class ARPerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;

  update() {
    this.frameCount++;
    const now = performance.now();

    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
    }

    return this.fps;
  }

  getFPS() {
    return this.fps;
  }

  shouldReduceQuality() {
    return this.fps < 20;
  }
}

export default {
  checkARSupport,
  requestCameraPermission,
  getAvailableCameras,
  calculateEyeDistance,
  calculateFaceOrientation,
  assessFaceQuality,
  LandmarkSmoother,
  screenToWorld,
  captureARScene,
  ARPerformanceMonitor
};

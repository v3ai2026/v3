import React, { useRef, useEffect, useState } from 'react';

interface ARCameraProps {
  onFrame?: (video: HTMLVideoElement) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const ARCamera: React.FC<ARCameraProps> = ({ 
  onFrame, 
  onError,
  className = '' 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      onError?.(error as Error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isActive) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !onFrame) return;

    const video = videoRef.current;
    let animationId: number;

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        onFrame(video);
      }
      animationId = requestAnimationFrame(processFrame);
    };

    video.addEventListener('loadeddata', () => {
      processFrame();
    });

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onFrame]);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Camera Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          onClick={toggleCamera}
          className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#00DC82]/20 hover:border-[#00DC82]/50 transition-all"
          title="Switch camera"
        >
          🔄
        </button>
        
        {!isActive && (
          <button
            onClick={startCamera}
            className="px-6 py-3 rounded-full bg-[#00DC82]/80 backdrop-blur-xl border border-[#00DC82] text-black font-bold text-sm hover:bg-[#00DC82] transition-all"
          >
            Start Camera
          </button>
        )}
      </div>

      {/* Status Indicator */}
      {isActive && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-bold">LIVE</span>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARCamera } from './ARCamera';
import { useMediaPipeFace, calculateGlassesTransform } from '../../hooks/useMediaPipeFace';
import { ARProduct } from '../../types';

interface ARGlassesTryOnProps {
  products: ARProduct[];
  onCapture?: (imageData: string) => void;
  className?: string;
}

function GlassesModel({ 
  position, 
  rotation, 
  scale,
  modelUrl 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  scale: number;
  modelUrl: string;
}) {
  // TODO: Replace with actual model loading for production
  // Uncomment when real 3D models are available:
  // const { scene } = useGLTF(modelUrl);
  // return <primitive object={scene} position={position} rotation={rotation} scale={scale} />;
  
  // Placeholder geometry for demonstration
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[2, 0.3, 0.1]} />
      <meshStandardMaterial color="#00DC82" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export const ARGlassesTryOn: React.FC<ARGlassesTryOnProps> = ({
  products,
  onCapture,
  className = ''
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ARProduct | null>(
    products.length > 0 ? products[0] : null
  );
  const { faceLandmarks, isReady, processFrame } = useMediaPipeFace();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const glassesTransform = faceLandmarks && faceLandmarks[0] 
    ? calculateGlassesTransform(faceLandmarks[0])
    : null;

  const handleCapture = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      onCapture?.(imageData);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* AR View */}
      <div className="flex-1 relative bg-black rounded-2xl overflow-hidden">
        {/* Video Background */}
        <ARCamera 
          onFrame={(video) => {
            videoRef.current = video;
            processFrame(video);
          }}
          className="absolute inset-0"
        />

        {/* 3D Overlay */}
        {isReady && selectedProduct && (
          <Canvas
            ref={canvasRef as any}
            className="absolute inset-0 pointer-events-none"
            camera={{ position: [0, 0, 1], fov: 60 }}
            gl={{ alpha: true, preserveDrawingBuffer: true }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            
            {glassesTransform && (
              <GlassesModel
                position={[
                  (glassesTransform.position[0] - 0.5) * 4,
                  -(glassesTransform.position[1] - 0.5) * 4,
                  -glassesTransform.position[2] * 2
                ]}
                rotation={glassesTransform.rotation}
                scale={glassesTransform.scale * 2}
                modelUrl={selectedProduct.modelUrl}
              />
            )}
          </Canvas>
        )}

        {/* Status & Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {!isReady && (
            <div className="px-4 py-2 rounded-xl bg-yellow-500/80 backdrop-blur-xl text-black text-xs font-bold">
              Initializing AI...
            </div>
          )}
          {isReady && !faceLandmarks && (
            <div className="px-4 py-2 rounded-xl bg-blue-500/80 backdrop-blur-xl text-white text-xs font-bold">
              Looking for face...
            </div>
          )}
          {isReady && faceLandmarks && (
            <div className="px-4 py-2 rounded-xl bg-[#00DC82]/80 backdrop-blur-xl text-black text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              Face Tracked
            </div>
          )}
        </div>

        {/* Capture Button */}
        <button
          onClick={handleCapture}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-[#00DC82] shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="Take photo"
        >
          <span className="text-2xl">📷</span>
        </button>
      </div>

      {/* Product Selection */}
      <div className="mt-4 space-y-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Select Glasses
        </span>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 transition-all overflow-hidden ${
                selectedProduct?.id === product.id
                  ? 'border-[#00DC82] shadow-lg shadow-[#00DC82]/20'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {product.thumbnailUrl ? (
                <img 
                  src={product.thumbnailUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00DC82]/20 to-transparent flex items-center justify-center text-2xl">
                  👓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

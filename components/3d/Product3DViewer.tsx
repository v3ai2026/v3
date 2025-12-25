import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, useGLTF, Environment } from '@react-three/drei';
import { Product3D, ProductVariant } from '../../types';
import * as THREE from 'three';

interface Product3DViewerProps {
  product: Product3D;
  onVariantChange?: (variant: ProductVariant) => void;
  onScreenshot?: (imageData: string) => void;
  className?: string;
}

function Model3D({ url, scale = 1 }: { url: string; scale?: number }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} />;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  product,
  onVariantChange,
  onScreenshot,
  className = ''
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [environment, setEnvironment] = useState<'studio' | 'city' | 'sunset' | 'warehouse'>('studio');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    onVariantChange?.(variant);
  };

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      onScreenshot?.(imageData);
    }
  };

  const modelUrl = selectedVariant?.modelUrl || product.modelUrl;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 3D Canvas */}
      <div className="flex-1 relative bg-gradient-to-br from-[#020420] to-[#0a0e2e] rounded-2xl overflow-hidden">
        <Canvas
          ref={canvasRef as any}
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          
          <Suspense fallback={null}>
            <Stage
              environment={environment}
              intensity={0.5}
              shadows="contact"
              adjustCamera={1.5}
            >
              <Model3D url={modelUrl} />
            </Stage>
            <Environment preset={environment} />
          </Suspense>

          <OrbitControls
            enableZoom
            enableRotate
            enablePan
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>

        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#00DC82]/20 hover:border-[#00DC82]/50 transition-all"
            title={autoRotate ? "Stop rotation" : "Auto rotate"}
          >
            {autoRotate ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={takeScreenshot}
            className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#00DC82]/20 hover:border-[#00DC82]/50 transition-all"
            title="Take screenshot"
          >
            📷
          </button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="mt-4 space-y-4">
        {/* View Presets */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-full mb-1">
            View Angle
          </span>
          {['Front', 'Back', 'Side', 'Top'].map((view) => (
            <button
              key={view}
              className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#00DC82] hover:border-[#00DC82]/30 transition-all"
            >
              {view}
            </button>
          ))}
        </div>

        {/* Environment */}
        <div className="space-y-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Environment
          </span>
          <div className="flex gap-2 flex-wrap">
            {(['studio', 'city', 'sunset', 'warehouse'] as const).map((env) => (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                  environment === env
                    ? 'bg-[#00DC82]/10 border-[#00DC82] text-[#00DC82]'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Variants */}
        {product.variants.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Variants
            </span>
            <div className="flex gap-2 flex-wrap">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'bg-[#00DC82]/10 border-[#00DC82] text-[#00DC82]'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                  style={
                    variant.hexColor
                      ? {
                          borderColor: variant.hexColor,
                          backgroundColor: `${variant.hexColor}20`,
                        }
                      : undefined
                  }
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

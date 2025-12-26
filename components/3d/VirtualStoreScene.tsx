import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Sky, 
  Environment,
  Box,
  Plane,
  Text
} from '@react-three/drei';
import { VirtualStore, Product3D } from '../../types';
import * as THREE from 'three';

interface VirtualStoreSceneProps {
  store: VirtualStore;
  onProductClick?: (product: Product3D) => void;
  className?: string;
}

function StoreFloor() {
  return (
    <Plane 
      args={[50, 50]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial 
        color="#1a1e43" 
        metalness={0.1} 
        roughness={0.8}
      />
    </Plane>
  );
}

function ProductPodium({ 
  product, 
  position,
  onClick 
}: { 
  product: Product3D; 
  position: [number, number, number];
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <group position={position}>
      {/* Podium Base */}
      <Box args={[1.5, 0.2, 1.5]} position={[0, -0.1, 0]}>
        <meshStandardMaterial 
          color={hovered ? "#00DC82" : "#2a2e53"} 
          metalness={0.8} 
          roughness={0.2}
          emissive={hovered ? "#00DC82" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </Box>

      {/* Product Placeholder */}
      <mesh
        ref={meshRef}
        position={[0, 0.8, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#00DC82" 
          metalness={0.5} 
          roughness={0.3}
        />
      </mesh>

      {/* Product Label */}
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {product.name}
      </Text>

      {/* Price Tag */}
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.12}
        color="#00DC82"
        anchorX="center"
        anchorY="middle"
      >
        ${product.price}
      </Text>
    </group>
  );
}

function StoreWalls() {
  return (
    <>
      {/* Back Wall */}
      <Box args={[50, 8, 0.5]} position={[0, 4, -25]}>
        <meshStandardMaterial color="#0a0e2e" />
      </Box>
      
      {/* Left Wall */}
      <Box args={[0.5, 8, 50]} position={[-25, 4, 0]}>
        <meshStandardMaterial color="#0a0e2e" />
      </Box>
      
      {/* Right Wall */}
      <Box args={[0.5, 8, 50]} position={[25, 4, 0]}>
        <meshStandardMaterial color="#0a0e2e" />
      </Box>

      {/* Store Sign */}
      <Text
        position={[0, 6, -24.5]}
        fontSize={1}
        color="#00DC82"
        anchorX="center"
        anchorY="middle"
        font="/fonts/bold.woff"
      >
        NEURAL STORE
      </Text>
    </>
  );
}

function StoreLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00DC82" />
      <pointLight position={[-10, 3, -10]} intensity={0.3} />
      <pointLight position={[10, 3, -10]} intensity={0.3} />
    </>
  );
}

export const VirtualStoreScene: React.FC<VirtualStoreSceneProps> = ({
  store,
  onProductClick,
  className = ''
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product3D | null>(null);

  const handleProductClick = (product: Product3D) => {
    setSelectedProduct(product);
    onProductClick?.(product);
  };

  return (
    <div className={`h-full relative ${className}`}>
      <Canvas shadows camera={{ position: [0, 3, 10], fov: 60 }}>
        <PerspectiveCamera makeDefault position={[0, 3, 10]} />
        
        <StoreLighting />
        <StoreFloor />
        <StoreWalls />
        
        <Environment preset="city" />
        <Sky sunPosition={[100, 20, 100]} />

        {/* Product Display Grid */}
        {store.products.slice(0, 9).map((product, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const x = (col - 1) * 4;
          const z = (row - 1) * 4 - 10;
          
          return (
            <ProductPodium
              key={product.id}
              product={product}
              position={[x, 0, z]}
              onClick={() => handleProductClick(product)}
            />
          );
        })}

        <OrbitControls
          enableZoom
          enableRotate
          enablePan
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 1, -10]}
        />
      </Canvas>

      {/* Store Info Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="px-6 py-3 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10">
          <h3 className="text-xl font-black text-[#00DC82]">{store.name}</h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest">{store.theme} Theme</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-xs text-white">
          {store.products.length} Products Available
        </div>
      </div>

      {/* Navigation Help */}
      <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-xs text-slate-400">
        🖱️ Drag to rotate • Scroll to zoom • Click products to view
      </div>

      {/* Selected Product Panel */}
      {selectedProduct && (
        <div className="absolute top-4 right-4 w-80 p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-[#00DC82]/30 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-white">{selectedProduct.name}</h4>
              <p className="text-sm text-slate-400 mt-1">{selectedProduct.description}</p>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-2xl font-black text-[#00DC82]">${selectedProduct.price}</span>
            <button className="px-6 py-2 rounded-xl bg-[#00DC82] text-black font-bold text-sm hover:bg-[#00DC82]/80 transition-all">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

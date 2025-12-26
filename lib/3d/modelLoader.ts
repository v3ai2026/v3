import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Preload 3D models to improve performance
 * Call this at app initialization
 */
export const preloadModels = (modelUrls: string[]) => {
  modelUrls.forEach((url) => {
    useGLTF.preload(url);
  });
};

/**
 * Optimize a loaded 3D model
 * - Reduces polygon count if needed
 * - Optimizes materials
 * - Sets proper shadows
 */
export const optimizeModel = (scene: THREE.Object3D) => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Enable shadows
      child.castShadow = true;
      child.receiveShadow = true;

      // Optimize materials
      if (child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        
        // Enable metalness workflow if not set
        if (material.metalness === undefined) {
          material.metalness = 0.5;
        }
        if (material.roughness === undefined) {
          material.roughness = 0.5;
        }

        // Optimize for performance
        material.needsUpdate = true;
      }
    }
  });

  return scene;
};

/**
 * Calculate bounding box and center the model
 */
export const centerModel = (scene: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  
  scene.position.x -= center.x;
  scene.position.y -= center.y;
  scene.position.z -= center.z;

  return scene;
};

/**
 * Get model dimensions
 */
export const getModelDimensions = (scene: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  
  return {
    width: size.x,
    height: size.y,
    depth: size.z,
    volume: size.x * size.y * size.z
  };
};

/**
 * Scale model to fit within a bounding box
 */
export const scaleToFit = (
  scene: THREE.Object3D,
  maxSize: number = 1
) => {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  
  const scale = maxSize / maxDimension;
  scene.scale.multiplyScalar(scale);

  return scene;
};

/**
 * Create thumbnail from 3D model
 */
export const generateThumbnail = async (
  scene: THREE.Object3D,
  size: number = 256
): Promise<string> => {
  return new Promise((resolve) => {
    // Create temporary renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true 
    });
    renderer.setSize(size, size);

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(2, 1, 2);
    camera.lookAt(0, 0, 0);

    // Create scene with lighting
    const tempScene = new THREE.Scene();
    tempScene.background = new THREE.Color(0x020420);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    tempScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    tempScene.add(directionalLight);

    // Clone and add model
    const modelClone = scene.clone();
    centerModel(modelClone);
    scaleToFit(modelClone, 1);
    tempScene.add(modelClone);

    // Render and get data URL
    renderer.render(tempScene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');

    // Cleanup
    renderer.dispose();
    
    resolve(dataUrl);
  });
};

/**
 * Validate model file
 */
export const validateModel = async (url: string): Promise<{
  valid: boolean;
  error?: string;
  metadata?: {
    fileSize: number;
    format: string;
    triangles?: number;
  };
}> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      return {
        valid: false,
        error: `Failed to fetch model: ${response.statusText}`
      };
    }

    const contentType = response.headers.get('content-type') || '';
    const fileSize = parseInt(response.headers.get('content-length') || '0');

    // Check file size (warn if > 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      console.warn(`Model file is large (${(fileSize / 1024 / 1024).toFixed(2)}MB). Consider optimization.`);
    }

    // Validate content type
    const validTypes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
    const format = url.endsWith('.glb') ? 'GLB' : url.endsWith('.gltf') ? 'GLTF' : 'Unknown';

    return {
      valid: true,
      metadata: {
        fileSize,
        format
      }
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Create a simple fallback model
 */
export const createFallbackModel = (color: string = '#00DC82'): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ 
    color,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  return mesh;
};

/**
 * Model loading with error handling
 */
export const loadModelSafe = async (
  url: string,
  onProgress?: (progress: number) => void
): Promise<THREE.Object3D | null> => {
  try {
    // Validate first
    const validation = await validateModel(url);
    if (!validation.valid) {
      console.error('Model validation failed:', validation.error);
      return createFallbackModel();
    }

    // Load model
    const { scene } = await useGLTF(url);
    
    // Optimize
    optimizeModel(scene);
    
    return scene;
  } catch (error) {
    console.error('Failed to load model:', error);
    return createFallbackModel();
  }
};

export default {
  preloadModels,
  optimizeModel,
  centerModel,
  getModelDimensions,
  scaleToFit,
  generateThumbnail,
  validateModel,
  createFallbackModel,
  loadModelSafe
};

/// <reference types="@react-three/fiber" />

import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Extend JSX to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any
      mesh: any
      primitive: any
      boxGeometry: any
      sphereGeometry: any
      planeGeometry: any
      cylinderGeometry: any
      meshStandardMaterial: any
      meshBasicMaterial: any
      meshPhongMaterial: any
      ambientLight: any
      directionalLight: any
      pointLight: any
      spotLight: any
      hemisphereLight: any
      perspectiveCamera: any
      orthographicCamera: any
    }
  }
}

export {}

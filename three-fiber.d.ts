/// <reference types="@react-three/fiber" />

import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Extend JSX to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      mesh: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      primitive: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { object: any }, HTMLElement>
      boxGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { args?: [number, number, number] }, HTMLElement>
      sphereGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { args?: [number, number, number] }, HTMLElement>
      planeGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { args?: [number, number] }, HTMLElement>
      cylinderGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { args?: [number, number, number] }, HTMLElement>
      meshStandardMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; metalness?: number; roughness?: number }, HTMLElement>
      meshBasicMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string }, HTMLElement>
      meshPhongMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string }, HTMLElement>
      ambientLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { intensity?: number }, HTMLElement>
      directionalLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { position?: [number, number, number]; intensity?: number }, HTMLElement>
      pointLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { position?: [number, number, number]; intensity?: number }, HTMLElement>
      spotLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { position?: [number, number, number]; intensity?: number }, HTMLElement>
      hemisphereLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { skyColor?: string; groundColor?: string; intensity?: number }, HTMLElement>
      perspectiveCamera: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { position?: [number, number, number]; fov?: number }, HTMLElement>
      orthographicCamera: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { position?: [number, number, number] }, HTMLElement>
    }
  }
}

export {}

import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { PerspectiveCamera } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { Vector3, Euler, Camera } from 'three'
import { useStore } from './store'

const Editor = () => {
  const { cameraDirection } = useStore()
  const cameraRef = useRef<Camera | null>(null)

  const MIN_DISTANCE = 5
  const MAX_DISTANCE = 20
  const SMOOTHING = 0.1

  const [smoothCameraPos, setSmoothCameraPos] = useState(new Vector3(...cameraDirection))

  // Load the .glb file using useGLTF hook
  const { scene } = useGLTF('/model.glb') // Replace with your actual file path

  useEffect(() => {
    if (cameraRef.current) {
      const cameraPos = new Vector3(...cameraDirection).multiply(new Vector3(...cameraDirection)).multiply(new Vector3(...cameraDirection))
      const direction = cameraPos.clone().normalize()

      // Ensure the distance is between MIN_DISTANCE and MAX_DISTANCE
      const distance = Math.max(MIN_DISTANCE, Math.min(cameraPos.length(), MAX_DISTANCE))
      
      // Set the direction of the camera without changing its Z position
      const newPos = direction.multiplyScalar(distance)

      // Apply Euler rotation: rotate the camera around both the X and Y axes
      const euler = new Euler(Math.PI / direction.x, Math.PI / direction.y, 0) // 15 degrees around X-axis and 30 degrees around Y-axis
      
      newPos.applyEuler(euler)

      // Smooth the camera's movement using lerpVectors
      setSmoothCameraPos((prevPos) => {
        const smoothedPos = new Vector3().lerpVectors(prevPos, newPos, SMOOTHING)
        return smoothedPos
      })
    }
  }, [cameraDirection])

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.copy(smoothCameraPos)
    }
  }, [smoothCameraPos])

  return (
    <Canvas style={{ position: 'absolute' }}>
      <ambientLight intensity={2} />
      
      {/* Perspective Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        fov={75}
        
        position={smoothCameraPos.toArray()}
        makeDefault
        near={0.1}
        far={1000}
      />

      {/* OrbitControls for rotating the camera */}
      <OrbitControls target={[0, 0, 0]} enableDamping={true} dampingFactor={0.25} />

      {/* Render the .glb model */}
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
    </Canvas>
  )
}

export default Editor

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const gridX = 100
const gridZ = 100
const count = gridX * gridZ

// Initialize buffers outside hook
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
const color = new THREE.Color()

for (let i = 0; i < gridX; i++) {
    for (let j = 0; j < gridZ; j++) {
        const index = i * gridZ + j
        
        // Centered grid
        positions[index * 3] = (i - gridX / 2) * 0.4
        positions[index * 3 + 1] = 0 // Y will be animated
        positions[index * 3 + 2] = (j - gridZ / 2) * 0.4
        
        // Default color (ocean blue/purple gradient)
        const depthHue = 0.55 + (j / gridZ) * 0.2
        color.setHSL(depthHue, 0.8, 0.5)
        colors[index * 3] = color.r
        colors[index * 3 + 1] = color.g
        colors[index * 3 + 2] = color.b
    }
}

const DigitalOcean = () => {
    const pointsRef = useRef()
    const mouse = useRef({ x: 0, y: 0 })
    const targetMouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Map mouse to a rough 3D coordinate space for the grid interaction
            targetMouse.current.x = (e.clientX / window.innerWidth) * 40 - 20
            targetMouse.current.y = -(e.clientY / window.innerHeight) * 40 + 20
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame((state) => {
        if (!pointsRef.current) return
        
        const time = state.clock.getElapsedTime()
        const posArray = pointsRef.current.geometry.attributes.position.array
        const colorArray = pointsRef.current.geometry.attributes.color.array

        // Smooth mouse following
        mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05
        mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05

        const tempColor = new THREE.Color()

        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridZ; j++) {
                const index = i * gridZ + j
                const i3 = index * 3

                const x = posArray[i3]
                const z = posArray[i3 + 2]

                // Distance from mouse in 2D space (X and simulated Z space)
                const dx = x - mouse.current.x
                const dz = z - mouse.current.y
                const dist = Math.sqrt(dx * dx + dz * dz)

                // Mathematically generate a base wave + interactive ripple
                // Base wave moves diagonally
                const baseWave = Math.sin(i * 0.1 + time * 2) * 0.5 + Math.cos(j * 0.1 + time * 1.5) * 0.5
                
                // Mouse drops a ripple effect
                let interactionWave = 0
                let energy = 0
                if (dist < 8) {
                    energy = (8 - dist) / 8
                    interactionWave = Math.sin(dist * 2 - time * 5) * energy * 1.5
                }
                
                // Update final Y position
                posArray[i3 + 1] = baseWave + interactionWave

                // Dynamic Colors based on height/energy
                const yHeight = posArray[i3 + 1]
                const hue = 0.55 + (j / gridZ) * 0.15 - (yHeight * 0.05)
                const lightness = 0.4 + (energy * 0.4) + (yHeight * 0.1)
                
                tempColor.setHSL(hue, 0.9, lightness)
                colorArray[i3] = tempColor.r
                colorArray[i3 + 1] = tempColor.g
                colorArray[i3 + 2] = tempColor.b
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
        pointsRef.current.geometry.attributes.color.needsUpdate = true
        
        // Gentle tilt movement based strictly on time
        pointsRef.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.2) * 0.1
        pointsRef.current.rotation.y = time * 0.05
    })

    return (
        <points ref={pointsRef} position={[0, -5, -15]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.15} 
                vertexColors={true} 
                transparent={true} 
                opacity={0.8} 
                sizeAttenuation={true} 
            />
        </points>
    )
}

const AuthBackground3D = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, #010214 0%, #08031a 100%)'
        }}>
            <Canvas camera={{ position: [0, 5, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <DigitalOcean />
            </Canvas>
        </div>
    )
}

export default AuthBackground3D

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

const AnimatedSphere = () => {
    const sphereRef = useRef()
    const materialRef = useRef()
    const [hovered, setHover] = useState(false)
    const [clicked, setClick] = useState(false)

    // Manage cursor style
    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
        return () => {
            document.body.style.cursor = 'auto'
        }
    }, [hovered])

    useFrame((state, delta) => {
        // Base rotation
        sphereRef.current.rotation.y += delta * 0.2
        sphereRef.current.rotation.x += delta * 0.1

        if (clicked) {
            sphereRef.current.rotation.y += delta * 2.0
            sphereRef.current.rotation.x += delta * 1.0
        }

        // Interpolate scale
        const targetScale = hovered ? 1.7 : 1.5
        sphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

        // Interpolate distort and speed
        if (materialRef.current) {
            const targetDistort = clicked ? 1.0 : (hovered ? 0.6 : 0.4)
            const targetSpeed = clicked ? 8 : (hovered ? 4 : 2)
            materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.1)
            materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.1)
            
            // Color changing
            const targetColor = new THREE.Color(clicked ? '#0095f6' : (hovered ? '#ff3040' : '#0095f6'))
            materialRef.current.color.lerp(targetColor, 0.1)
        }
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh 
                ref={sphereRef}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHover(true)
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    setHover(false)
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    setClick(!clicked)
                }}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    ref={materialRef}
                    color="#0095f6"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    )
}

const Hero3D = () => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Canvas camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <AnimatedSphere />
                <Environment preset="city" />
            </Canvas>
        </div>
    )
}

export default Hero3D

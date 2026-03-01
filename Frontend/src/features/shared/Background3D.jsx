import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Constants
const count = 3000

// Move state calculations out of React hooks to satisfy hook immutability linting
const particles = []
for (let i = 0; i < count; i++) {
    // Distribute densely in a wide horizontal disk/galaxy shape
    const radius = Math.random() * 15
    const angle = Math.random() * Math.PI * 2
    
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = (Math.random() - 0.5) * 2 
    
    particles.push({
        origX: x,
        origY: y,
        origZ: z,
        x, y, z,
        vx: 0, vy: 0, vz: 0,
        colorScale: Math.random()
    })
}

const dummy = new THREE.Object3D()
const colorsArr = new Float32Array(count * 3)

const QuantumField = () => {
    const meshRef = useRef()
    const { viewport } = useThree()
    const mouse = useRef({ x: 1000, y: 1000 }) // start offscreen

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.getElapsedTime()
        
        // Calculate interactive 3D position based on normalized mouse
        const mouseX = (mouse.current.x * viewport.width) / 2
        const mouseY = (mouse.current.y * viewport.height) / 2

        const colorObj = new THREE.Color()

        for (let i = 0; i < count; i++) {
            const p = particles[i]
            
            // Continuous flowing motion along the origin shape
            const angleTime = time * 0.2 + p.origX
            p.origY = Math.sin(angleTime) * 1.5 + Math.cos(time * 0.3 + p.origZ)

            // Convert to world space to check mouse collision
            // Account for the group rotation X
            const worldY = p.y * Math.cos(0.5) - p.z * Math.sin(0.5)
            const worldZ = p.y * Math.sin(0.5) + p.z * Math.cos(0.5)

            // Calculate distance to mouse
            const dx = p.x - mouseX
            const dy = worldY - mouseY
            const dz = worldZ - 0
            
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz)
            
            // Interactive Explode effect (Quantum Repulsion)
            const repelRadius = 3.5
            if (distance < repelRadius) {
                const force = (repelRadius - distance) / repelRadius
                // Push sharply away radially
                p.vx += (dx / distance) * force * 0.15
                p.vy += (dy / distance) * force * 0.15
                p.vz += (dz / distance) * force * 0.15
            }
            
            // Spring force: always trying to return to structural origin
            p.vx += (p.origX - p.x) * 0.04
            p.vy += (p.origY - p.y) * 0.04
            p.vz += (p.origZ - p.z) * 0.04

            // Heavy Friction / Dampening
            p.vx *= 0.85
            p.vy *= 0.85
            p.vz *= 0.85

            // Apply velocity
            p.x += p.vx
            p.y += p.vy
            p.z += p.vz

            // Render into instanced mesh dummy
            dummy.position.set(p.x, p.y, p.z)
            // Scale dynamically based on velocity (stretch/shrink effect)
            const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy + p.vz*p.vz)
            const scale = Math.max(0.2, 1 - speed * 4)
            dummy.scale.set(scale, scale, scale)
            dummy.updateMatrix()
            
            meshRef.current.setMatrixAt(i, dummy.matrix)

            // Dynamic core coloring: active particles glow hotter
            const heat = Math.min(1, speed * 8)
            
            // Shift hue dramatically when fast/hot (blue to purple/red)
            const hue = 0.55 + p.colorScale * 0.1 - heat * 0.4
            colorObj.setHSL(hue, 0.9, 0.4 + heat * 0.4)
            colorsArr[i * 3] = colorObj.r
            colorsArr[i * 3 + 1] = colorObj.g
            colorsArr[i * 3 + 2] = colorObj.b
        }

        meshRef.current.instanceMatrix.needsUpdate = true
        
        // This is safe to update manually if we track it closely
        if (meshRef.current.geometry.attributes.color) {
            meshRef.current.geometry.attributes.color.needsUpdate = true
        }
        
        // Gentle global rotation of entire system
        meshRef.current.rotation.x = 0.5 + Math.sin(time * 0.1) * 0.1
        meshRef.current.rotation.y = time * 0.05
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.08, 0]}>
                <instancedBufferAttribute attach="attributes-color" args={[colorsArr, 3]} />
            </dodecahedronGeometry>
            <meshStandardMaterial 
                vertexColors={true}
                roughness={0.2}
                metalness={0.8}
                emissiveIntensity={0.5}
            />
        </instancedMesh>
    )
}

const Background3D = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, #020005 0%, #0a0b10 100%)'
        }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <QuantumField />
            </Canvas>
        </div>
    )
}

export default Background3D

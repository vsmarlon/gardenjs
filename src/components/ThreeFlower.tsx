import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { generateRosePoints } from '../logic/roseMath'

function RosePoints() {
    const pointsRef = useRef<THREE.Points>(null)

    const { positions, colors } = useMemo(() => generateRosePoints(), [])

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                vertexColors
                transparent
                opacity={0.8}
                depthTest={true}
                sizeAttenuation={true}
            />
        </points>
    )
}

export default function ThreeFlower() {
    return (
        <div className="w-full h-60 md:h-90 relative">
            <Canvas gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 2, 8]} />
                <ambientLight intensity={1} />
                <RosePoints />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-rose-300/30 text-[10px] tracking-[0.4em] uppercase pointer-events-none italic font-medium">
                Sempre Florescendo • Arraste para Girar
            </div>
        </div>
    )
}

import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { generateRosePoints } from '../logic/roseMath'

function RosePoints() {
    const pointsRef = useRef<THREE.Points>(null)

    const { positions, colors } = useMemo(() => generateRosePoints(), [])

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        return geo
    }, [positions, colors])

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })

    return (
        <points ref={pointsRef} geometry={geometry}>
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

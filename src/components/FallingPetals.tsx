import { useMemo } from 'react'
import { PetalData } from '../types/animations'

function Petal({ left, size, duration, delay, drift, startRotation }: Omit<PetalData, 'id'>) {
    return (
        <div
            className="petal-fall absolute top-0 pointer-events-none"
            style={{
                left: `${left}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                '--drift': `${drift}px`,
            } as React.CSSProperties}
        >
            <svg
                width={size}
                height={size * 1.3}
                viewBox="0 0 30 40"
                fill="none"
                style={{ transform: `rotate(${startRotation}deg)` }}
            >
                <defs>
                    <radialGradient id={`pg-${left}`} cx="40%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#FF69B4" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#C71585" stopOpacity="0.5" />
                    </radialGradient>
                </defs>
                <path
                    d="M15 2 C8 8, 2 16, 4 26 C6 34, 12 38, 15 38 C18 38, 24 34, 26 26 C28 16, 22 8, 15 2Z"
                    fill={`url(#pg-${left})`}
                />
                <path
                    d="M15 6 C14 14, 13 22, 15 34"
                    stroke="#FF1493"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    fill="none"
                />
            </svg>
        </div>
    )
}

export default function FallingPetals() {
    const petals = useMemo<PetalData[]>(() =>
        Array.from({ length: 18 }, (_, i) => ({
            id: i,
            left: (i / 18) * 100 + (Math.random() - 0.5) * 10,
            size: 12 + Math.random() * 10,
            duration: 9 + Math.random() * 6,
            delay: Math.random() * 12,
            drift: (Math.random() - 0.5) * 120,
            startRotation: Math.random() * 360,
        })),
        [])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
            {petals.map(p => (
                <Petal key={p.id} {...p} />
            ))}
        </div>
    )
}

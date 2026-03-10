import { useMemo } from 'react'
import { generateRosePositions } from '../utils/positions'
import { RosePosition } from '../types/animations'

function Rose({ x, y, size, rotation, delay, duration }: Omit<RosePosition, 'id'>) {
    return (
        <div
            className="absolute transition-all duration-500 cursor-pointer group"
            style={{
                left: x,
                top: y,
                transform: `rotate(${rotation}deg)`,
                animation: `float ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 48 48"
                fill="none"
                className="transition-transform duration-300 group-hover:scale-150"
            >
                <defs>
                    <radialGradient id={`rg-${x}`} cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8B0045" stopOpacity="0.4" />
                    </radialGradient>
                </defs>
                <ellipse cx="24" cy="20" rx="10" ry="14" fill="#C71585" opacity="0.5" transform="rotate(-30 24 24)" />
                <ellipse cx="24" cy="20" rx="10" ry="14" fill="#C71585" opacity="0.5" transform="rotate(30 24 24)" />
                <ellipse cx="24" cy="20" rx="10" ry="14" fill="#C71585" opacity="0.4" transform="rotate(-60 24 24)" />
                <ellipse cx="24" cy="20" rx="10" ry="14" fill="#C71585" opacity="0.4" transform="rotate(60 24 24)" />
                <circle cx="24" cy="22" r="7" fill={`url(#rg-${x})`} />
                <circle cx="24" cy="22" r="4" fill="#FF69B4" opacity="0.6" />
                <circle cx="24" cy="22" r="2" fill="#FFB6C1" opacity="0.8" />
            </svg>
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    )
}

export default function BackgroundRoses() {
    const roses = useMemo(() => generateRosePositions(20), [])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {roses.map(rose => (
                <div key={rose.id} className="pointer-events-auto">
                    <Rose {...rose} />
                </div>
            ))}
        </div>
    )
}

import { RosePosition } from '../types/animations'

/**
 * Generate background rose positions using a grid-based approach.
 * Divides viewport into cells and places one rose per cell with jitter.
 * O(n) — no retry loops.
 */
export function generateRosePositions(count: number): RosePosition[] {
    const cols = Math.ceil(Math.sqrt(count * 1.5))
    const rows = Math.ceil(count / cols)
    const cellW = 100 / cols
    const cellH = 100 / rows
    const roses: RosePosition[] = []

    for (let r = 0; r < rows && roses.length < count; r++) {
        for (let c = 0; c < cols && roses.length < count; c++) {
            const jitterX = (Math.random() - 0.5) * cellW * 0.8
            const jitterY = (Math.random() - 0.5) * cellH * 0.8
            const x = cellW * (c + 0.5) + jitterX
            const y = cellH * (r + 0.5) + jitterY

            roses.push({
                id: roses.length,
                x: `${Math.max(1, Math.min(98, x))}%`,
                y: `${Math.max(1, Math.min(98, y))}%`,
                size: 24 + Math.random() * 20,
                rotation: Math.random() * 60 - 30,
                delay: Math.random() * 3,
                duration: 5 + Math.random() * 3,
            })
        }
    }

    return roses
}

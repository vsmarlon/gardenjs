import { describe, it, expect } from 'vitest'
import { generateRosePoints } from '../logic/roseMath'

describe('roseMath', () => {
    describe('generateRosePoints', () => {
        it('returns positions and colors arrays', () => {
            const result = generateRosePoints()
            expect(result).toHaveProperty('positions')
            expect(result).toHaveProperty('colors')
        })

        it('returns Float32Array for positions', () => {
            const { positions } = generateRosePoints()
            expect(positions).toBeInstanceOf(Float32Array)
        })

        it('returns Float32Array for colors', () => {
            const { colors } = generateRosePoints()
            expect(colors).toBeInstanceOf(Float32Array)
        })

        it('positions array length is divisible by 3 (x, y, z)', () => {
            const { positions } = generateRosePoints()
            expect(positions.length % 3).toBe(0)
        })

        it('colors array length matches positions/3 * 3 (r, g, b)', () => {
            const { positions, colors } = generateRosePoints()
            const vertexCount = positions.length / 3
            expect(colors.length).toBe(vertexCount * 3)
        })

        it('positions are not all zeros', () => {
            const { positions } = generateRosePoints()
            const sum = positions.reduce((acc, val) => acc + val, 0)
            expect(sum).not.toBe(0)
        })

        it('has non-zero colors', () => {
            const { colors } = generateRosePoints()
            const sum = colors.reduce((acc, val) => acc + val, 0)
            expect(sum).toBeGreaterThan(0)
        })

        it('accepts custom factor', () => {
            const result1 = generateRosePoints(1.5)
            const result2 = generateRosePoints(2.0)
            
            // Different factors should produce different results
            expect(result1.positions).not.toEqual(result2.positions)
        })

        it('generates valid rose shape (positive values in reasonable range)', () => {
            const { positions } = generateRosePoints()
            
            // Check that values are in reasonable range for a rose
            for (let i = 0; i < positions.length; i++) {
                expect(positions[i]).toBeLessThan(5) // Not too large
                expect(positions[i]).toBeGreaterThan(-5) // Not too small
            }
        })

        it('generates red-ish colors', () => {
            const { colors } = generateRosePoints()
            
            // Red channel should be dominant
            let redSum = 0
            let greenSum = 0
            let blueSum = 0
            
            for (let i = 0; i < colors.length; i += 3) {
                redSum += colors[i]
                greenSum += colors[i + 1]
                blueSum += colors[i + 2]
            }
            
            // Red should be significantly higher than green and blue for a rose
            expect(redSum).toBeGreaterThan(greenSum * 2)
            expect(redSum).toBeGreaterThan(blueSum * 2)
        })
    })
})

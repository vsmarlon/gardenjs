import { describe, it, expect } from 'vitest'
import { 
    ROWS, COLS, FLOWER_TYPES, PLANT_COST, SELL_PRICES, BOUQUET_MIN,
    RARITY_COLORS, FLOWER_RARITY, RARITY_CHANCE, getRandomRarity, RARITY_BONUS,
    SHOP_ITEMS
} from '../constants/garden'

describe('garden constants', () => {
    describe('grid dimensions', () => {
        it('has correct row count', () => {
            expect(ROWS).toBe(6)
        })

        it('has correct column count', () => {
            expect(COLS).toBe(10)
        })
    })

    describe('FLOWER_TYPES', () => {
        it('contains all expected flower types', () => {
            expect(FLOWER_TYPES).toContain('rose')
            expect(FLOWER_TYPES).toContain('tulip')
            expect(FLOWER_TYPES).toContain('sunflower')
            expect(FLOWER_TYPES).toContain('daisy')
            expect(FLOWER_TYPES).toContain('cherry')
        })

        it('has 5 flower types', () => {
            expect(FLOWER_TYPES).toHaveLength(5)
        })
    })

    describe('PLANT_COST', () => {
        it('costs 5 coins to plant', () => {
            expect(PLANT_COST).toBe(5)
        })
    })

    describe('SELL_PRICES', () => {
        it('has sell prices for all flowers', () => {
            FLOWER_TYPES.forEach(flower => {
                expect(SELL_PRICES[flower]).toBeDefined()
                expect(typeof SELL_PRICES[flower]).toBe('number')
            })
        })

        it('cherry has highest sell price', () => {
            expect(SELL_PRICES.cherry).toBeGreaterThan(SELL_PRICES.rose)
            expect(SELL_PRICES.cherry).toBeGreaterThan(SELL_PRICES.tulip)
            expect(SELL_PRICES.cherry).toBeGreaterThan(SELL_PRICES.sunflower)
            expect(SELL_PRICES.cherry).toBeGreaterThan(SELL_PRICES.daisy)
        })

        it('daisy has lowest sell price', () => {
            expect(SELL_PRICES.daisy).toBeLessThan(SELL_PRICES.rose)
            expect(SELL_PRICES.daisy).toBeLessThan(SELL_PRICES.tulip)
            expect(SELL_PRICES.daisy).toBeLessThan(SELL_PRICES.sunflower)
            expect(SELL_PRICES.daisy).toBeLessThan(SELL_PRICES.cherry)
        })
    })

    describe('BOUQUET_MIN', () => {
        it('requires minimum 3 flowers for bouquet', () => {
            expect(BOUQUET_MIN).toBe(3)
        })
    })

    describe('RARITY_COLORS', () => {
        it('has colors for all rarities', () => {
            expect(RARITY_COLORS.common).toBeDefined()
            expect(RARITY_COLORS.uncommon).toBeDefined()
            expect(RARITY_COLORS.rare).toBeDefined()
            expect(RARITY_COLORS.epic).toBeDefined()
            expect(RARITY_COLORS.legendary).toBeDefined()
        })

        it('legendary has golden color', () => {
            expect(RARITY_COLORS.legendary).toBe('#F59E0B')
        })
    })

    describe('FLOWER_RARITY', () => {
        it('rose is rare', () => {
            expect(FLOWER_RARITY.rose).toBe('rare')
        })

        it('cherry is legendary', () => {
            expect(FLOWER_RARITY.cherry).toBe('legendary')
        })

        it('tulip is common', () => {
            expect(FLOWER_RARITY.tulip).toBe('common')
        })
    })

    describe('RARITY_CHANCE', () => {
        it('chances add up to 1', () => {
            const total = RARITY_CHANCE.reduce((sum, r) => sum + r.chance, 0)
            expect(total).toBe(1)
        })

        it('common has highest chance', () => {
            const commonChance = RARITY_CHANCE.find(r => r.rarity === 'common')?.chance
            RARITY_CHANCE.forEach(r => {
                if (r.rarity !== 'common') {
                    expect(commonChance).toBeGreaterThan(r.chance)
                }
            })
        })
    })

    describe('getRandomRarity', () => {
        it('returns a valid rarity', () => {
            const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']
            for (let i = 0; i < 100; i++) {
                const rarity = getRandomRarity()
                expect(validRarities).toContain(rarity)
            }
        })

        it('mostly returns common', () => {
            const results: Record<string, number> = {}
            for (let i = 0; i < 1000; i++) {
                const rarity = getRandomRarity()
                results[rarity] = (results[rarity] || 0) + 1
            }
            expect(results.common).toBeGreaterThan(results.uncommon)
            expect(results.common).toBeGreaterThan(results.rare)
        })
    })

    describe('RARITY_BONUS', () => {
        it('common has no bonus', () => {
            expect(RARITY_BONUS.common).toBe(1)
        })

        it('legendary has highest bonus', () => {
            expect(RARITY_BONUS.legendary).toBe(5)
            expect(RARITY_BONUS.legendary).toBeGreaterThan(RARITY_BONUS.epic)
            expect(RARITY_BONUS.legendary).toBeGreaterThan(RARITY_BONUS.rare)
        })

        it('bonuses increase with rarity', () => {
            expect(RARITY_BONUS.uncommon).toBeGreaterThan(RARITY_BONUS.common)
            expect(RARITY_BONUS.rare).toBeGreaterThan(RARITY_BONUS.uncommon)
            expect(RARITY_BONUS.epic).toBeGreaterThan(RARITY_BONUS.rare)
            expect(RARITY_BONUS.legendary).toBeGreaterThan(RARITY_BONUS.epic)
        })
    })

    describe('SHOP_ITEMS', () => {
        it('has items for sale', () => {
            expect(SHOP_ITEMS.length).toBeGreaterThan(0)
        })

        it('all items have required properties', () => {
            SHOP_ITEMS.forEach(item => {
                expect(item.id).toBeDefined()
                expect(item.name).toBeDefined()
                expect(item.description).toBeDefined()
                expect(item.price).toBeDefined()
                expect(item.type).toBeDefined()
                expect(item.effect).toBeDefined()
            })
        })

        it('all items have positive prices', () => {
            SHOP_ITEMS.forEach(item => {
                expect(item.price).toBeGreaterThan(0)
            })
        })

        it('has seed packs', () => {
            const seedPacks = SHOP_ITEMS.filter(item => item.type === 'seed_pack')
            expect(seedPacks.length).toBeGreaterThan(0)
        })

        it('has fertilizer', () => {
            const fertilizer = SHOP_ITEMS.find(item => item.id === 'fertilizer')
            expect(fertilizer).toBeDefined()
        })

        it('has charm', () => {
            const charm = SHOP_ITEMS.find(item => item.type === 'charm')
            expect(charm).toBeDefined()
        })
    })
})

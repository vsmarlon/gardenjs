import { describe, it, expect } from 'vitest'
import { gardenReducer, createEmptyGrid, randomFlower, initialState } from '../logic/gardenReducer'
import { GardenState, FlowerType } from '../types/garden'

describe('gardenReducer', () => {
    describe('createEmptyGrid', () => {
        it('creates a grid with 6 rows', () => {
            const grid = createEmptyGrid()
            expect(grid).toHaveLength(6)
        })

        it('creates each row with 10 columns', () => {
            const grid = createEmptyGrid()
            grid.forEach(row => {
                expect(row).toHaveLength(10)
            })
        })

        it('initializes all cells as empty', () => {
            const grid = createEmptyGrid()
            grid.forEach(row => {
                row.forEach(cell => {
                    expect(cell.stage).toBe('empty')
                    expect(cell.type).toBeNull()
                    expect(cell.wateredCount).toBe(0)
                })
            })
        })
    })

    describe('randomFlower', () => {
        it('returns a valid flower type', () => {
            const flowerTypes: FlowerType[] = ['rose', 'tulip', 'sunflower', 'daisy', 'cherry']
            const flower = randomFlower()
            expect(flowerTypes).toContain(flower)
        })
    })

    describe('SELECT_TOOL', () => {
        it('changes selected tool', () => {
            const state: GardenState = { ...initialState, selectedTool: 'plant' }
            const newState = gardenReducer(state, { type: 'SELECT_TOOL', tool: 'water' })
            expect(newState.selectedTool).toBe('water')
        })

        it('clears message when changing tool', () => {
            const state: GardenState = { ...initialState, message: 'Some message' }
            const newState = gardenReducer(state, { type: 'SELECT_TOOL', tool: 'water' })
            expect(newState.message).toBe('')
        })
    })

    describe('CLICK_CELL - plant', () => {
        it('plants a seed when tool is plant and cell is empty', () => {
            const state: GardenState = { ...initialState, coins: 10, selectedTool: 'plant' }
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            
            expect(newState.grid[0][0].stage).toBe('seed')
            expect(newState.grid[0][0].type).not.toBeNull()
            expect(newState.coins).toBe(5) // 10 - 5 (plant cost)
        })

        it('does not plant when cell is not empty', () => {
            const grid = createEmptyGrid()
            grid[0][0] = { stage: 'seed', type: 'rose', wateredCount: 0 }
            const state: GardenState = { ...initialState, grid, selectedTool: 'plant' }
            
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.message).toBe('Já tem algo plantado aqui!')
        })

        it('does not plant when insufficient coins', () => {
            const state: GardenState = { ...initialState, coins: 0, selectedTool: 'plant' }
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.message).toBe('Você precisa de 5 moedas!')
        })
    })

    describe('CLICK_CELL - water', () => {
        it('waters a planted seed', () => {
            const grid = createEmptyGrid()
            grid[0][0] = { stage: 'seed', type: 'rose', wateredCount: 0 }
            const state: GardenState = { ...initialState, grid, selectedTool: 'water' }
            
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.grid[0][0].wateredCount).toBe(1)
        })

        it('does not water empty cells', () => {
            const state: GardenState = { ...initialState, selectedTool: 'water' }
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.message).toBe('Nada pra regar aqui!')
        })

        it('does not water bloomed flowers', () => {
            const grid = createEmptyGrid()
            grid[0][0] = { stage: 'bloom', type: 'rose', wateredCount: 5 }
            const state: GardenState = { ...initialState, grid, selectedTool: 'water' }
            
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.message).toBe('Já está florida!')
        })

        it('grows seed to sprout after enough water', () => {
            const grid = createEmptyGrid()
            grid[0][0] = { stage: 'seed', type: 'rose', wateredCount: 0, rarity: 'common' }
            const state: GardenState = { ...initialState, grid, selectedTool: 'water' }
            
            // First water
            let newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            // Second water (needs 2 for common)
            newState = gardenReducer(newState, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.grid[0][0].stage).toBe('sprout')
        })
    })

    describe('CLICK_CELL - harvest', () => {
        it('harvests a bloomed flower', () => {
            const grid = createEmptyGrid()
            grid[0][0] = { stage: 'bloom', type: 'rose', wateredCount: 5, rarity: 'common' }
            const state: GardenState = { ...initialState, grid, selectedTool: 'harvest' }
            
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.grid[0][0].stage).toBe('empty')
            expect(newState.inventory.rose).toBe(1)
        })

        it('does not harvest non-bloomed flowers', () => {
            const grid = createEmptyGrid()
            grid[0][0] = { stage: 'seed', type: 'rose', wateredCount: 0 }
            const state: GardenState = { ...initialState, grid, selectedTool: 'harvest' }
            
            const newState = gardenReducer(state, { type: 'CLICK_CELL', row: 0, col: 0 })
            expect(newState.message).toBe('Só pode colher flores prontas!')
        })
    })

    describe('SELL_FLOWER', () => {
        it('sells a flower and adds coins', () => {
            const inventory = { rose: 1, tulip: 0, sunflower: 0, daisy: 0, cherry: 0 }
            const state: GardenState = { ...initialState, inventory, coins: 0 }
            
            const newState = gardenReducer(state, { type: 'SELL_FLOWER', flower: 'rose' })
            expect(newState.inventory.rose).toBe(0)
            expect(newState.coins).toBe(15) // rose sell price
        })

        it('does not sell when inventory is empty', () => {
            const inventory = { rose: 0, tulip: 0, sunflower: 0, daisy: 0, cherry: 0 }
            const state: GardenState = { ...initialState, inventory }
            
            const newState = gardenReducer(state, { type: 'SELL_FLOWER', flower: 'rose' })
            expect(newState.message).toBe('Sem rose pra vender!')
        })
    })

    describe('MAKE_BOUQUET', () => {
        it('creates a bouquet with minimum flowers', () => {
            const inventory = { rose: 3, tulip: 0, sunflower: 0, daisy: 0, cherry: 0 }
            const state: GardenState = { ...initialState, inventory }
            
            const newState = gardenReducer(state, { type: 'MAKE_BOUQUET' })
            expect(newState.bouquets).toHaveLength(1)
            expect(newState.showBouquetModal).toBe(true)
        })

        it('does not create bouquet with insufficient flowers', () => {
            const inventory = { rose: 2, tulip: 0, sunflower: 0, daisy: 0, cherry: 0 }
            const state: GardenState = { ...initialState, inventory }
            
            const newState = gardenReducer(state, { type: 'MAKE_BOUQUET' })
            expect(newState.message).toBe('Precisa de pelo menos 3 flores!')
        })
    })

    describe('TOGGLE_MODALS', () => {
        it('toggles bouquet modal', () => {
            const state: GardenState = { ...initialState, showBouquetModal: false }
            const newState = gardenReducer(state, { type: 'TOGGLE_BOUQUET_MODAL' })
            expect(newState.showBouquetModal).toBe(true)
        })

        it('toggles sell modal', () => {
            const state: GardenState = { ...initialState, showSellModal: false }
            const newState = gardenReducer(state, { type: 'TOGGLE_SELL_MODAL' })
            expect(newState.showSellModal).toBe(true)
        })

        it('toggles shop modal', () => {
            const state: GardenState = { ...initialState, showShopModal: false }
            const newState = gardenReducer(state, { type: 'TOGGLE_SHOP_MODAL' })
            expect(newState.showShopModal).toBe(true)
        })
    })

    describe('BUY_ITEM', () => {
        it('buys seed pack', () => {
            const state: GardenState = { ...initialState, coins: 50 }
            const newState = gardenReducer(state, { type: 'BUY_ITEM', itemId: 'seeds_small' })
            
            expect(newState.coins).toBe(30) // 50 - 20
            const totalFlowers = Object.values(newState.inventory).reduce((a, b) => a + b, 0)
            expect(totalFlowers).toBe(5)
        })

        it('does not buy with insufficient coins', () => {
            const state: GardenState = { ...initialState, coins: 10 }
            const newState = gardenReducer(state, { type: 'BUY_ITEM', itemId: 'seeds_small' })
            expect(newState.message).toBe('Moedas insuficientes!')
        })
    })

    describe('CLEAR_MESSAGE', () => {
        it('clears the message', () => {
            const state: GardenState = { ...initialState, message: 'Test message' }
            const newState = gardenReducer(state, { type: 'CLEAR_MESSAGE' })
            expect(newState.message).toBe('')
        })
    })
})

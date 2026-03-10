import { GardenState, GardenAction, CellState, GrowthStage, FlowerType } from '../types/garden'
import { ROWS, COLS, FLOWER_TYPES, PLANT_COST, SELL_PRICES, BOUQUET_MIN } from '../constants/garden'

export function createEmptyGrid(): CellState[][] {
    return Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => ({
            stage: 'empty' as GrowthStage,
            type: null,
            wateredCount: 0,
        }))
    )
}

export function randomFlower(): FlowerType {
    return FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)]
}

export function gardenReducer(state: GardenState, action: GardenAction): GardenState {
    switch (action.type) {
        case 'SELECT_TOOL':
            return { ...state, selectedTool: action.tool, message: '' }

        case 'CLICK_CELL': {
            const { row, col } = action
            const cell = state.grid[row][col]
            const newGrid = state.grid.map(r => r.map(c => ({ ...c })))

            switch (state.selectedTool) {
                case 'plant': {
                    if (cell.stage !== 'empty') return { ...state, message: 'Já tem algo plantado aqui!' }
                    if (state.coins < PLANT_COST) return { ...state, message: `Você precisa de ${PLANT_COST} moedas!` }
                    const type = randomFlower()
                    newGrid[row][col] = { stage: 'seed', type, wateredCount: 0 }
                    return { ...state, grid: newGrid, coins: state.coins - PLANT_COST, message: `Plantou uma semente de ${type}!` }
                }
                case 'water': {
                    if (cell.stage === 'empty') return { ...state, message: 'Nada pra regar aqui!' }
                    if (cell.stage === 'bloom') return { ...state, message: 'Já está florida!' }
                    const newCount = cell.wateredCount + 1
                    let newStage = cell.stage as GrowthStage
                    if (cell.stage === 'seed' && newCount >= 2) newStage = 'sprout'
                    else if (cell.stage === 'sprout' && newCount >= 4) newStage = 'bloom'
                    newGrid[row][col] = { ...cell, stage: newStage, wateredCount: newCount }
                    return {
                        ...state,
                        grid: newGrid,
                        message: newStage !== cell.stage
                            ? `A flor cresceu! Agora é ${newStage === 'sprout' ? 'um broto' : 'uma flor'}!`
                            : 'Regou a plantinha!',
                    }
                }
                case 'harvest': {
                    if (cell.stage !== 'bloom') return { ...state, message: 'Só pode colher flores prontas!' }
                    const flowerType = cell.type!
                    newGrid[row][col] = { stage: 'empty', type: null, wateredCount: 0 }
                    return {
                        ...state,
                        grid: newGrid,
                        inventory: { ...state.inventory, [flowerType]: state.inventory[flowerType] + 1 },
                        message: `Colheu uma ${flowerType}!`,
                    }
                }
                default:
                    return state
            }
        }

        case 'SELL_FLOWER': {
            const flower = action.flower
            if (state.inventory[flower] <= 0) return { ...state, message: `Sem ${flower} pra vender!` }
            return {
                ...state,
                inventory: { ...state.inventory, [flower]: state.inventory[flower] - 1 },
                coins: state.coins + SELL_PRICES[flower],
                message: `Vendeu uma ${flower} por ${SELL_PRICES[flower]} moedas!`,
            }
        }

        case 'MAKE_BOUQUET': {
            const totalFlowers = Object.values(state.inventory).reduce((s, n) => s + n, 0)
            if (totalFlowers < BOUQUET_MIN)
                return { ...state, message: `Precisa de pelo menos ${BOUQUET_MIN} flores!` }
            const bouquetFlowers: FlowerType[] = []
            const newInv = { ...state.inventory }
            for (const flower of FLOWER_TYPES) {
                while (newInv[flower] > 0 && bouquetFlowers.length < 5) {
                    newInv[flower]--
                    bouquetFlowers.push(flower)
                }
            }
            return {
                ...state,
                inventory: newInv,
                bouquets: [...state.bouquets, bouquetFlowers],
                showBouquetModal: true,
                message: 'Criou um buquê lindo!',
            }
        }

        case 'TOGGLE_BOUQUET_MODAL':
            return { ...state, showBouquetModal: !state.showBouquetModal }

        case 'CLEAR_MESSAGE':
            return { ...state, message: '' }

        default:
            return state
    }
}

export const initialState: GardenState = {
    grid: createEmptyGrid(),
    inventory: { rose: 0, tulip: 0, sunflower: 0, daisy: 0, cherry: 0 },
    coins: 50,
    selectedTool: 'plant',
    bouquets: [],
    showBouquetModal: false,
    message: '',
}

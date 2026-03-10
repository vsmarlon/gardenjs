import { GardenState, GardenAction, CellState, GrowthStage, FlowerType } from '../types/garden'
import { ROWS, COLS, FLOWER_TYPES, PLANT_COST, SELL_PRICES, BOUQUET_MIN, getRandomRarity, RARITY_BONUS } from '../constants/garden'

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

function triggerRandomEvent(cell: CellState): CellState {
    const rand = Math.random()
    if (rand < 0.05 && cell.stage !== 'empty' && cell.stage !== 'bloom') {
        return { ...cell, hasButterfly: true }
    } else if (rand > 0.95 && cell.stage !== 'empty' && cell.stage !== 'bloom') {
        return { ...cell, hasWorm: true }
    }
    return cell
}

function applyEventEffects(cell: CellState): { wateredCount: number; message: string } {
    let wateredCount = cell.wateredCount
    let message = ''

    if (cell.hasButterfly) {
        wateredCount += 2
        message = 'Uma borboleta ajudou a flor a crescer!'
    } else if (cell.hasWorm) {
        wateredCount = Math.max(0, wateredCount - 1)
        message = 'Um verme atacou a flor!'
    }

    return { wateredCount, message }
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
                    const rarity = getRandomRarity()
                    newGrid[row][col] = { stage: 'seed', type, wateredCount: 0, rarity }
                    const rarityText = rarity !== 'common' ? ` (${rarity})` : ''
                    return { ...state, grid: newGrid, coins: state.coins - PLANT_COST, message: `Plantou uma semente de ${type}${rarityText}!` }
                }
                case 'water': {
                    if (cell.stage === 'empty') return { ...state, message: 'Nada pra regar aqui!' }
                    if (cell.stage === 'bloom') return { ...state, message: 'Já está florida!' }

                    const eventCell = triggerRandomEvent(cell)
                    const { wateredCount: eventCount, message: eventMessage } = applyEventEffects(eventCell)
                    
                    const newCount = eventCount + 1
                    let newStage = cell.stage as GrowthStage
                    const bonus = cell.rarity ? RARITY_BONUS[cell.rarity] : 1
                    const waterNeeded = Math.ceil(2 / bonus)
                    const waterNeededSprout = Math.ceil(4 / bonus)

                    if (cell.stage === 'seed' && newCount >= waterNeeded) newStage = 'sprout'
                    else if (cell.stage === 'sprout' && newCount >= waterNeededSprout) newStage = 'bloom'
                    
                    newGrid[row][col] = { ...eventCell, stage: newStage, wateredCount: newCount }
                    
                    let message = eventMessage || 'Regou a plantinha!'
                    if (newStage !== cell.stage) {
                        const rarityText = cell.rarity && cell.rarity !== 'common' ? ` ${cell.rarity}` : ''
                        message = `A flor cresceu! Agora é ${newStage === 'sprout' ? 'um broto' : 'uma flor'}${rarityText}!`
                    }
                    
                    return { ...state, grid: newGrid, message }
                }
                case 'harvest': {
                    if (cell.stage !== 'bloom') return { ...state, message: 'Só pode colher flores prontas!' }
                    const flowerType = cell.type!
                    const rarity = cell.rarity || 'common'
                    const bonus = RARITY_BONUS[rarity]
                    const amount = Math.ceil(bonus)
                    const rarityText = rarity !== 'common' ? ` (${rarity} +${bonus - 1} extra!)` : ''
                    
                    newGrid[row][col] = { stage: 'empty', type: null, wateredCount: 0 }
                    return {
                        ...state,
                        grid: newGrid,
                        inventory: { ...state.inventory, [flowerType]: state.inventory[flowerType] + amount },
                        message: `Colheu ${amount}x ${flowerType}${rarityText}!`,
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

        case 'TOGGLE_SELL_MODAL':
            return { ...state, showSellModal: !state.showSellModal }

        case 'LOAD_STATE':
            return { ...action.state }

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
    showSellModal: false,
    message: '',
    lastSaved: Date.now(),
    day: 1,
    streak: 0,
}

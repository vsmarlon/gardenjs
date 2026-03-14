import { Rarity } from '../constants/garden'

export type FlowerType = 'rose' | 'tulip' | 'sunflower' | 'daisy' | 'cherry'
export type GrowthStage = 'empty' | 'seed' | 'sprout' | 'bloom'
export type Tool = 'plant' | 'water' | 'harvest' | 'sell' | 'bouquet'

export interface CellState {
    stage: GrowthStage
    type: FlowerType | null
    wateredCount: number
    rarity?: Rarity
    hasButterfly?: boolean
    hasWorm?: boolean
}

export interface GardenState {
    grid: CellState[][]
    inventory: Record<FlowerType, number>
    coins: number
    selectedTool: Tool
    bouquets: FlowerType[][]
    showBouquetModal: boolean
    showSellModal: boolean
    showShopModal: boolean
    message: string
    lastSaved: number
    day: number
    streak: number
    activeCharm: boolean
}

export type GardenAction =
    | { type: 'SELECT_TOOL'; tool: Tool }
    | { type: 'CLICK_CELL'; row: number; col: number }
    | { type: 'SELL_FLOWER'; flower: FlowerType }
    | { type: 'MAKE_BOUQUET' }
    | { type: 'TOGGLE_BOUQUET_MODAL' }
    | { type: 'TOGGLE_SELL_MODAL' }
    | { type: 'TOGGLE_SHOP_MODAL' }
    | { type: 'BUY_ITEM'; itemId: string }
    | { type: 'USE_FERTILIZER' }
    | { type: 'USE_WATER_BOOST' }
    | { type: 'CLEAR_MESSAGE' }
    | { type: 'LOAD_STATE'; state: GardenState }

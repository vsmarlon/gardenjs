export type FlowerType = 'rose' | 'tulip' | 'sunflower' | 'daisy' | 'cherry'
export type GrowthStage = 'empty' | 'seed' | 'sprout' | 'bloom'
export type Tool = 'plant' | 'water' | 'harvest' | 'sell' | 'bouquet'

export interface CellState {
    stage: GrowthStage
    type: FlowerType | null
    wateredCount: number
}

export interface GardenState {
    grid: CellState[][]
    inventory: Record<FlowerType, number>
    coins: number
    selectedTool: Tool
    bouquets: FlowerType[][]
    showBouquetModal: boolean
    message: string
}

export type GardenAction =
    | { type: 'SELECT_TOOL'; tool: Tool }
    | { type: 'CLICK_CELL'; row: number; col: number }
    | { type: 'SELL_FLOWER'; flower: FlowerType }
    | { type: 'MAKE_BOUQUET' }
    | { type: 'TOGGLE_BOUQUET_MODAL' }
    | { type: 'CLEAR_MESSAGE' }

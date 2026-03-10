import { FlowerType } from '../types/garden'

export const ROWS = 6
export const COLS = 10
export const FLOWER_TYPES: FlowerType[] = ['rose', 'tulip', 'sunflower', 'daisy', 'cherry']
export const PLANT_COST = 5
export const SELL_PRICES: Record<FlowerType, number> = {
    rose: 15,
    tulip: 10,
    sunflower: 12,
    daisy: 8,
    cherry: 20,
}
export const BOUQUET_MIN = 3

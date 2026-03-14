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

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export const RARITY_COLORS: Record<Rarity, string> = {
    common: '#9CA3AF',
    uncommon: '#22C55E',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B',
}

export const FLOWER_RARITY: Record<FlowerType, Rarity> = {
    rose: 'rare',
    tulip: 'common',
    sunflower: 'uncommon',
    daisy: 'common',
    cherry: 'legendary',
}

export const RARITY_CHANCE: { rarity: Rarity; chance: number }[] = [
    { rarity: 'common', chance: 0.5 },
    { rarity: 'uncommon', chance: 0.25 },
    { rarity: 'rare', chance: 0.15 },
    { rarity: 'epic', chance: 0.08 },
    { rarity: 'legendary', chance: 0.02 },
]

export function getRandomRarity(): Rarity {
    const rand = Math.random()
    let cumulative = 0
    for (const { rarity, chance } of RARITY_CHANCE) {
        cumulative += chance
        if (rand <= cumulative) return rarity
    }
    return 'common'
}

export const RARITY_BONUS: Record<Rarity, number> = {
    common: 1,
    uncommon: 1.5,
    rare: 2,
    epic: 3,
    legendary: 5,
}

export interface ShopItem {
    id: string
    name: string
    description: string
    price: number
    type: 'seed_pack' | 'fertilizer' | 'charm' | 'expand'
    effect: number
}

export const SHOP_ITEMS: ShopItem[] = [
    { id: 'seeds_small', name: 'Pacote de Sementes', description: '5 sementes aleatórias', price: 20, type: 'seed_pack', effect: 5 },
    { id: 'seeds_large', name: 'Grande Pacote', description: '15 sementes aleatórias', price: 50, type: 'seed_pack', effect: 15 },
    { id: 'fertilizer', name: 'Fertilizante', description: ' Faz todas as flores crescerem +1 estágio', price: 30, type: 'fertilizer', effect: 1 },
    { id: 'charm_love', name: 'Amuleto do Amor', description: '+50% chance de raridade épica/legendária (1 dia)', price: 100, type: 'charm', effect: 1 },
    { id: 'water_boost', name: 'Água Mágica', description: 'Rega todas as plantas de uma vez', price: 15, type: 'fertilizer', effect: 999 },
]

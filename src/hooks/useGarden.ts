import { useReducer, useCallback, useEffect } from 'react'
import { GardenState, GardenAction, Tool } from '../types/garden'
import { gardenReducer, initialState } from '../logic/gardenReducer'

const STORAGE_KEY = 'garden-state'

function loadState(): GardenState {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            const parsed = JSON.parse(saved)
            const now = Date.now()
            const dayMs = 24 * 60 * 60 * 1000
            const lastSaved = parsed.lastSaved || now
            const daysPassed = Math.floor((now - lastSaved) / dayMs)
            
            let streak = parsed.streak || 0
            let day = parsed.day || 1
            let coins = parsed.coins
            let message = parsed.message || ''

            if (daysPassed > 0) {
                if (daysPassed === 1 && streak > 0) {
                    streak += 1
                    day += 1
                    coins += 10 + (streak * 5)
                    message = `Bem-vindo de volta! Dia ${day} - Bonus de login: +${10 + (streak * 5)} moedas! (Sequencia: ${streak})`
                } else if (daysPassed > 1) {
                    streak = 1
                    day += 1
                    coins += 15
                    message = `Novo dia! Bonus de login: +15 moedas!`
                }
            }

            return {
                ...parsed,
                lastSaved: now,
                streak,
                day,
                coins,
                message,
            }
        }
    } catch (e) {
        console.error('Failed to load garden state:', e)
    }
    return { ...initialState, lastSaved: Date.now() }
}

function saveState(state: GardenState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...state,
            lastSaved: Date.now(),
            showBouquetModal: false,
            showSellModal: false,
            showShopModal: false,
            message: '',
        }))
    } catch (e) {
        console.error('Failed to save garden state:', e)
    }
}

export function useGarden() {
    const [state, dispatch] = useReducer(gardenReducer, null, loadState)

    useEffect(() => {
        saveState(state)
    }, [state])

    useEffect(() => {
        if (state.message) {
            const timer = setTimeout(() => {
                dispatch({ type: 'CLEAR_MESSAGE' })
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [state.message])

    const selectTool = useCallback((tool: Tool) => {
        dispatch({ type: 'SELECT_TOOL', tool })
    }, [])

    const clickCell = useCallback((row: number, col: number) => {
        dispatch({ type: 'CLICK_CELL', row, col })
    }, [])

    const sellFlower = useCallback((flower: any) => {
        dispatch({ type: 'SELL_FLOWER', flower })
    }, [])

    const makeBouquet = useCallback(() => {
        dispatch({ type: 'MAKE_BOUQUET' })
    }, [])

    const toggleBouquetModal = useCallback(() => {
        dispatch({ type: 'TOGGLE_BOUQUET_MODAL' })
    }, [])

    const toggleSellModal = useCallback(() => {
        dispatch({ type: 'TOGGLE_SELL_MODAL' })
    }, [])

    const toggleShopModal = useCallback(() => {
        dispatch({ type: 'TOGGLE_SHOP_MODAL' })
    }, [])

    const buyItem = useCallback((itemId: string) => {
        dispatch({ type: 'BUY_ITEM', itemId })
    }, [])

    const clearMessage = useCallback(() => {
        dispatch({ type: 'CLEAR_MESSAGE' })
    }, [])

    return {
        state,
        selectTool,
        clickCell,
        sellFlower,
        makeBouquet,
        toggleBouquetModal,
        toggleSellModal,
        toggleShopModal,
        buyItem,
        clearMessage,
    }
}

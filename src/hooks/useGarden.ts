import { Action, useReducer, useCallback } from 'react'
import { GardenState, GardenAction, Tool } from '../types/garden'
import { gardenReducer, initialState } from '../logic/gardenReducer'

export function useGarden() {
    const [state, dispatch] = useReducer(gardenReducer, initialState)

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
        clearMessage,
    }
}

import { useGarden } from '../hooks/useGarden'
import { GrowthStage, Tool, FlowerType } from '../types/garden'
import { FLOWER_TYPES, COLS, SELL_PRICES } from '../constants/garden'
import '../styles/garden.css'
import {
    SeedSprite, SproutSprite, RoseSprite, TulipSprite, SunflowerSprite, DaisySprite, CherrySprite,
    PlantIcon, WaterIcon, ShovelIcon, SellIcon, BouquetIcon, CoinIcon
} from './FlowerSprites'

const FLOWER_SPRITES: Record<FlowerType, Record<GrowthStage, React.ReactNode>> = {
    rose: { empty: null, seed: <SeedSprite />, sprout: <SproutSprite />, bloom: <RoseSprite /> },
    tulip: { empty: null, seed: <SeedSprite />, sprout: <SproutSprite />, bloom: <TulipSprite /> },
    sunflower: { empty: null, seed: <SeedSprite />, sprout: <SproutSprite />, bloom: <SunflowerSprite /> },
    daisy: { empty: null, seed: <SeedSprite />, sprout: <SproutSprite />, bloom: <DaisySprite /> },
    cherry: { empty: null, seed: <SeedSprite />, sprout: <SproutSprite />, bloom: <CherrySprite /> },
}

const TOOL_INFO: Record<Tool, { icon: React.ReactNode; label: string }> = {
    plant: { icon: <PlantIcon />, label: 'Plantar' },
    water: { icon: <WaterIcon />, label: 'Regar' },
    harvest: { icon: <ShovelIcon />, label: 'Colher' },
    sell: { icon: <SellIcon />, label: 'Vender' },
    bouquet: { icon: <BouquetIcon />, label: 'Buquê' },
}

export default function PixelGarden() {
    const {
        state,
        selectTool,
        clickCell,
        sellFlower,
        makeBouquet,
        toggleBouquetModal
    } = useGarden()

    const totalFlowers = Object.values(state.inventory).reduce((s, n) => s + n, 0)
    const latestBouquet = state.bouquets[state.bouquets.length - 1]

    return (
        <section id="garden" className={`py-16 px-4 relative flex flex-col items-center w-full max-w-5xl mx-auto ${state.showBouquetModal ? 'z-[1001]' : 'z-20'}`}>
            <h2 className="text-3xl md:text-5xl text-center text-rose-300 mb-6 tracking-wide">
                Meu Jardim de Flores
            </h2>
            <p className="text-center text-rose-200/50 mb-12 text-base">
                Plante, regue e colha flores para montar um buquê
            </p>

            <div className="w-full max-w-3xl mb-4 flex items-center justify-center gap-4 flex-wrap">
                <div className="garden-status-bar">
                    <span className="text-yellow-300 font-bold flex items-center gap-1">
                        <CoinIcon /> {state.coins}
                    </span>
                    <span className="text-rose-300 flex items-center gap-1">
                        <div className="w-4 h-4"><RoseSprite /></div> {totalFlowers} flores
                    </span>
                    <span className="text-purple-300 flex items-center gap-1">
                        <BouquetIcon /> {state.bouquets.length} buquês
                    </span>
                </div>

                <div className="w-full h-8" />

                {state.message && (
                    <p className="garden-message">{state.message}</p>
                )}
            </div>

            <div className="w-full h-8" />

            <div className="w-full max-w-3xl mb-4 flex items-center justify-center gap-2 flex-wrap">
                {(Object.keys(TOOL_INFO) as Tool[]).map(tool => (
                    <button
                        key={tool}
                        onClick={() => {
                            if (tool === 'bouquet') {
                                makeBouquet()
                            } else if (tool === 'sell') {
                                toggleBouquetModal()
                            } else {
                                selectTool(tool)
                            }
                        }}
                        className={`garden-tool-btn ${state.selectedTool === tool && tool !== 'bouquet' && tool !== 'sell' ? 'active' : ''}`}
                    >
                        <span className="tool-icon-wrapper">{TOOL_INFO[tool].icon}</span>
                        <span className="text-xs">{TOOL_INFO[tool].label}</span>
                    </button>
                ))}
            </div>

            <div className="w-full h-12" />

            <div className="w-full max-w-5xl overflow-x-auto flex justify-center">
                <div className="garden-grid">
                    <div className="garden-soil-label">
                        {Array.from({ length: COLS }, (_, i) => (
                            <div key={i} className="garden-soil-block">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="#5D4037"><rect width="24" height="24" /></svg>
                            </div>
                        ))}
                    </div>

                    {state.grid.map((row, ri) => (
                        <div key={ri} className="garden-row">
                            {row.map((cell, ci) => {
                                const sprite = cell.type
                                    ? FLOWER_SPRITES[cell.type][cell.stage]
                                    : ''
                                return (
                                    <button
                                        key={`${ri}-${ci}`}
                                        onClick={() => clickCell(ri, ci)}
                                        className={`garden-cell ${cell.stage !== 'empty' ? 'garden-cell-planted' : ''} ${cell.stage === 'bloom' ? 'garden-cell-bloom' : ''}`}
                                        title={cell.type ? `${cell.type} (Estágio: ${cell.stage})` : 'Vazio'}
                                    >
                                        <div className="sprite-wrapper">
                                            {sprite || <span className="garden-cell-dot">·</span>}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    ))}

                    <div className="garden-grass">
                        {Array.from({ length: COLS }, (_, i) => (
                            <div key={i} className="garden-grass-block">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="#2E7D32"><path d="M12 2v20M12 22l-4-4M12 22l4-4" /></svg>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {state.showBouquetModal && (
                <div className="garden-modal-overlay" onClick={toggleBouquetModal}>
                    <div className="garden-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl text-rose-300 mb-4 text-center">
                            {latestBouquet ? 'Seu Buquê!' : 'Vender Flores'}
                        </h3>

                        {latestBouquet && (
                            <div className="bouquet-display">
                                {latestBouquet.map((f, i) => (
                                    <div key={i} className="bouquet-flower">
                                        {FLOWER_SPRITES[f].bloom}
                                    </div>
                                ))}
                                <p className="text-rose-200/70 mt-3 text-sm text-center">
                                    Um buquê feito com amor para Vitória
                                </p>
                            </div>
                        )}

                        {!latestBouquet && (
                            <div className="sell-panel">
                                {FLOWER_TYPES.map(flower => (
                                    <div key={flower} className="sell-row">
                                        <div className="sell-icon-wrapper">{FLOWER_SPRITES[flower].bloom}</div>
                                        <span className="text-rose-200/70 flex-1 capitalize">{flower}</span>
                                        <span className="text-rose-300">x{state.inventory[flower]}</span>
                                        <button
                                            className="sell-btn flex items-center gap-1"
                                            disabled={state.inventory[flower] <= 0}
                                            onClick={() => sellFlower(flower)}
                                        >
                                            Vender (+{SELL_PRICES[flower]} <CoinIcon />)
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="garden-modal-close"
                            onClick={toggleBouquetModal}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}

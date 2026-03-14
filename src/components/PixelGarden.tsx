import { useGarden } from '../hooks/useGarden'
import { GrowthStage, Tool, FlowerType } from '../types/garden'
import { FLOWER_TYPES, COLS, SELL_PRICES, SHOP_ITEMS } from '../constants/garden'
import '../styles/garden.css'
import {
    SeedSprite, SproutSprite, RoseSprite, TulipSprite, SunflowerSprite, DaisySprite, CherrySprite,
    PlantIcon, WaterIcon, ShovelIcon, SellIcon, BouquetIcon, CoinIcon, ShopIcon
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
        toggleBouquetModal,
        toggleSellModal,
        toggleShopModal,
        buyItem
    } = useGarden()

    const totalFlowers = Object.values(state.inventory).reduce((s, n) => s + n, 0)
    const latestBouquet = state.bouquets[state.bouquets.length - 1]

    return (
        <section id="garden" className={`py-16 px-4 relative flex flex-col items-center w-full max-w-5xl mx-auto ${state.showBouquetModal || state.showSellModal || state.showShopModal ? 'z-[1001]' : 'z-20'}`}>
            <h2 className="text-3xl md:text-5xl text-center text-rose-300 mb-6 tracking-wide">
                Meu Jardim de Flores
            </h2>
            <p className="text-center text-rose-200/50 mb-12 text-base">
                Plante, regue e colha flores para montar um buquê
            </p>

            <div className="w-full max-w-3xl mb-4 flex items-center justify-center gap-4 flex-wrap">
                <div className="garden-status-bar items-center">
                    <span className="text-yellow-300 font-bold flex items-center gap-1">
                        <CoinIcon /> {state.coins}
                    </span>
                    <span className="text-rose-300 flex items-center gap-1">
                        <div className="w-4 h-4"><RoseSprite /></div> {totalFlowers} flores
                    </span>
                    <span className="text-purple-300 flex items-center gap-1">
                        <BouquetIcon /> {state.bouquets.length} buquês
                    </span>
                    <span className="text-emerald-300 text-xs self-center">Dia {state.day}</span>
                    <button
                        onClick={toggleShopModal}
                        className="ml-2 px-3 py-1 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 rounded-full text-amber-300 text-xs flex items-center gap-1 transition-all"
                    >
                        <ShopIcon /> Loja
                    </button>
                </div>
            </div>

            <div className="garden-message-container min-h-[40px] w-full flex justify-center items-center mb-6">
                {state.message && (
                    <p className="garden-message py-2 px-4">{state.message}</p>
                )}
            </div>

            <div className="w-full max-w-3xl mb-4 flex items-center justify-center gap-2 flex-wrap">
                {(Object.keys(TOOL_INFO) as Tool[]).map(tool => (
                    <button
                        key={tool}
                        onClick={() => {
                            if (tool === 'bouquet') {
                                makeBouquet()
                            } else if (tool === 'sell') {
                                toggleSellModal()
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
                            Seu Buquê!
                        </h3>

                        <div className="bouquet-display">
                            {latestBouquet && latestBouquet.map((f, i) => (
                                <div key={i} className="bouquet-flower">
                                    {FLOWER_SPRITES[f].bloom}
                                </div>
                            ))}
                            <p className="text-rose-200/70 mt-3 text-sm text-center">
                                Um buquê feito com amor para Vitória
                            </p>
                        </div>

                        <button
                            className="garden-modal-close"
                            onClick={toggleBouquetModal}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {state.showSellModal && (
                <div className="garden-modal-overlay" onClick={toggleSellModal}>
                    <div className="garden-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl text-rose-300 mb-4 text-center">
                            Vender Flores
                        </h3>

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

                        <button
                            className="garden-modal-close"
                            onClick={toggleSellModal}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {state.showShopModal && (
                <div className="garden-modal-overlay" onClick={toggleShopModal}>
                    <div className="garden-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl text-amber-300 mb-4 text-center">
                            🏪 Loja
                        </h3>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {SHOP_ITEMS.map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-amber-900/20 p-3 rounded-lg border border-amber-500/20">
                                    <div>
                                        <p className="text-rose-200 font-medium">{item.name}</p>
                                        <p className="text-rose-200/50 text-xs">{item.description}</p>
                                    </div>
                                    <button
                                        className="sell-btn flex items-center gap-1 bg-amber-600/30 hover:bg-amber-600/50 border-amber-500/30"
                                        disabled={state.coins < item.price}
                                        onClick={() => buyItem(item.id)}
                                    >
                                        <CoinIcon /> {item.price}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            className="garden-modal-close mt-4"
                            onClick={toggleShopModal}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}

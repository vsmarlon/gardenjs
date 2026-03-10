import FallingPetals from './components/FallingPetals'
import BackgroundRoses from './components/BackgroundRoses'
import HeroSection from './components/HeroSection'
import PixelGarden from './components/PixelGarden'
import FlowerCarousel from './components/FlowerCarousel'
import RoseShowcase from './components/RoseShowcase'
import ApologyFooter from './components/ApologyFooter'

export default function App() {
    return (
        <main className="min-h-screen selection:bg-rose-500/30 overflow-x-hidden w-full max-w-[100vw]">
            <FallingPetals />
            <BackgroundRoses />

            <div className="relative z-10 flex flex-col gap-32 py-12 items-center w-full max-w-[100vw] overflow-x-hidden">
                <HeroSection />
                <PixelGarden />
                <FlowerCarousel />
                <RoseShowcase />
                <ApologyFooter />
            </div>
        </main>
    )
}

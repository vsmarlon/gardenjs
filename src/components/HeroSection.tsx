import ThreeFlower from './ThreeFlower'

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-32 z-20 w-full max-w-5xl mx-auto"
        >
            <div className="text-center w-full hero-entrance flex flex-col items-center">
                <p className="text-rose-400/60 text-lg md:text-xl tracking-[0.3em] uppercase mb-8">
                    Um pedido especial
                </p>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 drop-shadow-lg mb-12 leading-tight font-serif italic">
                    Desculpa, Vitória
                </h1>

                <div className="w-full max-w-4xl mx-auto mb-16 scale-110">
                    <ThreeFlower />
                </div>

                <p className="text-xl md:text-2xl text-rose-200/70 leading-relaxed mb-4 max-w-2xl">
                    Eu sei que esqueci das flores no Dia Internacional da Mulher...
                </p>
                <p className="text-lg md:text-xl text-rose-100/50 mb-16">
                    Mas nunca vou esquecer de te amar
                </p>

                <a
                    href="#garden"
                    className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xl font-bold tracking-wide hover:from-rose-500 hover:to-pink-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-rose-500/25 border border-rose-400/20"
                >
                    Plantar flores pra você
                </a>
            </div>
        </section>
    )
}

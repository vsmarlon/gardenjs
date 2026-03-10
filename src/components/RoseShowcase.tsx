import vitoriaImg from '../assets/bebe.jpg'

export default function RoseShowcase() {
    return (
        <section className="py-20 px-4 relative z-20">
            <h2 className="text-3xl md:text-5xl text-center text-rose-300 mb-3 tracking-wide">
                A Minha Rosa
            </h2>
            <p className="text-center text-rose-200/40 mb-10 text-sm">
                Uma rosa para a mulher mais especial da minha vida
            </p>

            <div className="flex justify-center">
                <div className="relative group cursor-pointer">
                    <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/30 to-pink-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative">
                        <img
                            src={vitoriaImg}
                            alt="Rosa para Vitória"
                            className="w-52 h-52 md:w-72 md:h-72 object-cover rounded-full border-4 border-rose-500/20 shadow-2xl relative z-10"
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-rose-400/30 animate-pulse-slow" />
                    </div>
                </div>
            </div>
        </section>
    )
}

import { useState, useEffect, useRef } from 'react'

export default function ApologyFooter() {
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.3 },
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return (
        <footer className="py-16 px-4 relative z-20 flex flex-col items-center">
            <div
                ref={ref}
                className={`apology-card max-w-2xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 invisible'}`}
            >
                <h3 className="text-2xl md:text-3xl text-rose-300 mb-6 text-center">
                    Pedido de Desculpas
                </h3>
                <div className="space-y-4 text-center">
                    <p className="text-base md:text-lg text-rose-100/70 leading-relaxed">
                        Vitória, meu amor,
                    </p>
                    <p className="text-base md:text-lg text-rose-100/60 leading-relaxed">
                        Eu sei que te decepcionei ao esquecer das flores no Dia Internacional da Mulher.
                        Você merece o mundo inteiro e muito mais.
                        Que este pequeno gesto mostre o quanto você significa para mim.
                    </p>
                    <p className="text-base md:text-lg text-rose-100/60 leading-relaxed">
                        Te amo mais do que qualquer flor no mundo.
                    </p>
                    <p className="text-lg text-rose-400 mt-6 font-semibold">
                        Para sempre seu
                    </p>
                </div>
            </div>

            <p className="text-center text-rose-500/30 mt-12 text-sm tracking-wide">
                Feito com amor especialmente para Vitória
            </p>
        </footer>
    )
}

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { ASCII_FLOWERS } from '../data/asciiFlowers'
export default function FlowerCarousel() {
    const allSlides = [
        ...ASCII_FLOWERS.map(f => ({ type: 'ascii' as const, data: f })),
    ]

    return (
        <section className="py-20 px-4 relative z-20 w-full max-w-7xl mx-auto overflow-hidden">
            <h2 className="text-3xl md:text-5xl text-center text-rose-300 mb-3 tracking-wide">
                Galeria de Flores
            </h2>
            <p className="text-center text-rose-200/40 mb-10 text-sm tracking-widest uppercase">
                Deslize para ver mais
            </p>

            <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 28 },
                }}
                className="max-w-6xl mx-auto pb-14"
            >
                {allSlides.map((slide, index) => (
                    <SwiperSlide key={`slide-${index}`}>
                        <div className="carousel-card flex flex-col items-center justify-between p-8 h-[450px]">
                            <div className="flex-1 flex items-center justify-center w-full overflow-hidden mb-4">
                                {slide.type === 'ascii' ? (
                                    <pre className="ascii-flower text-rose-400/80 text-xs md:text-sm leading-tight text-center">
                                        {(slide.data as any).art}
                                    </pre>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img
                                            src={(slide.data as any).url}
                                            alt={slide.data.name}
                                            loading="lazy"
                                            className="w-full h-full max-h-[250px] object-cover rounded-xl shadow-xl"
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-rose-200/60 text-lg font-medium">{slide.data.name}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

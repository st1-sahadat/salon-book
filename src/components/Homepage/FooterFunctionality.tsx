"use client"
import { useState } from "react";
import Footer1 from "./Footer1";
import Footer2 from "./Footer2";

const slides = [
    <Footer1 key="footer-1" />,
    <Footer2 key="footer-2" />,
];
const FooterFunctionality = () => {
    const [activeSlide, setActiveSlide] = useState(0);
        const previousSlide = () => {
            setActiveSlide((current) => (current === 0 ? slides.length - 1 : current - 1));
        };
        const nextSlide = () => {
            setActiveSlide((current) => (current === slides.length - 1 ? 0 : current + 1));
        };
    return (
        <section className='container mx-auto' aria-label="Salon gallery" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%' }}>
                {slides[activeSlide]}
            </div>

            <div
                aria-label="Gallery pagination"
                style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '24px',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous salon image"
                    style={{ width: '44px', height: '44px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '50%', background: 'white', cursor: 'pointer', fontSize: '20px' }}
                >
                    ‹
                </button>

                {slides.map((slide, index) => (
                    <button
                        key={slide.key}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Show salon image ${index + 1}`}
                        aria-current={activeSlide === index ? 'true' : undefined}
                        style={{
                            width: '44px',
                            height: '44px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: '50%',
                            background: activeSlide === index ? '#111827' : 'white',
                            color: activeSlide === index ? 'white' : '#111827',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next salon image"
                    style={{ width: '44px', height: '44px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '50%', background: 'white', cursor: 'pointer', fontSize: '20px' }}
                >
                    ›
                </button>
            </div>
        </section>
    );
};

export default FooterFunctionality;
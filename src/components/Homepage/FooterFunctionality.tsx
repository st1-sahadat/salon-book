"use client";
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

  const arrowClass =
    "grid h-9 w-9 place-items-center rounded-full text-[18px] leading-none text-[#22301F] transition-colors hover:bg-[#22301F]/10";

  return (
    <section className="relative w-full" aria-label="Footer designs">
      <div>{slides[activeSlide]}</div>

      <div
        aria-label="Footer style pagination"
        className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#22301F]/15 bg-[#F6F1E8]/95 p-1.5 shadow-[0_18px_40px_-20px_rgba(34,48,31,0.55)] backdrop-blur-md"
      >
        <button type="button" onClick={previousSlide} aria-label="Previous footer style" className={arrowClass}>
          ‹
        </button>

        {slides.map((slide, index) => {
          const isActive = activeSlide === index;

          return (
            <button
              key={slide.key}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show footer style ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              aria-pressed={isActive}
              className={`grid h-9 min-w-9 place-items-center rounded-full px-2.5 text-[12px] font-semibold tracking-wide transition-colors ${
                isActive
                  ? "bg-[#2E4634] text-[#F6F1E8]"
                  : "text-[#6B5F52] hover:bg-[#2E4634]/10 hover:text-[#22301F]"
              }`}
            >
              {index + 1}
            </button>
          );
        })}

        <button type="button" onClick={nextSlide} aria-label="Next footer style" className={arrowClass}>
          ›
        </button>
      </div>
    </section>
  );
};

export default FooterFunctionality;

"use client";

import { useState } from "react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface TestimonialsSpotlightProps {
  testimonials: Testimonial[];
}

/**
 * Odak (spotlight) efekti: ortadaki/aktif yorum net ve öne çıkık,
 * diğerleri bulanık ve soluk. Bir karta tıklayınca odak ona geçer.
 * Mobilde tüm kartlar normal/okunur (blur yalnızca md+ ekranlarda).
 */
export default function TestimonialsSpotlight({ testimonials }: TestimonialsSpotlightProps) {
  const middleIndex = Math.floor(testimonials.length / 2);
  const [activeIndex, setActiveIndex] = useState(middleIndex);

  return (
    <div className="relative mt-12">
      {/* Aktif kartın arkasında yumuşak odak ışıması */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[30rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/50 blur-3xl" />

      <div className="relative grid gap-6 md:grid-cols-3 md:items-center">
        {testimonials.map((testimonial, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              type="button"
              key={testimonial.name}
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
              aria-label={`${testimonial.name} yorumunu odakla`}
              className={`text-left transition-all duration-500 ease-out focus:outline-none ${
                isActive
                  ? "md:z-10 md:scale-105 md:opacity-100 md:blur-0"
                  : "md:scale-90 md:opacity-45 md:blur-[3px] md:hover:opacity-75 md:hover:blur-[1px]"
              }`}
            >
              <figure
                className={`flex h-full flex-col rounded-2xl border bg-white p-7 transition-shadow ${
                  isActive
                    ? "border-brand-200 shadow-xl shadow-brand-100"
                    : "border-ink-200 shadow-sm"
                }`}
              >
                <div className="flex gap-1 text-brand-500">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <svg key={starIndex} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-ink-100 pt-4">
                  <p className="text-sm font-semibold text-ink-900">{testimonial.name}</p>
                  <p className="text-xs text-ink-500">{testimonial.role}</p>
                </figcaption>
              </figure>
            </button>
          );
        })}
      </div>

      {/* Odak göstergeleri */}
      <div className="mt-8 flex justify-center gap-2.5">
        {testimonials.map((testimonial, index) => (
          <button
            type="button"
            key={testimonial.name}
            onClick={() => setActiveIndex(index)}
            aria-label={`${index + 1}. yoruma geç`}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-brand-600" : "w-2 bg-ink-300 hover:bg-ink-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

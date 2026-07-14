"use client";

import { useEffect, useRef } from "react";

export interface TimelineStep {
  day: string;
  title: string;
  description: string;
  deliverable?: string;
}

interface SetupTimelineProps {
  steps: TimelineStep[];
}

/**
 * Scroll ile ilerleyen kurulum zaman çizelgesi.
 * Dikey progress hattı GSAP ScrollTrigger scrub ile dolar,
 * adım kartları görünürlüğe girince aktifleşir.
 */
export default function SetupTimeline({ steps }: SetupTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    if (!container || !progress) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      progress.style.transform = "scaleY(1)";
      container
        .querySelectorAll<HTMLElement>("[data-timeline-step]")
        .forEach((el) => el.classList.add("is-active"));
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // GSAP'ı yalnızca istemcide, ihtiyaç anında yükle (bundle bütçesi)
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, stModule]) => {
        if (cancelled) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = stModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          gsap.fromTo(
            progress,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top 65%",
                end: "bottom 60%",
                scrub: 0.6,
              },
            }
          );

          container
            .querySelectorAll<HTMLElement>("[data-timeline-step]")
            .forEach((el) => {
              ScrollTrigger.create({
                trigger: el,
                start: "top 72%",
                onEnter: () => el.classList.add("is-active"),
                onLeaveBack: () => el.classList.remove("is-active"),
              });
            });
        }, container);

        cleanup = () => ctx.revert();
      }
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Zemin hattı */}
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-ink-200 sm:left-1/2 sm:-ml-px" />
      {/* Dolan progress hattı */}
      <div
        ref={progressRef}
        className="absolute left-[19px] top-2 bottom-2 w-0.5 origin-top bg-gradient-to-b from-brand-500 via-brand-600 to-meta sm:left-1/2 sm:-ml-px"
        style={{ transform: "scaleY(0)" }}
      />

      <ol className="space-y-10 sm:space-y-14">
        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <li
              key={step.day}
              data-timeline-step
              className="group relative pl-14 opacity-60 transition-all duration-500 [&.is-active]:opacity-100 sm:grid sm:grid-cols-2 sm:gap-12 sm:pl-0"
            >
              {/* Nokta */}
              <span className="absolute left-[11px] top-1.5 flex h-[18px] w-[18px] items-center justify-center sm:left-1/2 sm:-ml-[9px]">
                <span className="absolute h-full w-full rounded-full bg-brand-500/30 transition-transform duration-500 group-[.is-active]:animate-ping-soft" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-ink-300 transition-colors duration-500 group-[.is-active]:bg-brand-600" />
              </span>

              <div
                className={`${
                  isLeft
                    ? "sm:col-start-1 sm:pr-4 sm:text-right"
                    : "sm:col-start-2 sm:pl-4"
                } translate-y-4 transition-all duration-500 group-[.is-active]:translate-y-0`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                  {step.day}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {step.description}
                </p>
                {step.deliverable && (
                  <p
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {step.deliverable}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

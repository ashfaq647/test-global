"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Logos reuse the Hero card SVGs; logoW / logoH are the Figma sizes for this section
// (Hero size x 1.636), in px at the 1920px reference.
const companies = [
  {
    id: 1,
    name: "Way-Wise Tech",
    text: "Complete IT & Software Solutions. A global software development company specializing in custom software, web and mobile applications, and IT services.",
    logo: "/images/cards/tech.svg",
    logoW: 180,
    logoH: 103,
    href: "https://waywisetech.com/", // TODO: Tech website URL
  },
  {
    id: 2,
    name: "Way-Wise Trading",
    text: "TODO: write the Way-Wise Trading description here. It shows 2 lines and then ...", // TODO
    logo: "/images/cards/trading.svg",
    logoW: 180,
    logoH: 128,
    href: "https://waywisetrading.com/", // TODO: Trading website URL
  },
  {
    id: 3,
    name: "Jobs @ Way-Wise",
    text: "TODO: write the Jobs @ Way-Wise description here. It shows 2 lines and then ...", // TODO
    logo: "/images/cards/jobs.svg",
    logoW: 245,
    logoH: 56,
    href: "https://waywisejobs.com/", // TODO: Jobs website URL
  },
  {
    id: 4,
    name: "Pother Bazar",
    text: "TODO: write the Pother Bazar description here. It shows 2 lines and then ...", // TODO
    logo: "/images/cards/pother-bazar.svg",
    logoW: 196,
    logoH: 121,
    href: "https://www.potherbazar.com/", // TODO: Pother Bazar website URL
  },
];

const AUTO_PLAY_MS = 3000;

// One slide step = card width + column gap, measured so it holds at every scale
function getStep(el) {
  const card = el.firstElementChild;
  if (!card) return 0;
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
  return card.offsetWidth + gap;
}

function ChevronButton({ direction, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous company" : "Next company"}
      className="flex size-10 items-center justify-center rounded-full border border-white transition-opacity disabled:opacity-30"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
        <path
          d={direction === "left" ? "M12 5l-5 5 5 5" : "M8 5l5 5-5 5"}
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function Companies() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false); // true while mouse is on the cards / finger is touching
  const inViewRef = useRef(false); // true while the section is visible on screen

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [autoKey, setAutoKey] = useState(0); // change this number to restart the auto-slide timer

  function updateButtons() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  function scrollByStep(direction) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * getStep(el), behavior: "smooth" });
    setAutoKey((k) => k + 1); // user used the arrows -> restart the timer
  }

  // ---------- Auto slide ----------
  useEffect(() => {
    const el = trackRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    // Respect "reduce motion" setting of the visitor's device
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only slide while the section is on screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.4 }
    );
    observer.observe(section);

    const timer = setInterval(() => {
      if (pausedRef.current || !inViewRef.current || document.hidden) return;

      const reachedEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (reachedEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" }); // go back to the first card
      } else {
        el.scrollBy({ left: getStep(el), behavior: "smooth" });
      }
    }, AUTO_PLAY_MS);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [autoKey]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <section ref={sectionRef} id="companies" className="overflow-hidden bg-[url('/images/companies-bg.png')] bg-cover bg-center text-white">
      <div className="mx-auto flex max-w-[120rem] flex-col gap-12 px-6 py-10 sm:py-20 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-[6vw] lg:px-16 xl:gap-[7.5rem] xl:px-[15.625rem] xl:py-[7.5rem]">
        {/* ---------- Left: text + arrows ---------- */}
        <div className="flex w-full shrink-0 flex-col gap-10 min-[1100px]:w-[40%] xl:w-[35.3125rem]">
          <div className="flex flex-col gap-[1.875rem]">
            <h2 className="font-oxanium text-4xl font-bold leading-tight md:text-[3.125rem] md:leading-[3.75rem]">
              A Diverse Group of <span className="text-[#b80100]">Specialized Companies</span>
            </h2>
            <p className="font-poppins text-base text-[#b2b2b2] min-[1100px]:text-[max(1.125rem,15px)]">
              Each company operates with focused expertise while benefiting from the shared vision,
              leadership and global resources of Way Wise Global. Each company operates with
              focused expertise while benefiting from the shared vision, leadership and global
              resources of Way Wise Global.
            </p>
          </div>

          <div className="flex items-center gap-[0.875rem]">
            <ChevronButton direction="left" onClick={() => scrollByStep(-1)} disabled={atStart} />
            <ChevronButton direction="right" onClick={() => scrollByStep(1)} disabled={atEnd} />
          </div>
        </div>

        {/* Negative right margin matches the container padding so the track bleeds to the edge;
            the same right padding stops the last card at the content edge instead of the screen edge */}
        <div
          ref={trackRef}
          onScroll={updateButtons}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          onFocus={pause}
          onBlur={resume}
          className="flex min-w-0 flex-1 snap-x snap-mandatory gap-8 overflow-x-auto [scrollbar-width:none] -mr-6 pr-6 lg:-mr-16 lg:pr-16 xl:-mr-[15.625rem] xl:gap-[7.5rem] xl:pr-[15.625rem] [&::-webkit-scrollbar]:hidden"
        >
          {companies.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${c.name}`}
              className="group flex w-[min(30rem,85vw)] shrink-0 snap-start flex-col gap-[1.875rem] outline-none"
            >
              <div className="flex h-[16.25rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-[#101010]/50 transition-[background-color,border-color] duration-300 ease-out group-hover:border-transparent group-hover:bg-[#b80000] group-focus-visible:border-transparent group-focus-visible:bg-[#b80000] sm:h-[20.625rem]">
                {/* Inner logo box: 356 x 216 in Figma (= 74.17% x 65.45% of the card) */}
                <div className="flex h-[65.45%] w-[74.17%] items-center justify-center rounded-[0.625rem] bg-white/10 shadow-[inset_0_0.0625rem_0.0625rem_rgba(255,255,255,0.25),inset_0_0_0_0.0625rem_rgba(255,255,255,0.08)] backdrop-blur-[0.25rem] transition-colors duration-300 ease-out group-hover:bg-transparent group-focus-visible:bg-transparent">
                  <Image
                    src={c.logo}
                    alt={`${c.name} logo`}
                    width={c.logoW}
                    height={c.logoH}
                    className="h-auto max-w-[85%]"
                    style={{ width: `${c.logoW / 16}rem` }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-6">
                {/* Left bar is a before: element that scales away (smooth), not an animated border width */}
               <div className="relative flex min-w-0 flex-1 flex-col gap-2 pl-6 transition-[padding-left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:origin-left before:bg-white/50 before:transition-[transform,opacity] before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pl-0 group-hover:before:scale-x-0 group-hover:before:opacity-0 group-focus-visible:pl-0 group-focus-visible:before:scale-x-0 group-focus-visible:before:opacity-0">
                  <h3 className="whitespace-nowrap font-oxanium text-xl font-medium sm:text-2xl leading-[normal] text-white transition-colors duration-300 ease-out group-hover:text-[#e00000] group-focus-visible:text-[#e00000]">
                    {c.name}
                  </h3>
                  <p className="line-clamp-2 max-w-[23.9375rem] font-poppins text-[max(1rem,14px)] leading-[normal] text-[#b2b2b2]">
                    {c.text}
                  </p>
                </div>

                <span className="flex shrink-0 items-center rounded-full border border-white p-2 text-white transition-colors duration-300 ease-out group-hover:border-[#e00000] group-hover:bg-[#e00000] group-focus-visible:border-[#e00000] group-focus-visible:bg-[#e00000]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
                    <path
                      d="M7 17L17 7M9 7h8v8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
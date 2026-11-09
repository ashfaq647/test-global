"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PartnerWithUsLink } from "@/components/PartnerWithUs";

// `smooth` = scrolled with the custom animation below (slower / softer than the browser default)
const links = [
  { label: "Home", href: "/", active: true, smooth: true },
  { label: "Our Companies", href: "#companies", dropdown: true },
  { label: "About Us", href: "#about", smooth: true },
  { label: "Services", href: "#companies" },
  { label: "Contact", href: "#footer", smooth: true },
];

let cancelScroll = null;

// Animate the page to `top`. Duration grows with distance (950ms–1900ms) and uses an
// ease-in-out curve. Each frame scrolls with behavior "instant" so the CSS
// `scroll-behavior: smooth` in globals.css doesn't fight the animation.
function smoothScrollTo(top) {
  cancelScroll?.();
  const start = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = Math.max(0, Math.min(top, max));
  const distance = target - start;

  if (
    Math.abs(distance) < 1 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    window.scrollTo({ top: target, behavior: "instant" });
    return;
  }

  const duration = Math.min(1900, Math.max(950, 600 + Math.abs(distance) * 0.35));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  let startTime = null;
  let frame;

  // stop if the user scrolls / touches the page themselves
  const stop = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    cancelScroll = null;
  };
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  cancelScroll = stop;

  const step = (now) => {
    if (startTime === null) startTime = now;
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo({ top: start + distance * ease(t), behavior: "instant" });
    if (t < 1) frame = requestAnimationFrame(step);
    else stop();
  };
  frame = requestAnimationFrame(step);
}

// Click handler for the `smooth` links: Home goes to the very top, hash links go to
// their section (minus the sticky-navbar offset from `scroll-padding-top`).
function handleSmoothClick(e, href) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (window.location.pathname !== "/") return; // other pages: normal navigation

  let top = 0;
  if (href.startsWith("#")) {
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    const offset =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    top = el.getBoundingClientRect().top + window.scrollY - offset;
  }

  e.preventDefault();
  // keep the URL the same as before ("/" for Home, "/#about", "/#footer")
  const url = href.startsWith("#") ? `/${href}` : href;
  if (window.location.pathname + window.location.hash !== url)
    window.history.pushState(null, "", url);
  smoothScrollTo(top);
}

// >>> PUT YOUR REAL URLS IN `href` <<<
// `tag` = small grey text under the name (change it if you like)
const companies = [
  {
    label: "Way-Wise Tech",
    tag: "Technology",
    href: "https://waywisetech.com/",
  }, // TODO: Tech URL
  {
    label: "Pother Bazar",
    tag: "Consumer",
    href: "https://www.potherbazar.com/",
  }, // TODO: Pother Bazar URL
  { label: "Way-Wise Trading", 
    tag: "Trading", 
    href: "https://waywisetrading.com/" }, // TODO: Trading URL
  {
    label: "Way-Wise Jobs",
    tag: "Recruitment",
    href: "https://waywisejobs.com/",
  }, // TODO: Jobs URL
];

export default function Navbar() {
  const [open, setOpen] = useState(false); // desktop dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // hamburger menu
  const [mobileCompanies, setMobileCompanies] = useState(false); // companies list inside hamburger menu
  const dropdownRef = useRef(null);

  function closeMobile() {
    setMobileOpen(false);
    setMobileCompanies(false);
  }

  function toggleMobile() {
    if (mobileOpen) closeMobile();
    else setMobileOpen(true);
  }

  // Desktop dropdown: close when you tap / click outside of it (needed for touch screens)
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Mobile menu: lock page scroll + close with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    // keep the page from jumping sideways when the scrollbar disappears (tablets / small laptops)
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setMobileCompanies(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = previousPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // If the window becomes big (desktop menu appears at 1280px), close the mobile menu
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = (e) => {
      if (e.matches) {
        setMobileOpen(false);
        setMobileCompanies(false);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-[120rem] items-center justify-between px-6 sm:h-24 lg:px-16 xl:px-[15.625rem]">
          {/* Logo: export node 1:1429 from Figma as SVG -> public/images/logo.svg */}
          <Link
            href="/"
            className="shrink-0"
            onClick={(e) => {
              closeMobile();
              handleSmoothClick(e, "/");
            }}
          >
            <Image
              src="/images/logo.svg"
              alt="Way-Wise Global"
              width={290}
              height={64}
              priority
              className="h-auto w-[9.375rem] sm:w-[11.875rem] xl:w-[18.125rem]"
            />
          </Link>

          {/* ================= Desktop menu (1280px and up) ================= */}
          <ul className="hidden items-center gap-[1.875rem] font-poppins text-[max(1rem,14px)] leading-[1.5] xl:flex">
            {links.map((item) =>
              item.dropdown ? (
                <li
                  key={item.label}
                  ref={dropdownRef}
                  className="relative"
                  onPointerEnter={(e) =>
                    e.pointerType === "mouse" && setOpen(true)
                  }
                  onPointerLeave={(e) =>
                    e.pointerType === "mouse" && setOpen(false)
                  }
                  onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                  onBlur={(e) => {
                    // close when keyboard focus leaves the whole dropdown
                    if (!e.currentTarget.contains(e.relatedTarget))
                      setOpen(false);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    className={`flex items-center gap-1.5 whitespace-nowrap transition-colors duration-200 hover:text-[#b80100] ${
                      open ? "text-[#b80100]" : "text-white"
                    }`}
                  >
                    {item.label}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden
                      className={`size-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Dropdown: always in the page, shown/hidden with a smooth transition.
                      pt-3 is an invisible bridge so the menu doesn't close while the
                      mouse travels from the button down to the panel. */}
                  <div
                    className={`absolute left-0 top-full z-50 pt-3 transition-all duration-300 ease-out ${
                      open
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <ul
                      role="menu"
                      className="relative w-[18.75rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]/90 p-2 shadow-[0_1.5rem_3.75rem_-0.75rem_rgba(0,0,0,0.85)] backdrop-blur-xl"
                    >
                      {/* thin red glow line on top */}
                      <span
                        aria-hidden
                        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#b80100] to-transparent"
                      />

                      {companies.map((c, i) => (
                        <li
                          key={c.label}
                          role="none"
                          className={`transition-all duration-300 ease-out ${
                            open
                              ? "translate-y-0 opacity-100"
                              : "translate-y-1 opacity-0"
                          }`}
                          style={{
                            transitionDelay: open ? `${60 + i * 45}ms` : "0ms",
                          }}
                        >
                          <a
                            role="menuitem"
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/item relative flex items-center justify-between gap-4 rounded-xl py-3 pl-6 pr-4 outline-none transition-colors duration-200 hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                          >
                            {/* red line on the left: grows on hover */}
                            <span
                              aria-hidden
                              className="absolute left-2.5 top-1/2 h-0 w-[0.1875rem] -translate-y-1/2 rounded-full bg-[#b80100] transition-all duration-300 group-hover/item:h-7 group-focus-visible/item:h-7"
                            />

                            <span className="flex min-w-0 flex-col">
                              <span className="whitespace-nowrap font-oxanium text-[max(1rem,14px)] font-medium leading-tight text-white transition-transform duration-300 group-hover/item:translate-x-1 group-focus-visible/item:translate-x-1">
                                {c.label}
                              </span>
                              <span className="mt-0.5 font-poppins text-[max(0.75rem,12px)] leading-[calc(1/0.75)] text-[#9d9d9d] transition-transform duration-300 group-hover/item:translate-x-1 group-focus-visible/item:translate-x-1">
                                {c.tag}
                              </span>
                            </span>

                            {/* arrow slides in on hover */}
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden
                              className="size-5 shrink-0 -translate-x-2 text-[#e00000] opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100"
                            >
                              <path
                                d="M7 17L17 7M9 7h8v8"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={
                      item.smooth
                        ? (e) => handleSmoothClick(e, item.href)
                        : undefined
                    }
                    className={`whitespace-nowrap ${
                      item.active
                        ? "font-medium text-[#b80100]"
                        : "text-white transition-colors duration-200 hover:text-[#b80100]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* Call to action button (desktop) */}
          <PartnerWithUsLink className="hidden h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-[#b80100] px-[1.875rem] font-oxanium text-[max(1rem,14px)] leading-[1.5] font-bold capitalize text-white hover:bg-[#660100] xl:flex">
            Partner with us
          </PartnerWithUsLink>

          {/* ================= Hamburger button (below 1280px) ================= */}
          <button
            type="button"
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="-mr-3 flex size-11 shrink-0 items-center justify-center rounded-lg text-white outline-none transition-colors duration-200 hover:text-[#b80100] focus-visible:ring-2 focus-visible:ring-[#b80100] xl:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  mobileOpen ? "top-[0.4375rem] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[0.4375rem] h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  mobileOpen ? "top-[0.4375rem] -rotate-45" : "top-[0.875rem]"
                }`}
              />
            </span>
          </button>
        </nav>

        {/* ================= Mobile / tablet menu panel ================= */}
        <div
          id="mobile-menu"
          aria-hidden={!mobileOpen}
          className={`absolute inset-x-0 top-full grid bg-black transition-all duration-300 ease-out xl:hidden ${
            mobileOpen
              ? "visible grid-rows-[1fr] opacity-100"
              : "invisible grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-white/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:max-h-[calc(100dvh-6rem)] lg:px-16">
              <ul className="flex flex-col font-poppins text-base">
                {links.map((item) =>
                  item.dropdown ? (
                    <li key={item.label} className="border-b border-white/10">
                      <button
                        type="button"
                        onClick={() => setMobileCompanies((v) => !v)}
                        aria-expanded={mobileCompanies}
                        className={`flex w-full items-center justify-between py-3.5 text-left transition-colors duration-200 ${
                          mobileCompanies ? "text-[#b80100]" : "text-white"
                        }`}
                      >
                        {item.label}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden
                          className={`transition-transform duration-300 ${
                            mobileCompanies ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {/* companies list: opens like an accordion */}
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          mobileCompanies
                            ? "visible grid-rows-[1fr] opacity-100"
                            : "invisible grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <ul className="mb-3 ml-1 flex flex-col border-l border-white/15">
                            {companies.map((c) => (
                              <li key={c.label}>
                                <a
                                  href={c.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={closeMobile}
                                  className="flex items-center justify-between gap-4 rounded-r-lg py-3 pl-4 pr-3 transition-colors duration-200 active:bg-white/10"
                                >
                                  <span className="flex min-w-0 flex-col">
                                    <span className="font-oxanium text-base font-medium leading-tight text-white">
                                      {c.label}
                                    </span>
                                    <span className="mt-0.5 font-poppins text-xs text-[#9d9d9d]">
                                      {c.tag}
                                    </span>
                                  </span>
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden
                                    className="shrink-0 text-[#e00000]"
                                  >
                                    <path
                                      d="M7 17L17 7M9 7h8v8"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li key={item.label} className="border-b border-white/10">
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          closeMobile();
                          if (item.smooth) handleSmoothClick(e, item.href);
                        }}
                        className={`block py-3.5 transition-colors duration-200 ${
                          item.active
                            ? "font-medium text-[#b80100]"
                            : "text-white active:text-[#b80100]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              <PartnerWithUsLink
                onClick={closeMobile}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-[#b80100] font-oxanium sm:w-auto sm:px-[1.875rem] text-base font-bold capitalize text-white active:bg-[#9a0100]"
              >
                Partner with us
              </PartnerWithUsLink>
            </div>
          </div>
        </div>
      </header>

      {/* Dark layer behind the open mobile menu: tap it to close the menu */}
      <div
        aria-hidden
        onClick={closeMobile}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 xl:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}

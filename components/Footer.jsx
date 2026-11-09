import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { PartnerWithUsLink } from "@/components/PartnerWithUs";

// CTA banner + footer in one component (Figma 41:2330). The CTA starts right where the
// previous section ends, so there is no top margin or padding above it.

const CTA = {
  title: "Ready To Build the Next Opportunity Together?",
  text: "Connect with Way Wise Global for business partnerships, specialized services and international collaboration.",
  button: { label: "Partner with us", href: "/#contact" },
  image: "/images/cta-bg.png",
};

const SITE = {
  about:
    "Way Wise Global brings together technology, construction, real estate, trading, recruitment, and consumer ventures under one shared vision for sustainable global growth.",
  phone: { label: "+1 (310) 528-6170", href: "tel:+1 (310) 528-6170" },
  email: { label: "firoz@waywise.pro", href: "mailto:firoz@waywise.pro" },
  copyright: "© 2026 Way Wise Global. All Rights Reserved.",
  legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/WayWiseGlobal/",
    red: false,
    icon: FaFacebookF,
  },
  // Same Font Awesome solid set as Facebook, so all three share one fill style and grid.
  {
    label: "YouTube",
    href: "https://www.youtube.com/@WayWiseTech",
    red: false,
    icon: FaYoutube,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/waywisetech",
    red: false,
    icon: FaLinkedinIn,
  },
];

// Figma 41:2330 shows only the Services column, with these four links; Quick Links was
// added before it. `external: true` opens the link in a new tab.
const COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "P&L", href: "https://pnl.waywisetech.com/login", external: true },
      { label: "Old P&L", href: "https://expense.waywisetech.com/accounts/login/?next=/", external: true },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Technology", href: "https://waywisetech.com/" },
      { label: "Trading", href: "/services/trading" },
      { label: "Recruitment", href: "https://waywisejobs.com/" },
      { label: "Consumer Businesses", href: "https://www.potherbazar.com/" },
    ],
  },
];

// Public Sans is loaded in app/layout.js
const publicSans = "font-[family-name:var(--font-public-sans)]";

function ContactItem({ label, value, href, children }) {
  return (
    <a href={href} className="group flex w-fit items-center gap-3">
      <span className="flex size-12 items-center justify-center rounded-[1.875rem] bg-[rgba(224,0,0,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#e00000] group-active:scale-110 group-active:bg-[#e00000]">
        {children}
      </span>
      <span className={`flex flex-col gap-0.5 text-white ${publicSans}`}>
        <span className="text-[max(0.75rem,12px)] leading-[max(1.125rem,16px)]">{label}</span>
        <span className="text-[max(1rem,15px)] font-semibold leading-[max(1.5rem,22px)] transition-colors duration-300 group-hover:text-[#ff4d4d] group-active:text-[#ff4d4d]">
          {value}
        </span>
      </span>
    </a>
  );
}

function CtaBanner() {
  return (
    <section id="contact" className="relative isolate overflow-hidden">
      <Image
        src={CTA.image}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-left"
      />

      {/* Below 640px the text overlaps the bright part of the photo */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/25 sm:hidden" />

      <div className="mx-auto flex max-w-[120rem] flex-col items-end px-6 py-10 sm:py-16 md:py-20 lg:px-16 xl:px-[15.625rem]">
        <div className="flex w-full flex-col items-start gap-8 sm:gap-[3.125rem] lg:w-[50rem] lg:max-w-[60%] xl:max-w-none">
          <div className="flex w-full flex-col gap-[0.9375rem] text-white">
            <h2 className="font-oxanium text-[clamp(1.5rem,7.4vw,1.875rem)] font-bold leading-normal sm:text-3xl md:text-4xl xl:text-[3.125rem]">
              {CTA.title}
            </h2>
            <p className="font-poppins text-base md:text-[max(1.125rem,15px)]">{CTA.text}</p>
          </div>

          <PartnerWithUsLink
            href={CTA.button.href}
            className="flex h-12 w-full items-center justify-center rounded-lg px-[2.25rem] py-[0.625rem] font-oxanium text-[max(1rem,14px)] font-bold capitalize leading-6 text-white ring-1 ring-inset ring-white transition-[background-color,box-shadow] duration-500 ease-out hover:bg-white/10 hover:ring-[0.5px] focus-visible:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            {CTA.button.label}
          </PartnerWithUsLink>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="text-white">
      <CtaBanner />

      {/* id="footer" stays on this part: the Navbar "Contact" link scrolls here */}
      <div id="footer" className="relative isolate overflow-hidden bg-[url('/images/vision-bg.png')] bg-cover bg-center">
        <Image
          src="/images/footer-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-10"
        />

        {/* Tailwind v4 only applies hover: on hover-capable devices, so each hover effect has an
            active: twin for touch screens. */}
        <div className="mx-auto flex max-w-[120rem] flex-col gap-10 px-6 pb-10 pt-12 sm:gap-[3.125rem] lg:px-16 xl:px-[15.625rem] xl:pb-24 xl:pt-[3.75rem]">
          <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap sm:gap-6">
            <Link
              href="/"
              aria-label="Way Wise Global home"
              className="block transition-opacity duration-300 hover:opacity-80 active:opacity-80"
            >
              <Image
                src="/images/logo.svg"
                alt="Way Wise Global"
                width={290}
                height={64}
                className="h-auto w-[clamp(8.125rem,40vw,10.625rem)] sm:w-[12.5rem] md:w-[18.125rem]"
                priority={false}
              />
            </Link>

            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`group flex size-10 items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-[#e00000] active:-translate-y-1 active:bg-[#e00000] md:size-[3.125rem] ${
                    s.red ? "bg-[rgba(224,0,0,0.15)]" : "bg-[rgba(238,238,238,0.1)]"
                  }`}
                >
                  <s.icon className="h-5 w-5 text-white" aria-hidden="true" />

                </a>
              ))}
            </div>
          </div>

          <hr className="border-0 border-t border-white/20" />

          <div className="flex flex-col gap-12 xl:flex-row xl:justify-between">
            <div className="flex shrink-0 flex-col gap-10">
              <p className="max-w-[29.375rem] font-poppins text-[max(1rem,14px)] text-white">{SITE.about}</p>

              {/* Figma: phone and email side by side */}
              <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap">
                <ContactItem label="Have a question?" value={SITE.phone.label} href={SITE.phone.href}>
                  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-[#ff3b3b] stroke-[1.5] group-hover:stroke-white group-active:stroke-white" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73-1.15-.49-2.3-1.15-3.44-1.98a28.75 28.75 0 01-3.28-2.8 28.4 28.4 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67.64-.63 1.34-.94 2.08-.94.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.4.55.67.1.27.16.54.16.83z" />
                  </svg>
                </ContactItem>

                <ContactItem label="Contact us at" value={SITE.email.label} href={SITE.email.href}>
                  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-[#ff3b3b] stroke-[1.5] group-hover:stroke-white group-active:stroke-white" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5z" />
                    <path d="M17 9l-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9" />
                  </svg>
                </ContactItem>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-10 sm:gap-x-20 xl:flex-none">
              {COLUMNS.map((col) => (
                <nav key={col.title} aria-label={col.title} className="flex flex-col gap-6">
                  <h3
                    className={`whitespace-normal text-[max(1.125rem,16px)] font-semibold leading-[max(1.75rem,24px)] sm:whitespace-nowrap ${publicSans}`}
                  >
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-2 sm:gap-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
                          className="inline-block whitespace-normal py-1.5 font-poppins text-[max(0.875rem,13px)] leading-[calc(1.25/0.875)] text-white transition-all duration-300  hover:text-[#b80100] active:text-[#ff4d4d] sm:whitespace-nowrap sm:py-0"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[1.875rem]">
            <hr className="border-0 border-t border-white/20" />
            <div className={`flex flex-col gap-3 text-[max(1rem,14px)] leading-[max(1.5rem,22px)] sm:flex-row sm:items-center sm:justify-between ${publicSans}`}>
              <p>{SITE.copyright}</p>
              <div className="flex flex-nowrap gap-x-5 sm:gap-[1.625rem]">
                {SITE.legal.map((l) => (
                  <Link key={l.label} href={l.href} className="whitespace-nowrap transition-colors duration-300 hover:text-[#ff4d4d] active:text-[#ff4d4d]">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

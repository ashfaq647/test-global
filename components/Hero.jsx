import Image from "next/image";
import Link from "next/link";
import { PartnerWithUsLink } from "@/components/PartnerWithUs";

// From 1280px the cards sit inside the illustration, positioned as percentages of the
// 848x848 Figma artwork. Below that they render as a grid under the buttons.
const companyCards = [
  {
    name: "Way Wise Tech",
    href: "https://waywisetech.com/", // TODO: paste Tech website URL
    logo: "/images/cards/tech.svg",
    logoW: 110,
    logoH: 63,
    logoWidthPct: "51.4%",
    position: "left-[36.196%] top-[15%]",
  },
  {
    name: "Way Wise Trading",
    href: "https://waywisetrading.com/", // TODO: paste Trading website URL
    logo: "/images/cards/trading.svg",
    logoW: 110,
    logoH: 78,
    logoWidthPct: "51.3%",
    position: "left-[10.946%] top-[37.75%]",
  },
  {
    name: "Jobs @ Way Wise",
    href: "https://waywisejobs.com/", // TODO: paste Jobs website URL
    logo: "/images/cards/jobs.svg",
    logoW: 150,
    logoH: 34,
    logoWidthPct: "70%",
    position: "left-[60.446%] top-[37.75%]",
  },
  {
    name: "পথের বাজার",
    href: "https://www.potherbazar.com/", // TODO: paste Pother Bazar website URL
    logo: "/images/cards/pother-bazar.svg",
    logoW: 120,
    logoH: 74,
    logoWidthPct: "56%",
    position: "left-[36.196%] top-[59.875%]",
  },
];

function CompanyCard({ card, className = "" }) {
  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={card.name}
      className={`flex aspect-[214.33/149.31] items-center justify-center rounded-[0.375rem] border-[0.6px] border-white/60 bg-black/70 backdrop-blur-[0.4375rem] transition-colors duration-700 ease-in-out hover:bg-[#b80100] focus-visible:bg-[#b80100] active:bg-[#b80100] ${className}`}
    >
      <Image
        src={card.logo}
        alt={card.name}
        width={card.logoW}
        height={card.logoH}
        style={{ width: card.logoWidthPct, height: "auto" }}
      />
    </a>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      {/* Below 1280px the section is taller than the 2.4:1 photo, so the full photo sits
          at the top and fades into black behind the cards instead of being zoomed in */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-2 hidden aspect-[12/5] [mask-image:linear-gradient(to_bottom,#000_80%,transparent)] sm:block xl:inset-0 xl:aspect-auto xl:[mask-image:none]"
      >
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden sm:block"
        style={{
          backgroundImage:
            "linear-gradient(269.58deg, rgba(102,102,102,0) 8.5%, rgba(0,5,12,0.9) 62.19%)",
        }}
      />

      {/* Below 1280px the text sits over the photo, so it needs extra contrast */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-black/10 sm:block xl:hidden"
      />

      <div className="mx-auto flex max-w-[120rem] items-center px-[1.4375rem] pb-[1.25rem] pt-[1.6875rem] sm:px-10 sm:py-14 xl:min-h-[50rem] xl:px-[15.625rem] xl:py-[9.375rem]">
        <div className="flex w-full max-w-none flex-col gap-[1.875rem] sm:gap-10 xl:w-auto xl:max-w-[50.5625rem]">
          <div className="flex flex-col gap-5 sm:gap-6">
            <h1 className="font-oxanium -mx-[0.9375rem] text-[clamp(1.25rem,calc(8vw_-_0.08rem),1.875rem)] font-bold leading-[normal] text-white text-center sm:mx-0 sm:text-left sm:text-4xl sm:leading-tight md:text-5xl xl:text-[4rem] xl:leading-[1.125]">
              Building Businesses.
              <br className="sm:hidden" />{" "}
              Connecting Opportunities.
              <br className="sm:hidden" />{" "}
              Shaping the Future.
            </h1>
            <p className="max-w-[49.5rem] text-center font-poppins text-base leading-[1.375rem] text-white sm:text-left sm:leading-[max(2rem,24px)] md:text-[max(1.25rem,16px)]">
              Way Wise Global brings together
              <br className="hidden min-[390px]:max-sm:block" />{" "}
              technology, construction, real estate,
              <br className="hidden min-[390px]:max-sm:block" />{" "}
              trading, recruitment, and consumer
              <br className="hidden min-[390px]:max-sm:block" />{" "}
              ventures under one shared vision for
              <br className="hidden min-[390px]:max-sm:block" />{" "}
              sustainable global growth.
            </p>
          </div>

          <div className="flex w-full max-w-[17.5625rem] flex-col-reverse gap-5 self-center sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-[0.9375rem] sm:self-auto">
            <Link
              href="#companies"
              className="w-full rounded-full bg-[#b80100] px-6 py-3 uppercase text-center font-poppins text-[max(1rem,14px)] leading-[1.5] font-semibold text-white transition-colors duration-500 hover:bg-[#9a0100] active:bg-[#9a0100] sm:w-auto sm:px-10 sm:py-[0.8125rem] sm:normal-case"
            >
              Explore Our Companies
            </Link>
            <PartnerWithUsLink
              className="w-full rounded-full border border-white px-6 py-[0.6875rem] uppercase text-center font-poppins text-[max(1rem,14px)] leading-[1.5] font-semibold text-white transition-colors duration-600 hover:border-[#b80100] hover:bg-[#b80100] active:border-[#b80100] active:bg-[#b80100] sm:w-auto sm:px-10 sm:py-[0.8125rem] sm:normal-case"
            >
              Partner With Us
            </PartnerWithUsLink>
          </div>

          <div className="relative mx-0.5 grid grid-cols-2 gap-3 pt-[3.9375rem] sm:static sm:mx-0 sm:gap-4 sm:pt-2 md:grid-cols-4 xl:hidden">
            {/* Mobile-only background (new Figma design, 390px frame). Anchored to this
                grid rather than the section bottom, because the grid's height grows with
                the viewport and the photo has to stay behind the same content. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-1rem] top-[-11.6875rem] -z-5 h-[17rem] w-auto sm:hidden"
            >
              <Image
                src="/images/hero-bg-mobile.jpg"
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 28rem"
                className="object-cover scale-[1.05]"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-transparent" />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-1.5625rem] top-[-1.375rem] bottom-[-1.25rem] -z-4 sm:hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 0, #000 6.71875rem)",
              }}
            />

            {companyCards.map((card) => (
              <CompanyCard key={card.name} card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* The calc term is 0 up to 1920px; above that it keeps the artwork aligned with
          the centred content. */}
      <div className="pointer-events-none absolute right-[calc((100vw_-_120rem)/2_+_4.3125rem)] top-[1.5%] hidden aspect-square w-[52.8125rem] xl:block">
        <svg
          aria-hidden
          viewBox="0 0 848 848"
          fill="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <g stroke="#fff" strokeWidth="1.44" strokeDasharray="2.88 2.88">
            <path d="M192.46 320.12V191.86H421.42" />
            <path d="M190.34 461.1V589.36H419.3" />
            <path d="M622.82 320.12V191.86H393.86" />
            <path d="M626 456.86V585.12H397.04" />
          </g>
        </svg>

        {companyCards.map((card) => (
          <CompanyCard
            key={card.name}
            card={card}
            className={`pointer-events-auto absolute w-[25.274%] ${card.position}`}
          />
        ))}

        {/* Center circle (122px in Figma) */}
        <div className="absolute left-[48.6%] top-[46.58%] flex aspect-square w-[14.6%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-[#191919]">
          <Image
            src="/images/cards/logo-mark.svg"
            alt="Way Wise Global"
            width={75}
            height={64}
            style={{ width: "60%", height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
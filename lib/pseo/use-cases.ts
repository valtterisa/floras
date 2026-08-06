import type { Locale } from "@/i18n/routing";

export type UseCase = {
  id: string;
  slugs: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  bullets: Record<Locale, string[]>;
  examplePrompt: Record<Locale, string>;
  keywords: Record<Locale, string[]>;
};

export const USE_CASES: UseCase[] = [
  {
    id: "restaurant",
    slugs: { en: "restaurant", fi: "ravintola" },
    title: {
      en: "Restaurant website from one sentence",
      fi: "Ravintolan verkkosivut yhdellä lauseella",
    },
    description: {
      en: "Build a menu-ready restaurant site with hours, location, and a contact form — no designer needed.",
      fi: "Rakenna ravintolasivusto menuineen, aukioloineen ja yhteydenottolomakkeella — ilman suunnittelijaa.",
    },
    bullets: {
      en: [
        "Hero, menu highlights, and reservation CTA",
        "Contact form submissions in your Floras inbox",
        "Live preview before you publish",
      ],
      fi: [
        "Hero, menunostot ja varaus-CTA",
        "Yhteydenotot Floras-postilaatikkoon",
        "Live-esikatselu ennen julkaisua",
      ],
    },
    examplePrompt: {
      en: "Modern restaurant website for a neighborhood bistro with seasonal menu, hours, and a reservation contact form",
      fi: "Moderni ravintolasivusto lähikorttelin bistroon: sesongin menu, aukioloajat ja varauslomake",
    },
    keywords: {
      en: ["restaurant website", "restaurant website builder", "menu website"],
      fi: ["ravintola verkkosivut", "ravintolan kotisivut", "menu sivusto"],
    },
  },
  {
    id: "cafe",
    slugs: { en: "cafe", fi: "kahvila" },
    title: {
      en: "Café website in minutes",
      fi: "Kahvilan verkkosivut minuuteissa",
    },
    description: {
      en: "Warm café branding, opening hours, and a simple contact form for catering or bookings.",
      fi: "Lämmin kahvilailme, aukioloajat ja lomake cateringiin tai varauksiin.",
    },
    bullets: {
      en: [
        "Atmosphere-first hero and photo grid",
        "Hours and location made clear",
        "Built-in lead capture form",
      ],
      fi: [
        "Tunnelmallinen hero ja kuvagalleria",
        "Aukioloajat ja sijainti selkeästi",
        "Valmis yhteydenottolomake",
      ],
    },
    examplePrompt: {
      en: "Cozy specialty coffee café website with roast notes, hours, and a contact form for catering",
      fi: "Tunnelmallinen erikoiskahvilan sivusto: paahtoprofiilit, aukioloajat ja catering-lomake",
    },
    keywords: {
      en: ["cafe website", "coffee shop website"],
      fi: ["kahvila verkkosivut", "kahvilan kotisivut"],
    },
  },
  {
    id: "salon",
    slugs: { en: "salon", fi: "parturi" },
    title: {
      en: "Salon & barber website",
      fi: "Parturin ja kampaamon sivusto",
    },
    description: {
      en: "Services, pricing cues, and a booking inquiry form for salons and barbershops.",
      fi: "Palvelut, hinnasto ja ajanvarauskysely partureille ja kampaamoille.",
    },
    bullets: {
      en: [
        "Service list that scans fast",
        "Strong before/after gallery option",
        "Inquiry form for appointments",
      ],
      fi: [
        "Nopea palvelulista",
        "Ennen/jälkeen -galleria",
        "Ajanvarauskysely lomakkeella",
      ],
    },
    examplePrompt: {
      en: "Clean barbershop website with services, price list, and a booking inquiry form",
      fi: "Siisti parturisivusto: palvelut, hinnasto ja ajanvarauslomake",
    },
    keywords: {
      en: ["salon website", "barbershop website"],
      fi: ["parturi verkkosivut", "kampaamo kotisivut"],
    },
  },
  {
    id: "plumber",
    slugs: { en: "plumber", fi: "putkimies" },
    title: {
      en: "Plumber website that gets calls",
      fi: "Putkimiehen sivusto joka tuo soittoja",
    },
    description: {
      en: "Trust-first service pages with emergency CTA and a lead form for quotes.",
      fi: "Luottamusta rakentava palvelusivusto, hätä-CTA ja tarjouslomake.",
    },
    bullets: {
      en: [
        "Clear services and service area",
        "Phone-first CTA plus form",
        "Reviews and FAQ sections",
      ],
      fi: [
        "Selkeät palvelut ja toiminta-alue",
        "Puhelu-CTA ja lomake",
        "Arviot ja FAQ",
      ],
    },
    examplePrompt: {
      en: "Straightforward plumber website with emergency service CTA, service list, and quote request form",
      fi: "Suora putkimiehen sivusto: hätäpalvelu-CTA, palvelulista ja tarjouslomake",
    },
    keywords: {
      en: ["plumber website", "plumbing company website"],
      fi: ["putkimies verkkosivut", "LVI kotisivut"],
    },
  },
  {
    id: "electrician",
    slugs: { en: "electrician", fi: "sahkoasentaja" },
    title: {
      en: "Electrician website",
      fi: "Sähköasentajan verkkosivut",
    },
    description: {
      en: "Licensed-trade look with services, safety cues, and a quote form.",
      fi: "Ammattimainen ilme, palvelut ja tarjouslomake sähköasentajille.",
    },
    bullets: {
      en: [
        "Residential and commercial services",
        "Trust badges and certifications",
        "Quote request form in inbox",
      ],
      fi: [
        "Koti- ja yrityspalvelut",
        "Luottamusmerkit ja pätevyydet",
        "Tarjouspyynnöt postilaatikkoon",
      ],
    },
    examplePrompt: {
      en: "Professional electrician website with residential and commercial services and a quote form",
      fi: "Ammattimainen sähköasentajan sivusto: koti- ja yrityspalvelut sekä tarjouslomake",
    },
    keywords: {
      en: ["electrician website"],
      fi: ["sähköasentaja verkkosivut", "sähköliike kotisivut"],
    },
  },
  {
    id: "photographer",
    slugs: { en: "photographer", fi: "valokuvaaja" },
    title: {
      en: "Photographer portfolio site",
      fi: "Valokuvaajan portfolio",
    },
    description: {
      en: "Image-forward portfolio with packages and an inquiry form for bookings.",
      fi: "Kuvapainotteinen portfolio, paketit ja varauskysely.",
    },
    bullets: {
      en: [
        "Gallery-first layout",
        "Packages and about story",
        "Booking inquiry form",
      ],
      fi: [
        "Galleria edellä",
        "Paketit ja tarina",
        "Varauskysely lomakkeella",
      ],
    },
    examplePrompt: {
      en: "Editorial photographer portfolio with gallery, packages, and a booking inquiry form",
      fi: "Editorial-valokuvaajan portfolio: galleria, paketit ja varauslomake",
    },
    keywords: {
      en: ["photographer website", "photography portfolio"],
      fi: ["valokuvaaja verkkosivut", "valokuvaaja portfolio"],
    },
  },
  {
    id: "consultant",
    slugs: { en: "consultant", fi: "konsultti" },
    title: {
      en: "Consultant & coach website",
      fi: "Konsultin ja coachin sivusto",
    },
    description: {
      en: "Positioning, proof, and a contact form that turns visitors into calls.",
      fi: "Positiointi, näyttö ja lomake joka tuo keskusteluja.",
    },
    bullets: {
      en: [
        "Clear offer and outcomes",
        "Testimonials and FAQ",
        "Discovery call form",
      ],
      fi: [
        "Selkeä tarjonta ja tulokset",
        "Suositukset ja FAQ",
        "Tutustumispuhelun lomake",
      ],
    },
    examplePrompt: {
      en: "Minimal consultant website for a B2B strategy coach with case highlights and a discovery call form",
      fi: "Minimalistinen konsulttisivusto B2B-strategiacoachille: caset ja tutustumispuhelulomake",
    },
    keywords: {
      en: ["consultant website", "coach website"],
      fi: ["konsultti verkkosivut", "coach kotisivut"],
    },
  },
  {
    id: "gym",
    slugs: { en: "gym", fi: "kuntosali" },
    title: {
      en: "Gym & studio website",
      fi: "Kuntosalin ja studion sivusto",
    },
    description: {
      en: "Classes, membership cues, and a join-inquiry form for gyms and studios.",
      fi: "Tunnit, jäsenyys ja liittymiskysely kuntosaleille ja studioille.",
    },
    bullets: {
      en: [
        "Class schedule section",
        "Membership tiers",
        "Join / trial form",
      ],
      fi: [
        "Tuntikalenteri",
        "Jäsenyystasot",
        "Liittymis- / kokeilulomake",
      ],
    },
    examplePrompt: {
      en: "Bold gym and studio website with class types, membership options, and a trial signup form",
      fi: "Rohkea kuntosali- ja studiosivusto: tuntityypit, jäsenyydet ja kokeilulomake",
    },
    keywords: {
      en: ["gym website", "fitness studio website"],
      fi: ["kuntosali verkkosivut", "studio kotisivut"],
    },
  },
  {
    id: "clinic",
    slugs: { en: "clinic", fi: "klinikka" },
    title: {
      en: "Clinic & dentist website",
      fi: "Klinikan ja hammaslääkärin sivusto",
    },
    description: {
      en: "Calm clinical branding with services and an appointment request form.",
      fi: "Rauhallinen klinikkailme, palvelut ja ajanvarauspyyntö.",
    },
    bullets: {
      en: [
        "Services patients understand",
        "Team and location clarity",
        "Appointment request form",
      ],
      fi: [
        "Ymmärrettävät palvelut",
        "Tiimi ja sijainti",
        "Ajanvarauspyyntö lomakkeella",
      ],
    },
    examplePrompt: {
      en: "Calm private dental clinic website with services, team, and an appointment request form",
      fi: "Rauhallinen yksityisen hammaslääkäriklinikan sivusto: palvelut, tiimi ja ajanvarauslomake",
    },
    keywords: {
      en: ["clinic website", "dentist website"],
      fi: ["klinikka verkkosivut", "hammaslääkäri kotisivut"],
    },
  },
  {
    id: "florist",
    slugs: { en: "florist", fi: "kukkakauppa" },
    title: {
      en: "Florist website",
      fi: "Kukkakaupan verkkosivut",
    },
    description: {
      en: "Seasonal arrangements, shop story, and an order inquiry form.",
      fi: "Sesongin kimput, tarina ja tilauskysely.",
    },
    bullets: {
      en: [
        "Seasonal gallery",
        "Occasions and delivery notes",
        "Order inquiry form",
      ],
      fi: [
        "Sesonkigalleria",
        "Tilaisuudet ja toimitus",
        "Tilauskysely lomakkeella",
      ],
    },
    examplePrompt: {
      en: "Soft florist website with seasonal arrangements, wedding packages, and an order inquiry form",
      fi: "Pehmeä kukkakaupan sivusto: sesongin kimput, hääpaketit ja tilauslomake",
    },
    keywords: {
      en: ["florist website", "flower shop website"],
      fi: ["kukkakauppa verkkosivut", "kukkakaupan kotisivut"],
    },
  },
];

export function getUseCaseBySlug(
  locale: Locale,
  slug: string
): UseCase | undefined {
  return USE_CASES.find((u) => u.slugs[locale] === slug);
}

export function getUseCaseSlugs(locale: Locale): string[] {
  return USE_CASES.map((u) => u.slugs[locale]);
}

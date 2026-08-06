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

function uc(
  id: string,
  slugs: Record<Locale, string>,
  title: Record<Locale, string>,
  description: Record<Locale, string>,
  bullets: Record<Locale, string[]>,
  examplePrompt: Record<Locale, string>,
  keywords: Record<Locale, string[]>
): UseCase {
  return { id, slugs, title, description, bullets, examplePrompt, keywords };
}

export const USE_CASES: UseCase[] = [
  uc(
    "restaurant",
    { en: "restaurant", fi: "ravintola" },
    {
      en: "Restaurant website from one sentence",
      fi: "Ravintolan verkkosivut yhdellä lauseella",
    },
    {
      en: "Build a menu-ready restaurant site with hours, location, and a contact form — no designer needed.",
      fi: "Rakenna ravintolasivusto menuineen, aukioloineen ja yhteydenottolomakkeella — ilman suunnittelijaa.",
    },
    {
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
    {
      en: "Modern restaurant website for a neighborhood bistro with seasonal menu, hours, and a reservation contact form",
      fi: "Moderni ravintolasivusto lähikorttelin bistroon: sesongin menu, aukioloajat ja varauslomake",
    },
    {
      en: ["restaurant website", "restaurant website builder", "menu website"],
      fi: ["ravintola verkkosivut", "ravintolan kotisivut", "menu sivusto"],
    }
  ),
  uc(
    "cafe",
    { en: "cafe", fi: "kahvila" },
    {
      en: "Café website in minutes",
      fi: "Kahvilan verkkosivut minuuteissa",
    },
    {
      en: "Warm café branding, opening hours, and a simple contact form for catering or bookings.",
      fi: "Lämmin kahvilailme, aukioloajat ja lomake cateringiin tai varauksiin.",
    },
    {
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
    {
      en: "Cozy specialty coffee café website with roast notes, hours, and a contact form for catering",
      fi: "Tunnelmallinen erikoiskahvilan sivusto: paahtoprofiilit, aukioloajat ja catering-lomake",
    },
    {
      en: ["cafe website", "coffee shop website"],
      fi: ["kahvila verkkosivut", "kahvilan kotisivut"],
    }
  ),
  uc(
    "bakery",
    { en: "bakery", fi: "leipomo" },
    {
      en: "Bakery website that sells the smell",
      fi: "Leipomon sivusto joka myy tunnelman",
    },
    {
      en: "Fresh bakery branding with favorites, hours, and a catering or preorder inquiry form.",
      fi: "Tuore leipomoilme, suosikit, aukioloajat ja catering- tai ennakkotilauslomake.",
    },
    {
      en: [
        "Product highlights and seasonal specials",
        "Clear hours and pickup notes",
        "Catering / preorder form",
      ],
      fi: [
        "Tuotenostot ja sesonkierikoisuudet",
        "Aukioloajat ja nouto-ohjeet",
        "Catering- / ennakkotilauslomake",
      ],
    },
    {
      en: "Warm artisan bakery website with bestsellers, hours, and a catering inquiry form",
      fi: "Lämmin käsityöleipomon sivusto: suosikkituotteet, aukioloajat ja catering-lomake",
    },
    {
      en: ["bakery website", "bakery website builder"],
      fi: ["leipomo verkkosivut", "leipomon kotisivut"],
    }
  ),
  uc(
    "bar",
    { en: "bar", fi: "baari" },
    {
      en: "Bar & cocktail lounge website",
      fi: "Baarin ja cocktail-loungen sivusto",
    },
    {
      en: "Mood-first bar site with drinks cues, events, and a booking or private-hire form.",
      fi: "Tunnelmallinen baarisivusto drinkkeineen, tapahtumineen ja varauslomakkeella.",
    },
    {
      en: [
        "Atmosphere hero and drink highlights",
        "Events and opening hours",
        "Private hire inquiry form",
      ],
      fi: [
        "Tunnelmahero ja drinkkinostot",
        "Tapahtumat ja aukioloajat",
        "Yksityistilaisuuden kyselylomake",
      ],
    },
    {
      en: "Moody cocktail bar website with signature drinks, events calendar cue, and private hire form",
      fi: "Tunnelmallinen cocktail-baarin sivusto: signature-drinkit, tapahtumat ja yksityistilaisuuslomake",
    },
    {
      en: ["bar website", "cocktail bar website"],
      fi: ["baari verkkosivut", "baarin kotisivut"],
    }
  ),
  uc(
    "pizzeria",
    { en: "pizzeria", fi: "pizzaravintola" },
    {
      en: "Pizzeria website with menu & contact",
      fi: "Pizzerian sivusto menulla ja yhteydenotolla",
    },
    {
      en: "Appetite-first pizza site with menu highlights, delivery notes, and a contact form.",
      fi: "Nälkää herättävä pizzasivusto: menunostot, toimitusohjeet ja yhteydenottolomake.",
    },
    {
      en: [
        "Menu and specialty pizzas",
        "Hours, pickup, and delivery cues",
        "Order / contact form",
      ],
      fi: [
        "Menu ja erikoispizzat",
        "Aukiolo, nouto ja kotiinkuljetus",
        "Tilaus- / yhteydenottolomake",
      ],
    },
    {
      en: "Bold neighborhood pizzeria website with classic and specialty pizzas, hours, and a contact form",
      fi: "Rohkea lähialueen pizzeriasivusto: klassikot ja erikoisuudet, aukioloajat ja yhteydenottolomake",
    },
    {
      en: ["pizzeria website", "pizza restaurant website"],
      fi: ["pizzeria verkkosivut", "pizzaravintola kotisivut"],
    }
  ),
  uc(
    "salon",
    { en: "salon", fi: "parturi" },
    {
      en: "Salon & barber website",
      fi: "Parturin ja kampaamon sivusto",
    },
    {
      en: "Services, pricing cues, and a booking inquiry form for salons and barbershops.",
      fi: "Palvelut, hinnasto ja ajanvarauskysely partureille ja kampaamoille.",
    },
    {
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
    {
      en: "Clean barbershop website with services, price list, and a booking inquiry form",
      fi: "Siisti parturisivusto: palvelut, hinnasto ja ajanvarauslomake",
    },
    {
      en: ["salon website", "barbershop website"],
      fi: ["parturi verkkosivut", "kampaamo kotisivut"],
    }
  ),
  uc(
    "nail-salon",
    { en: "nail-salon", fi: "kynsistudio" },
    {
      en: "Nail salon website",
      fi: "Kynsistudion verkkosivut",
    },
    {
      en: "Polished nail studio site with services, gallery, and a booking inquiry form.",
      fi: "Huoliteltu kynsistudiosivusto palveluineen, gallerioineen ja ajanvarauskyselyllä.",
    },
    {
      en: [
        "Service menu and pricing cues",
        "Lookbook gallery",
        "Booking inquiry form",
      ],
      fi: [
        "Palveluvalikko ja hinnastonostot",
        "Lookbook-galleria",
        "Ajanvarauskysely",
      ],
    },
    {
      en: "Elegant nail salon website with manicure and pedicure services, gallery, and booking form",
      fi: "Elegantti kynsistudion sivusto: manikyyri ja pedikyyri, galleria ja ajanvarauslomake",
    },
    {
      en: ["nail salon website", "manicure website"],
      fi: ["kynsistudio verkkosivut", "kynsstudio kotisivut"],
    }
  ),
  uc(
    "spa",
    { en: "spa", fi: "kylpyla" },
    {
      en: "Spa & wellness website",
      fi: "Spa- ja wellness-sivusto",
    },
    {
      en: "Calm spa branding with treatments, packages, and an inquiry form for bookings.",
      fi: "Rauhallinen spa-ilme, hoidot, paketit ja varauskysely.",
    },
    {
      en: [
        "Treatment list and packages",
        "Relaxing visual story",
        "Booking inquiry form",
      ],
      fi: [
        "Hoitolista ja paketit",
        "Rauhallinen visuaalinen tarina",
        "Varauskysely lomakkeella",
      ],
    },
    {
      en: "Calm day spa website with treatments, packages, and a booking inquiry form",
      fi: "Rauhallinen päiväspa-sivusto: hoidot, paketit ja varauslomake",
    },
    {
      en: ["spa website", "wellness website"],
      fi: ["spa verkkosivut", "hyvinvointi kotisivut"],
    }
  ),
  uc(
    "massage",
    { en: "massage", fi: "hieronta" },
    {
      en: "Massage therapist website",
      fi: "Hierojan verkkosivut",
    },
    {
      en: "Trust-building massage site with modalities, pricing cues, and a booking form.",
      fi: "Luottamusta rakentava hierontasivusto: menetelmät, hinnasto ja ajanvarauslomake.",
    },
    {
      en: [
        "Modalities and session lengths",
        "About / credentials section",
        "Appointment request form",
      ],
      fi: [
        "Menetelmät ja kestot",
        "Esittely ja pätevyydet",
        "Ajanvarauspyyntö",
      ],
    },
    {
      en: "Calm massage therapy website with modalities, pricing, and an appointment request form",
      fi: "Rauhallinen hierontasivusto: menetelmät, hinnasto ja ajanvarauslomake",
    },
    {
      en: ["massage therapist website", "massage website"],
      fi: ["hieronta verkkosivut", "hierojan kotisivut"],
    }
  ),
  uc(
    "tattoo",
    { en: "tattoo", fi: "tatuointistudio" },
    {
      en: "Tattoo studio website",
      fi: "Tatuointistudion sivusto",
    },
    {
      en: "Artist-forward tattoo site with portfolio, styles, and a booking inquiry form.",
      fi: "Artistikeskeinen tatuointisivusto portfoliolla, tyyleillä ja ajanvarauskyselyllä.",
    },
    {
      en: [
        "Portfolio and style highlights",
        "Artist bios",
        "Booking inquiry form",
      ],
      fi: [
        "Portfolio ja tyylinostot",
        "Artistiesittelyt",
        "Ajanvarauskysely",
      ],
    },
    {
      en: "Bold tattoo studio website with artist portfolios, styles, and a booking inquiry form",
      fi: "Rohkea tatuointistudion sivusto: artistiportfoliot, tyylit ja ajanvarauslomake",
    },
    {
      en: ["tattoo studio website", "tattoo shop website"],
      fi: ["tatuointistudio verkkosivut", "tatuointi kotisivut"],
    }
  ),
  uc(
    "plumber",
    { en: "plumber", fi: "putkimies" },
    {
      en: "Plumber website that gets calls",
      fi: "Putkimiehen sivusto joka tuo soittoja",
    },
    {
      en: "Trust-first service pages with emergency CTA and a lead form for quotes.",
      fi: "Luottamusta rakentava palvelusivusto, hätä-CTA ja tarjouslomake.",
    },
    {
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
    {
      en: "Straightforward plumber website with emergency service CTA, service list, and quote request form",
      fi: "Suora putkimiehen sivusto: hätäpalvelu-CTA, palvelulista ja tarjouslomake",
    },
    {
      en: ["plumber website", "plumbing company website"],
      fi: ["putkimies verkkosivut", "LVI kotisivut"],
    }
  ),
  uc(
    "electrician",
    { en: "electrician", fi: "sahkoasentaja" },
    {
      en: "Electrician website",
      fi: "Sähköasentajan verkkosivut",
    },
    {
      en: "Licensed-trade look with services, safety cues, and a quote form.",
      fi: "Ammattimainen ilme, palvelut ja tarjouslomake sähköasentajille.",
    },
    {
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
    {
      en: "Professional electrician website with residential and commercial services and a quote form",
      fi: "Ammattimainen sähköasentajan sivusto: koti- ja yrityspalvelut sekä tarjouslomake",
    },
    {
      en: ["electrician website"],
      fi: ["sähköasentaja verkkosivut", "sähköliike kotisivut"],
    }
  ),
  uc(
    "hvac",
    { en: "hvac", fi: "lvi" },
    {
      en: "HVAC company website",
      fi: "LVI-yrityksen verkkosivut",
    },
    {
      en: "Heating and cooling service site with service areas and a quote request form.",
      fi: "Lämmitys- ja jäähdytyspalveluiden sivusto toiminta-alueella ja tarjouslomakkeella.",
    },
    {
      en: [
        "Install, repair, and maintenance services",
        "Service area clarity",
        "Quote request form",
      ],
      fi: [
        "Asennus, korjaus ja huolto",
        "Toiminta-alue selkeästi",
        "Tarjouspyyntölomake",
      ],
    },
    {
      en: "Professional HVAC company website with install and repair services and a quote form",
      fi: "Ammattimainen LVI-yrityksen sivusto: asennus ja korjaus sekä tarjouslomake",
    },
    {
      en: ["HVAC website", "heating and cooling website"],
      fi: ["LVI verkkosivut", "lämmitys kotisivut"],
    }
  ),
  uc(
    "roofer",
    { en: "roofer", fi: "kattourakoitsija" },
    {
      en: "Roofing company website",
      fi: "Kattourakoitsijan sivusto",
    },
    {
      en: "Durable roofing brand with services, warranties, and a free estimate form.",
      fi: "Luotettava kattourakointi: palvelut, takuut ja ilmaisen arvion lomake.",
    },
    {
      en: [
        "Residential and commercial roofing",
        "Warranty and materials cues",
        "Free estimate form",
      ],
      fi: [
        "Koti- ja yrityskatot",
        "Takuu ja materiaalit",
        "Ilmaisen arvion lomake",
      ],
    },
    {
      en: "Trustworthy roofing company website with services, warranties, and a free estimate form",
      fi: "Luotettava kattourakoitsijan sivusto: palvelut, takuut ja arviointilomake",
    },
    {
      en: ["roofing website", "roofer website"],
      fi: ["kattourakoitsija verkkosivut", "kattofirman kotisivut"],
    }
  ),
  uc(
    "painter",
    { en: "painter", fi: "maalari" },
    {
      en: "Painter & decorating website",
      fi: "Maalarin ja sisustusmaalauksen sivusto",
    },
    {
      en: "Clean painter site with interior/exterior services and a project quote form.",
      fi: "Siisti maalaussivusto sisä- ja ulkotöillä sekä projektitarjouslomakkeella.",
    },
    {
      en: [
        "Interior and exterior services",
        "Before/after gallery option",
        "Project quote form",
      ],
      fi: [
        "Sisä- ja ulkomaalaus",
        "Ennen/jälkeen -galleria",
        "Projektitarjouslomake",
      ],
    },
    {
      en: "Clean residential painter website with interior and exterior services and a quote form",
      fi: "Siisti asuntomaalarin sivusto: sisä- ja ulkotyöt sekä tarjouslomake",
    },
    {
      en: ["painter website", "house painter website"],
      fi: ["maalari verkkosivut", "maalausfirma kotisivut"],
    }
  ),
  uc(
    "carpenter",
    { en: "carpenter", fi: "puuseppä" },
    {
      en: "Carpenter & joinery website",
      fi: "Puusepän verkkosivut",
    },
    {
      en: "Craft-forward carpentry site with project types and a custom quote form.",
      fi: "Käsityömäinen puusepänsivusto projektityypeillä ja räätälöidyllä tarjouslomakkeella.",
    },
    {
      en: [
        "Custom and renovation services",
        "Project gallery cues",
        "Custom quote form",
      ],
      fi: [
        "Räätälöinti ja remontointi",
        "Projektigalleria",
        "Räätälöity tarjouslomake",
      ],
    },
    {
      en: "Craft carpenter website with custom furniture and renovation services and a quote form",
      fi: "Käsityöpuusepän sivusto: räätälöidyt kalusteet, remontointi ja tarjouslomake",
    },
    {
      en: ["carpenter website", "joinery website"],
      fi: ["puuseppä verkkosivut", "puusepänliike kotisivut"],
    }
  ),
  uc(
    "landscaper",
    { en: "landscaper", fi: "pihasuunnittelija" },
    {
      en: "Landscaper website",
      fi: "Pihasuunnittelijan sivusto",
    },
    {
      en: "Outdoor design site with services, seasonal care, and a project inquiry form.",
      fi: "Pihasuunnittelusivusto palveluineen, kausihuolloineen ja projektikyselyllä.",
    },
    {
      en: [
        "Design, install, and maintenance",
        "Seasonal service cues",
        "Project inquiry form",
      ],
      fi: [
        "Suunnittelu, toteutus ja huolto",
        "Kausipalvelut",
        "Projektikyselylomake",
      ],
    },
    {
      en: "Fresh landscaping company website with design and maintenance services and a project form",
      fi: "Raikas pihasuunnitteluyrityksen sivusto: suunnittelu, huolto ja projektilomake",
    },
    {
      en: ["landscaper website", "landscaping company website"],
      fi: ["pihasuunnittelija verkkosivut", "pihaurakoitsija kotisivut"],
    }
  ),
  uc(
    "cleaning",
    { en: "cleaning", fi: "siivous" },
    {
      en: "Cleaning company website",
      fi: "Siivousfirman verkkosivut",
    },
    {
      en: "Reliable cleaning brand with home and office services and a quote form.",
      fi: "Luotettava siivousbrändi koti- ja toimistopalveluilla sekä tarjouslomakkeella.",
    },
    {
      en: [
        "Home and commercial cleaning",
        "Recurring plan cues",
        "Quote request form",
      ],
      fi: [
        "Koti- ja yrityssiivous",
        "Säännölliset sopimukset",
        "Tarjouspyyntölomake",
      ],
    },
    {
      en: "Clean professional cleaning company website with home and office services and a quote form",
      fi: "Siisti ammattimainen siivousfirman sivusto: koti- ja toimistopalvelut sekä tarjouslomake",
    },
    {
      en: ["cleaning company website", "house cleaning website"],
      fi: ["siivousfirma verkkosivut", "siivouspalvelu kotisivut"],
    }
  ),
  uc(
    "moving",
    { en: "moving", fi: "muuttofirma" },
    {
      en: "Moving company website",
      fi: "Muuttofirman verkkosivut",
    },
    {
      en: "Stress-reducing movers site with packages, coverage area, and a quote form.",
      fi: "Stressiä vähentävä muuttopalvelusivusto paketeilla, alueella ja tarjouslomakkeella.",
    },
    {
      en: [
        "Local and long-distance cues",
        "Packing and storage options",
        "Moving quote form",
      ],
      fi: [
        "Paikallinen ja pitkän matkan muutto",
        "Pakkaus ja varastointi",
        "Muuttotarjouslomake",
      ],
    },
    {
      en: "Friendly moving company website with local and long-distance options and a quote form",
      fi: "Ystävällinen muuttofirman sivusto: paikallinen ja pitkän matkan muutto sekä tarjouslomake",
    },
    {
      en: ["moving company website", "movers website"],
      fi: ["muuttofirma verkkosivut", "muuttopalvelu kotisivut"],
    }
  ),
  uc(
    "locksmith",
    { en: "locksmith", fi: "lukkoseppa" },
    {
      en: "Locksmith website",
      fi: "Lukkosepän verkkosivut",
    },
    {
      en: "Urgent-ready locksmith site with emergency CTA and a service request form.",
      fi: "Kiireellinen lukkosepänsivusto hätä-CTA:lla ja palvelupyyntölomakkeella.",
    },
    {
      en: [
        "Emergency and scheduled services",
        "Phone-first CTA",
        "Service request form",
      ],
      fi: [
        "Hätä- ja ajanvarauspalvelut",
        "Puhelu edellä",
        "Palvelupyyntölomake",
      ],
    },
    {
      en: "Urgent locksmith website with 24/7 emergency CTA, services, and a request form",
      fi: "Kiireellinen lukkosepän sivusto: 24/7-hätä-CTA, palvelut ja pyyntölomake",
    },
    {
      en: ["locksmith website", "emergency locksmith website"],
      fi: ["lukkoseppä verkkosivut", "lukkoliike kotisivut"],
    }
  ),
  uc(
    "auto-repair",
    { en: "auto-repair", fi: "autokorjaamo" },
    {
      en: "Auto repair website",
      fi: "Autokorjaamon verkkosivut",
    },
    {
      en: "Trusted garage site with services, diagnostics, and a booking or quote form.",
      fi: "Luotettava korjaamosivusto palveluineen, diagnooseineen ja ajanvaraus- tai tarjouslomakkeella.",
    },
    {
      en: [
        "Service list and specialties",
        "Hours and location",
        "Booking / quote form",
      ],
      fi: [
        "Palvelulista ja erikoistumiset",
        "Aukioloajat ja sijainti",
        "Ajanvaraus- / tarjouslomake",
      ],
    },
    {
      en: "Trustworthy auto repair shop website with services, hours, and a booking form",
      fi: "Luotettava autokorjaamon sivusto: palvelut, aukioloajat ja ajanvarauslomake",
    },
    {
      en: ["auto repair website", "garage website"],
      fi: ["autokorjaamo verkkosivut", "korjaamo kotisivut"],
    }
  ),
  uc(
    "photographer",
    { en: "photographer", fi: "valokuvaaja" },
    {
      en: "Photographer portfolio site",
      fi: "Valokuvaajan portfolio",
    },
    {
      en: "Image-forward portfolio with packages and an inquiry form for bookings.",
      fi: "Kuvapainotteinen portfolio, paketit ja varauskysely.",
    },
    {
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
    {
      en: "Editorial photographer portfolio with gallery, packages, and a booking inquiry form",
      fi: "Editorial-valokuvaajan portfolio: galleria, paketit ja varauslomake",
    },
    {
      en: ["photographer website", "photography portfolio"],
      fi: ["valokuvaaja verkkosivut", "valokuvaaja portfolio"],
    }
  ),
  uc(
    "videographer",
    { en: "videographer", fi: "videokuvaaja" },
    {
      en: "Videographer website",
      fi: "Videokuvaajan verkkosivut",
    },
    {
      en: "Showreel-ready video site with services, packages, and a project inquiry form.",
      fi: "Showreel-valmis videosivusto palveluineen, paketeineen ja projektikyselyllä.",
    },
    {
      en: [
        "Showreel and project highlights",
        "Packages for weddings or brand",
        "Project inquiry form",
      ],
      fi: [
        "Showreel ja projektinostot",
        "Häät- tai brändipaketit",
        "Projektikyselylomake",
      ],
    },
    {
      en: "Cinematic videographer website with showreel highlights, packages, and a project inquiry form",
      fi: "Elokuvamainen videokuvaajan sivusto: showreel, paketit ja projektilomake",
    },
    {
      en: ["videographer website", "video production website"],
      fi: ["videokuvaaja verkkosivut", "videotuotanto kotisivut"],
    }
  ),
  uc(
    "artist",
    { en: "artist", fi: "taiteilija" },
    {
      en: "Artist portfolio website",
      fi: "Taiteilijan portfoliosivusto",
    },
    {
      en: "Gallery-led artist site with series, bio, and an inquiry form for commissions.",
      fi: "Galleriavetoinen taiteilijasivusto sarjoilla, biolla ja tilaustyökyselyllä.",
    },
    {
      en: [
        "Works and series",
        "Bio and exhibitions",
        "Commission inquiry form",
      ],
      fi: [
        "Teokset ja sarjat",
        "Bio ja näyttelyt",
        "Tilaustyökysely",
      ],
    },
    {
      en: "Minimal artist portfolio website with works, bio, and a commission inquiry form",
      fi: "Minimalistinen taiteilijaportfolio: teokset, bio ja tilaustyölomake",
    },
    {
      en: ["artist website", "artist portfolio"],
      fi: ["taiteilija verkkosivut", "taiteilija portfolio"],
    }
  ),
  uc(
    "musician",
    { en: "musician", fi: "muusikko" },
    {
      en: "Musician & band website",
      fi: "Muusikon ja bändin sivusto",
    },
    {
      en: "Music site with music cues, tour dates, and a booking inquiry form.",
      fi: "Musiikkisivusto ääninäytteillä, keikkakalenterilla ja varauskyselyllä.",
    },
    {
      en: [
        "Music and press kit cues",
        "Tour / gig dates",
        "Booking inquiry form",
      ],
      fi: [
        "Musiikki ja press kit",
        "Keikkakalenteri",
        "Varauskyselylomake",
      ],
    },
    {
      en: "Bold musician website with music highlights, tour dates, and a booking inquiry form",
      fi: "Rohkea muusikkosivusto: musiikkinostot, keikat ja varauslomake",
    },
    {
      en: ["musician website", "band website"],
      fi: ["muusikko verkkosivut", "bändi kotisivut"],
    }
  ),
  uc(
    "consultant",
    { en: "consultant", fi: "konsultti" },
    {
      en: "Consultant & coach website",
      fi: "Konsultin ja coachin sivusto",
    },
    {
      en: "Positioning, proof, and a contact form that turns visitors into calls.",
      fi: "Positiointi, näyttö ja lomake joka tuo keskusteluja.",
    },
    {
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
    {
      en: "Minimal consultant website for a B2B strategy coach with case highlights and a discovery call form",
      fi: "Minimalistinen konsulttisivusto B2B-strategiacoachille: caset ja tutustumispuhelulomake",
    },
    {
      en: ["consultant website", "coach website"],
      fi: ["konsultti verkkosivut", "coach kotisivut"],
    }
  ),
  uc(
    "lawyer",
    { en: "lawyer", fi: "asianajaja" },
    {
      en: "Lawyer & law firm website",
      fi: "Asianajajan ja toimiston sivusto",
    },
    {
      en: "Credible law firm site with practice areas and a confidential inquiry form.",
      fi: "Luotettava asianajajasivusto oikeudenaloilla ja luottamuksellisella yhteydenottolomakkeella.",
    },
    {
      en: [
        "Practice areas and team",
        "Trust and confidentiality cues",
        "Confidential inquiry form",
      ],
      fi: [
        "Oikeudenalat ja tiimi",
        "Luottamus ja luottamuksellisuus",
        "Luottamuksellinen yhteydenotto",
      ],
    },
    {
      en: "Professional law firm website with practice areas, team, and a confidential contact form",
      fi: "Ammattimainen asianajotoimiston sivusto: oikeudenalat, tiimi ja luottamuksellinen lomake",
    },
    {
      en: ["lawyer website", "law firm website"],
      fi: ["asianajaja verkkosivut", "asianajotoimisto kotisivut"],
    }
  ),
  uc(
    "accountant",
    { en: "accountant", fi: "kirjanpito" },
    {
      en: "Accountant & bookkeeping website",
      fi: "Kirjanpitäjän verkkosivut",
    },
    {
      en: "Clear accounting firm site with services for SMEs and a consultation form.",
      fi: "Selkeä kirjanpitotoimiston sivusto PK-palveluilla ja konsultaatiolomakkeella.",
    },
    {
      en: [
        "Bookkeeping and tax services",
        "SME-focused clarity",
        "Consultation request form",
      ],
      fi: [
        "Kirjanpito ja veropalvelut",
        "PK-yrityksille selkeästi",
        "Konsultaatiopyyntö",
      ],
    },
    {
      en: "Clear accounting firm website for SMEs with bookkeeping services and a consultation form",
      fi: "Selkeä kirjanpitotoimiston sivusto PK-yrityksille: palvelut ja konsultaatiolomake",
    },
    {
      en: ["accountant website", "bookkeeping website"],
      fi: ["kirjanpito verkkosivut", "tilitoimisto kotisivut"],
    }
  ),
  uc(
    "realtor",
    { en: "realtor", fi: "kiinteistonvalittaja" },
    {
      en: "Real estate agent website",
      fi: "Kiinteistönvälittäjän sivusto",
    },
    {
      en: "Agent-first real estate site with market focus and a property inquiry form.",
      fi: "Välittäjäkeskeinen sivusto markkinafokuksella ja asuntokyselylomakkeella.",
    },
    {
      en: [
        "Agent bio and market area",
        "Featured listing cues",
        "Buyer / seller inquiry form",
      ],
      fi: [
        "Esittely ja toiminta-alue",
        "Kohdenostot",
        "Osto- / myyntikysely",
      ],
    },
    {
      en: "Modern real estate agent website with market area focus and a buyer/seller inquiry form",
      fi: "Moderni kiinteistönvälittäjän sivusto: aluefokus ja osto-/myyntikyselylomake",
    },
    {
      en: ["realtor website", "real estate agent website"],
      fi: ["kiinteistönvälittäjä verkkosivut", "välittäjä kotisivut"],
    }
  ),
  uc(
    "architect",
    { en: "architect", fi: "arkkitehti" },
    {
      en: "Architect studio website",
      fi: "Arkkitehtitoimiston sivusto",
    },
    {
      en: "Project-led architecture site with studio story and a project inquiry form.",
      fi: "Projektivetoinen arkkitehtisivusto studiolla ja projektikyselyllä.",
    },
    {
      en: [
        "Selected projects",
        "Studio approach",
        "Project inquiry form",
      ],
      fi: [
        "Valitut projektit",
        "Studion lähestymistapa",
        "Projektikyselylomake",
      ],
    },
    {
      en: "Editorial architecture studio website with selected projects and a project inquiry form",
      fi: "Editorial-arkkitehtitoimiston sivusto: valitut projektit ja projektilomake",
    },
    {
      en: ["architect website", "architecture firm website"],
      fi: ["arkkitehti verkkosivut", "arkkitehtitoimisto kotisivut"],
    }
  ),
  uc(
    "interior-designer",
    { en: "interior-designer", fi: "sisustussuunnittelija" },
    {
      en: "Interior designer website",
      fi: "Sisustussuunnittelijan sivusto",
    },
    {
      en: "Space-forward design site with project gallery and a consultation form.",
      fi: "Tilapainotteinen suunnittelusivusto projektigalleralla ja konsultaatiolomakkeella.",
    },
    {
      en: [
        "Project gallery",
        "Services and process",
        "Consultation form",
      ],
      fi: [
        "Projektigalleria",
        "Palvelut ja prosessi",
        "Konsultaatiolomake",
      ],
    },
    {
      en: "Refined interior designer website with project gallery, process, and a consultation form",
      fi: "Hiottu sisustussuunnittelijan sivusto: galleria, prosessi ja konsultaatiolomake",
    },
    {
      en: ["interior designer website", "interior design website"],
      fi: ["sisustussuunnittelija verkkosivut", "sisustus kotisivut"],
    }
  ),
  uc(
    "marketing-agency",
    { en: "marketing-agency", fi: "markkinointitoimisto" },
    {
      en: "Marketing agency website",
      fi: "Markkinointitoimiston sivusto",
    },
    {
      en: "Agency site with services, case cues, and a discovery call form.",
      fi: "Toimistosivusto palveluineen, case-nostoineen ja tutustumispuhelulomakkeella.",
    },
    {
      en: [
        "Services and specialties",
        "Case study highlights",
        "Discovery call form",
      ],
      fi: [
        "Palvelut ja erikoistumiset",
        "Case-nostot",
        "Tutustumispuhelulomake",
      ],
    },
    {
      en: "Sharp marketing agency website with services, case highlights, and a discovery call form",
      fi: "Terävä markkinointitoimiston sivusto: palvelut, caset ja tutustumispuhelulomake",
    },
    {
      en: ["marketing agency website", "digital agency website"],
      fi: ["markkinointitoimisto verkkosivut", "digitoimisto kotisivut"],
    }
  ),
  uc(
    "freelancer",
    { en: "freelancer", fi: "freelanceri" },
    {
      en: "Freelancer portfolio website",
      fi: "Freelancerin portfoliosivusto",
    },
    {
      en: "Personal brand site with services, selected work, and a hire inquiry form.",
      fi: "Henkilöbrändisivusto palveluineen, töineen ja yhteistyökyselyllä.",
    },
    {
      en: [
        "Services and rates cues",
        "Selected work",
        "Hire inquiry form",
      ],
      fi: [
        "Palvelut ja hinnoittelunostot",
        "Valitut työt",
        "Yhteistyökysely",
      ],
    },
    {
      en: "Clean freelancer portfolio website with services, selected work, and a hire inquiry form",
      fi: "Siisti freelancer-portfolio: palvelut, työt ja yhteistyölomake",
    },
    {
      en: ["freelancer website", "freelance portfolio"],
      fi: ["freelancer verkkosivut", "freelancer portfolio"],
    }
  ),
  uc(
    "startup",
    { en: "startup", fi: "kasvuyritys" },
    {
      en: "Startup landing page",
      fi: "Startupin landing page",
    },
    {
      en: "Ship a crisp startup landing page with product story and a waitlist or contact form.",
      fi: "Julkaise napakka startup-landing: tuotetarina ja waitlist- tai yhteydenottolomake.",
    },
    {
      en: [
        "Problem / product / proof",
        "Feature highlights",
        "Waitlist or contact form",
      ],
      fi: [
        "Ongelma / tuote / näyttö",
        "Ominaisuusnostot",
        "Waitlist- tai yhteydenottolomake",
      ],
    },
    {
      en: "Modern startup landing page with product story, features, and a waitlist form",
      fi: "Moderni startup-landing: tuotetarina, ominaisuudet ja waitlist-lomake",
    },
    {
      en: ["startup website", "startup landing page"],
      fi: ["startup verkkosivut", "startup landing page"],
    }
  ),
  uc(
    "saas",
    { en: "saas", fi: "ohjelmistotuote" },
    {
      en: "SaaS product website",
      fi: "SaaS-tuotteen verkkosivut",
    },
    {
      en: "Product-led SaaS site with benefits, pricing cues, and a demo request form.",
      fi: "Tuotevetoinen SaaS-sivusto hyödyillä, hinnoittelunostoilla ja demopyyntölomakkeella.",
    },
    {
      en: [
        "Benefit-led features",
        "Pricing section cues",
        "Demo / contact form",
      ],
      fi: [
        "Hyötyvetoiset ominaisuudet",
        "Hinnoitteluosio",
        "Demo- / yhteydenottolomake",
      ],
    },
    {
      en: "Clean SaaS marketing website with features, pricing cues, and a demo request form",
      fi: "Siisti SaaS-markkinointisivusto: ominaisuudet, hinnoittelu ja demopyyntölomake",
    },
    {
      en: ["SaaS website", "SaaS landing page"],
      fi: ["SaaS verkkosivut", "SaaS landing page"],
    }
  ),
  uc(
    "gym",
    { en: "gym", fi: "kuntosali" },
    {
      en: "Gym & studio website",
      fi: "Kuntosalin ja studion sivusto",
    },
    {
      en: "Classes, membership cues, and a join-inquiry form for gyms and studios.",
      fi: "Tunnit, jäsenyys ja liittymiskysely kuntosaleille ja studioille.",
    },
    {
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
    {
      en: "Bold gym and studio website with class types, membership options, and a trial signup form",
      fi: "Rohkea kuntosali- ja studiosivusto: tuntityypit, jäsenyydet ja kokeilulomake",
    },
    {
      en: ["gym website", "fitness studio website"],
      fi: ["kuntosali verkkosivut", "studio kotisivut"],
    }
  ),
  uc(
    "yoga",
    { en: "yoga", fi: "jooga" },
    {
      en: "Yoga studio website",
      fi: "Joogastudion verkkosivut",
    },
    {
      en: "Calm yoga site with class types, schedule cues, and a trial or contact form.",
      fi: "Rauhallinen joogasivusto tuntityypeillä, aikataulunostoilla ja kokeilu- tai yhteydenottolomakkeella.",
    },
    {
      en: [
        "Class styles and teachers",
        "Schedule cues",
        "Trial / contact form",
      ],
      fi: [
        "Tuntityylit ja opettajat",
        "Aikataulunostot",
        "Kokeilu- / yhteydenottolomake",
      ],
    },
    {
      en: "Calm yoga studio website with class styles, teachers, and a trial signup form",
      fi: "Rauhallinen joogastudion sivusto: tuntityylit, opettajat ja kokeilulomake",
    },
    {
      en: ["yoga studio website", "yoga website"],
      fi: ["jooga verkkosivut", "joogastudio kotisivut"],
    }
  ),
  uc(
    "personal-trainer",
    { en: "personal-trainer", fi: "valmentaja" },
    {
      en: "Personal trainer website",
      fi: "Personal trainerin sivusto",
    },
    {
      en: "Coach-led fitness site with programs and a consultation booking form.",
      fi: "Valmentajavetoinen fitness-sivusto ohjelmilla ja konsultaatiovarauslomakkeella.",
    },
    {
      en: [
        "Programs and coaching offer",
        "Results / about story",
        "Consultation form",
      ],
      fi: [
        "Ohjelmat ja valmennus",
        "Tulokset / tarina",
        "Konsultaatiolomake",
      ],
    },
    {
      en: "Energetic personal trainer website with programs, results, and a consultation form",
      fi: "Energinen personal trainer -sivusto: ohjelmat, tulokset ja konsultaatiolomake",
    },
    {
      en: ["personal trainer website", "PT website"],
      fi: ["personal trainer verkkosivut", "valmentaja kotisivut"],
    }
  ),
  uc(
    "clinic",
    { en: "clinic", fi: "klinikka" },
    {
      en: "Clinic & dentist website",
      fi: "Klinikan ja hammaslääkärin sivusto",
    },
    {
      en: "Calm clinical branding with services and an appointment request form.",
      fi: "Rauhallinen klinikkailme, palvelut ja ajanvarauspyyntö.",
    },
    {
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
    {
      en: "Calm private dental clinic website with services, team, and an appointment request form",
      fi: "Rauhallinen yksityisen hammaslääkäriklinikan sivusto: palvelut, tiimi ja ajanvarauslomake",
    },
    {
      en: ["clinic website", "dentist website"],
      fi: ["klinikka verkkosivut", "hammaslääkäri kotisivut"],
    }
  ),
  uc(
    "physiotherapy",
    { en: "physiotherapy", fi: "fysioterapia" },
    {
      en: "Physiotherapy clinic website",
      fi: "Fysioterapian verkkosivut",
    },
    {
      en: "Recovery-focused physio site with treatments and an appointment request form.",
      fi: "Kuntoutukseen keskittyvä fysioterapiasivusto hoidoilla ja ajanvarauspyynnöllä.",
    },
    {
      en: [
        "Treatments and specialties",
        "Therapist bios",
        "Appointment request form",
      ],
      fi: [
        "Hoidot ja erikoistumiset",
        "Terapeuttiesittelyt",
        "Ajanvarauspyyntö",
      ],
    },
    {
      en: "Clear physiotherapy clinic website with treatments, team, and an appointment form",
      fi: "Selkeä fysioterapiaklinikan sivusto: hoidot, tiimi ja ajanvarauslomake",
    },
    {
      en: ["physiotherapy website", "physical therapy website"],
      fi: ["fysioterapia verkkosivut", "fysioterapeutti kotisivut"],
    }
  ),
  uc(
    "veterinarian",
    { en: "veterinarian", fi: "elainlaakari" },
    {
      en: "Veterinary clinic website",
      fi: "Eläinlääkärin verkkosivut",
    },
    {
      en: "Caring vet clinic site with services, hours, and an appointment request form.",
      fi: "Huolehtiva eläinlääkäriklinikan sivusto palveluineen, aukioloineen ja ajanvarauspyynnöllä.",
    },
    {
      en: [
        "Pet services and emergencies",
        "Hours and location",
        "Appointment request form",
      ],
      fi: [
        "Lemmikkipalvelut ja päivystys",
        "Aukioloajat ja sijainti",
        "Ajanvarauspyyntö",
      ],
    },
    {
      en: "Warm veterinary clinic website with pet services, hours, and an appointment form",
      fi: "Lämmin eläinlääkäriklinikan sivusto: palvelut, aukioloajat ja ajanvarauslomake",
    },
    {
      en: ["veterinary clinic website", "vet website"],
      fi: ["eläinlääkäri verkkosivut", "eläinklinikka kotisivut"],
    }
  ),
  uc(
    "florist",
    { en: "florist", fi: "kukkakauppa" },
    {
      en: "Florist website",
      fi: "Kukkakaupan verkkosivut",
    },
    {
      en: "Seasonal arrangements, shop story, and an order inquiry form.",
      fi: "Sesongin kimput, tarina ja tilauskysely.",
    },
    {
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
    {
      en: "Soft florist website with seasonal arrangements, wedding packages, and an order inquiry form",
      fi: "Pehmeä kukkakaupan sivusto: sesongin kimput, hääpaketit ja tilauslomake",
    },
    {
      en: ["florist website", "flower shop website"],
      fi: ["kukkakauppa verkkosivut", "kukkakaupan kotisivut"],
    }
  ),
  uc(
    "boutique",
    { en: "boutique", fi: "putiikki" },
    {
      en: "Boutique & shop website",
      fi: "Putiikin verkkosivut",
    },
    {
      en: "Retail boutique site with collection cues, story, and a contact or order inquiry form.",
      fi: "Putiikkisivusto kokoelmanostoilla, tarinalla ja yhteydenotto- tai tilauskyselyllä.",
    },
    {
      en: [
        "Collection highlights",
        "Brand story",
        "Contact / order inquiry form",
      ],
      fi: [
        "Kokoelmanostot",
        "Bränditarina",
        "Yhteydenotto- / tilauskysely",
      ],
    },
    {
      en: "Stylish boutique website with collection highlights, brand story, and a contact form",
      fi: "Tyylikäs putiikkisivusto: kokoelmanostot, bränditarina ja yhteydenottolomake",
    },
    {
      en: ["boutique website", "retail shop website"],
      fi: ["putiikki verkkosivut", "erikoiskauppa kotisivut"],
    }
  ),
  uc(
    "jewelry",
    { en: "jewelry", fi: "koruliike" },
    {
      en: "Jewelry store website",
      fi: "Koruliikkeen verkkosivut",
    },
    {
      en: "Refined jewelry site with collections and a custom order or appointment form.",
      fi: "Hiottu koruliikesivusto kokoelmilla ja räätälöinti- tai ajanvarauslomakkeella.",
    },
    {
      en: [
        "Collections and craftsmanship",
        "Custom / repair cues",
        "Appointment or inquiry form",
      ],
      fi: [
        "Kokoelmat ja käsityö",
        "Räätälöinti / korjaus",
        "Ajanvaraus- tai kyselylomake",
      ],
    },
    {
      en: "Refined jewelry store website with collections, custom orders, and an appointment form",
      fi: "Hiottu koruliikkeen sivusto: kokoelmat, räätälöinti ja ajanvarauslomake",
    },
    {
      en: ["jewelry website", "jeweler website"],
      fi: ["koruliike verkkosivut", "kultasepänliike kotisivut"],
    }
  ),
  uc(
    "hotel",
    { en: "hotel", fi: "hotelli" },
    {
      en: "Hotel & lodging website",
      fi: "Hotellin ja majoituksen sivusto",
    },
    {
      en: "Hospitality site with rooms, amenities, and a booking inquiry form.",
      fi: "Majoitussivusto huoneilla, mukavuuksilla ja varauskyselyllä.",
    },
    {
      en: [
        "Rooms and amenities",
        "Location and experience",
        "Booking inquiry form",
      ],
      fi: [
        "Huoneet ja mukavuudet",
        "Sijainti ja kokemus",
        "Varauskyselylomake",
      ],
    },
    {
      en: "Warm boutique hotel website with rooms, amenities, and a booking inquiry form",
      fi: "Lämmin boutique-hotellin sivusto: huoneet, mukavuudet ja varauslomake",
    },
    {
      en: ["hotel website", "boutique hotel website"],
      fi: ["hotelli verkkosivut", "majoitus kotisivut"],
    }
  ),
  uc(
    "bnb",
    { en: "bed-and-breakfast", fi: "majoitus" },
    {
      en: "Bed & breakfast website",
      fi: "Majoituksen verkkosivut",
    },
    {
      en: "Homey B&B site with rooms, local tips, and a reservation inquiry form.",
      fi: "Kotoisa majoitussivusto huoneilla, paikallisvinkeillä ja varauskyselyllä.",
    },
    {
      en: [
        "Rooms and breakfast story",
        "Local area tips",
        "Reservation inquiry form",
      ],
      fi: [
        "Huoneet ja aamiaisitarina",
        "Paikallisvinkit",
        "Varauskyselylomake",
      ],
    },
    {
      en: "Homey bed and breakfast website with rooms, local tips, and a reservation inquiry form",
      fi: "Kotoisa majoitussivusto: huoneet, paikallisvinkit ja varauslomake",
    },
    {
      en: ["bed and breakfast website", "B&B website"],
      fi: ["majoitus verkkosivut", "bed and breakfast kotisivut"],
    }
  ),
  uc(
    "travel",
    { en: "travel-agency", fi: "matkatoimisto" },
    {
      en: "Travel agency website",
      fi: "Matkatoimiston verkkosivut",
    },
    {
      en: "Trip-selling travel site with destinations and a trip planning inquiry form.",
      fi: "Matkoja myyvä sivusto kohteilla ja matkasuunnittelukyselyllä.",
    },
    {
      en: [
        "Destination highlights",
        "Trip types and packages",
        "Trip planning form",
      ],
      fi: [
        "Kohdenostot",
        "Matkatyypit ja paketit",
        "Matkasuunnittelulomake",
      ],
    },
    {
      en: "Inspiring travel agency website with destinations, packages, and a trip planning form",
      fi: "Innostava matkatoimiston sivusto: kohteet, paketit ja matkasuunnittelulomake",
    },
    {
      en: ["travel agency website", "tour operator website"],
      fi: ["matkatoimisto verkkosivut", "matkanjärjestäjä kotisivut"],
    }
  ),
  uc(
    "wedding-planner",
    { en: "wedding-planner", fi: "haasuunnittelija" },
    {
      en: "Wedding planner website",
      fi: "Hääsuunnittelijan sivusto",
    },
    {
      en: "Romantic planner site with packages, gallery, and a consultation form.",
      fi: "Romanttinen suunnittelijasivusto paketeilla, gallerialla ja konsultaatiolomakkeella.",
    },
    {
      en: [
        "Packages and process",
        "Wedding gallery",
        "Consultation form",
      ],
      fi: [
        "Paketit ja prosessi",
        "Häagalleria",
        "Konsultaatiolomake",
      ],
    },
    {
      en: "Romantic wedding planner website with packages, gallery, and a consultation form",
      fi: "Romanttinen hääsuunnittelijan sivusto: paketit, galleria ja konsultaatiolomake",
    },
    {
      en: ["wedding planner website", "wedding coordinator website"],
      fi: ["hääsuunnittelija verkkosivut", "häät suunnittelu kotisivut"],
    }
  ),
  uc(
    "event-planner",
    { en: "event-planner", fi: "tapahtumajarjestaja" },
    {
      en: "Event planner website",
      fi: "Tapahtumajärjestäjän sivusto",
    },
    {
      en: "Event production site with services, past events, and a briefing form.",
      fi: "Tapahtumatuotannon sivusto palveluineen, referensseineen ja briefauslomakkeella.",
    },
    {
      en: [
        "Corporate and private events",
        "Past event highlights",
        "Event briefing form",
      ],
      fi: [
        "Yritys- ja yksityistapahtumat",
        "Referenssinostot",
        "Tapahtumabrieflomake",
      ],
    },
    {
      en: "Sharp event planner website with corporate and private events and a briefing form",
      fi: "Terävä tapahtumajärjestäjän sivusto: yritys- ja yksityistapahtumat sekä brieflomake",
    },
    {
      en: ["event planner website", "event production website"],
      fi: ["tapahtumajärjestäjä verkkosivut", "tapahtumatuotanto kotisivut"],
    }
  ),
  uc(
    "catering",
    { en: "catering", fi: "pitopalvelu" },
    {
      en: "Catering company website",
      fi: "Catering-yrityksen sivusto",
    },
    {
      en: "Food-led catering site with menus, occasions, and an event inquiry form.",
      fi: "Ruokavetoinen catering-sivusto menuilla, tilaisuuksilla ja tapahtumakyselyllä.",
    },
    {
      en: [
        "Menus and occasions",
        "Service style cues",
        "Event inquiry form",
      ],
      fi: [
        "Menut ja tilaisuudet",
        "Palvelutyylit",
        "Tapahtumakyselylomake",
      ],
    },
    {
      en: "Appetizing catering company website with menus, occasions, and an event inquiry form",
      fi: "Herkullinen catering-sivusto: menut, tilaisuudet ja tapahtumalomake",
    },
    {
      en: ["catering website", "catering company website"],
      fi: ["catering verkkosivut", "pitopalvelu kotisivut"],
    }
  ),
  uc(
    "daycare",
    { en: "daycare", fi: "paivakoti" },
    {
      en: "Daycare & preschool website",
      fi: "Päiväkodin verkkosivut",
    },
    {
      en: "Family-friendly daycare site with programs, values, and an enrollment inquiry form.",
      fi: "Perheystävällinen päiväkotisivusto ohjelmilla, arvoilla ja ilmoittautumiskyselyllä.",
    },
    {
      en: [
        "Programs and age groups",
        "Values and daily rhythm",
        "Enrollment inquiry form",
      ],
      fi: [
        "Ohjelmat ja ikäryhmät",
        "Arvot ja päivärytmi",
        "Ilmoittautumiskysely",
      ],
    },
    {
      en: "Warm daycare website with programs, values, and an enrollment inquiry form",
      fi: "Lämmin päiväkodin sivusto: ohjelmat, arvot ja ilmoittautumislomake",
    },
    {
      en: ["daycare website", "preschool website"],
      fi: ["päiväkoti verkkosivut", "varhaiskasvatus kotisivut"],
    }
  ),
  uc(
    "tutoring",
    { en: "tutoring", fi: "tukiopetus" },
    {
      en: "Tutoring & education website",
      fi: "Tukiopetuksen verkkosivut",
    },
    {
      en: "Tutor site with subjects, outcomes, and a trial lesson inquiry form.",
      fi: "Tukiopetussivusto aineilla, tuloksilla ja kokeilutuntikyselyllä.",
    },
    {
      en: [
        "Subjects and levels",
        "Outcomes and approach",
        "Trial lesson form",
      ],
      fi: [
        "Aineet ja tasot",
        "Tulokset ja lähestymistapa",
        "Kokeilutuntilomake",
      ],
    },
    {
      en: "Clear tutoring website with subjects, outcomes, and a trial lesson inquiry form",
      fi: "Selkeä tukiopetussivusto: aineet, tulokset ja kokeilutuntilomake",
    },
    {
      en: ["tutoring website", "tutor website"],
      fi: ["tukiopetus verkkosivut", "yksityisopetus kotisivut"],
    }
  ),
  uc(
    "driving-school",
    { en: "driving-school", fi: "autokoulu" },
    {
      en: "Driving school website",
      fi: "Autokoulun verkkosivut",
    },
    {
      en: "Driving school site with courses, pricing cues, and an enrollment form.",
      fi: "Autokoulusivusto kursseilla, hinnastonostoilla ja ilmoittautumislomakkeella.",
    },
    {
      en: [
        "Course types and licenses",
        "Pricing and packages",
        "Enrollment form",
      ],
      fi: [
        "Kurssityypit ja kortit",
        "Hinnasto ja paketit",
        "Ilmoittautumislomake",
      ],
    },
    {
      en: "Clear driving school website with courses, packages, and an enrollment form",
      fi: "Selkeä autokoulun sivusto: kurssit, paketit ja ilmoittautumislomake",
    },
    {
      en: ["driving school website"],
      fi: ["autokoulu verkkosivut", "autokoulun kotisivut"],
    }
  ),
  uc(
    "music-school",
    { en: "music-school", fi: "musiikkikoulu" },
    {
      en: "Music school website",
      fi: "Musiikkikoulun verkkosivut",
    },
    {
      en: "Music school site with instruments, teachers, and a trial lesson form.",
      fi: "Musiikkikoulusivusto soittimilla, opettajilla ja kokeilutuntilomakkeella.",
    },
    {
      en: [
        "Instruments and age groups",
        "Teachers and approach",
        "Trial lesson form",
      ],
      fi: [
        "Soittimet ja ikäryhmät",
        "Opettajat ja lähestymistapa",
        "Kokeilutuntilomake",
      ],
    },
    {
      en: "Warm music school website with instruments, teachers, and a trial lesson form",
      fi: "Lämmin musiikkikoulun sivusto: soittimet, opettajat ja kokeilutuntilomake",
    },
    {
      en: ["music school website", "music lessons website"],
      fi: ["musiikkikoulu verkkosivut", "musiikinopetus kotisivut"],
    }
  ),
  uc(
    "dance-studio",
    { en: "dance-studio", fi: "tanssikoulu" },
    {
      en: "Dance studio website",
      fi: "Tanssikoulun verkkosivut",
    },
    {
      en: "Energetic dance studio site with styles, schedule cues, and a trial class form.",
      fi: "Energinen tanssikoulusivusto tyyleillä, aikataulunostoilla ja kokeilutuntilomakkeella.",
    },
    {
      en: [
        "Dance styles and levels",
        "Schedule cues",
        "Trial class form",
      ],
      fi: [
        "Tanssityylit ja tasot",
        "Aikataulunostot",
        "Kokeilutuntilomake",
      ],
    },
    {
      en: "Energetic dance studio website with styles, schedule, and a trial class form",
      fi: "Energinen tanssikoulun sivusto: tyylit, aikataulu ja kokeilutuntilomake",
    },
    {
      en: ["dance studio website", "dance school website"],
      fi: ["tanssikoulu verkkosivut", "tanssistudio kotisivut"],
    }
  ),
  uc(
    "nonprofit",
    { en: "nonprofit", fi: "yhdistys" },
    {
      en: "Nonprofit & association website",
      fi: "Yhdistyksen verkkosivut",
    },
    {
      en: "Mission-led nonprofit site with programs, impact, and a volunteer or contact form.",
      fi: "Missiovetoinen yhdistyssivusto ohjelmilla, vaikuttavuudella ja vapaaehtois- tai yhteydenottolomakkeella.",
    },
    {
      en: [
        "Mission and programs",
        "Impact highlights",
        "Volunteer / contact form",
      ],
      fi: [
        "Missio ja ohjelmat",
        "Vaikuttavuusnostot",
        "Vapaaehtois- / yhteydenottolomake",
      ],
    },
    {
      en: "Mission-led nonprofit website with programs, impact, and a volunteer signup form",
      fi: "Missiovetoinen yhdistyssivusto: ohjelmat, vaikuttavuus ja vapaaehtoislomake",
    },
    {
      en: ["nonprofit website", "charity website"],
      fi: ["yhdistys verkkosivut", "järjestö kotisivut"],
    }
  ),
  uc(
    "church",
    { en: "church", fi: "seurakunta" },
    {
      en: "Church & congregation website",
      fi: "Seurakunnan verkkosivut",
    },
    {
      en: "Welcoming church site with services, community, and a contact or visit form.",
      fi: "Lämmin seurakuntasivusto palveluilla, yhteisöllä ja yhteydenotto- tai vierailulomakkeella.",
    },
    {
      en: [
        "Service times and events",
        "Community and ministries",
        "Visit / contact form",
      ],
      fi: [
        "Jumalanpalvelukset ja tapahtumat",
        "Yhteisö ja toiminta",
        "Vierailu- / yhteydenottolomake",
      ],
    },
    {
      en: "Welcoming church website with service times, community, and a visit inquiry form",
      fi: "Lämmin seurakunnan sivusto: palveluajat, yhteisö ja vierailulomake",
    },
    {
      en: ["church website", "congregation website"],
      fi: ["seurakunta verkkosivut", "kirkko kotisivut"],
    }
  ),
  uc(
    "podcast",
    { en: "podcast", fi: "podcastsivu" },
    {
      en: "Podcast website",
      fi: "Podcastin verkkosivut",
    },
    {
      en: "Show site with episode cues, hosts, and a guest or listen CTA form.",
      fi: "Podcastsivusto jaksonostoilla, hosteilla ja vieras- tai kuuntelu-CTA:lla.",
    },
    {
      en: [
        "Show premise and hosts",
        "Episode highlights",
        "Guest / contact form",
      ],
      fi: [
        "Ohjelman idea ja hostit",
        "Jaksonostot",
        "Vieras- / yhteydenottolomake",
      ],
    },
    {
      en: "Clean podcast website with show premise, episode highlights, and a guest pitch form",
      fi: "Siisti podcastsivusto: ohjelman idea, jaksot ja vieraspitch-lomake",
    },
    {
      en: ["podcast website", "podcast landing page"],
      fi: ["podcast verkkosivut", "podcast landing page"],
    }
  ),
  uc(
    "portfolio",
    { en: "portfolio", fi: "henkiloportfolio" },
    {
      en: "Personal portfolio website",
      fi: "Henkilökohtainen portfoliosivusto",
    },
    {
      en: "Personal portfolio with selected work, about, and a contact form.",
      fi: "Henkilöportfolio valituilla töillä, esittelyllä ja yhteydenottolomakkeella.",
    },
    {
      en: [
        "Selected work",
        "About and skills",
        "Contact form",
      ],
      fi: [
        "Valitut työt",
        "Esittely ja taidot",
        "Yhteydenottolomake",
      ],
    },
    {
      en: "Minimal personal portfolio website with selected work, about section, and a contact form",
      fi: "Minimalistinen henkilöportfolio: valitut työt, esittely ja yhteydenottolomake",
    },
    {
      en: ["portfolio website", "personal website"],
      fi: ["portfolio verkkosivut", "henkilökohtaiset kotisivut"],
    }
  ),
  uc(
    "pet-groomer",
    { en: "pet-groomer", fi: "elainhoitola" },
    {
      en: "Pet groomer website",
      fi: "Eläinhoitolan verkkosivut",
    },
    {
      en: "Friendly pet groomer site with services, packages, and a booking inquiry form.",
      fi: "Ystävällinen eläinhoitolasivusto palveluineen, paketeineen ja ajanvarauskyselyllä.",
    },
    {
      en: [
        "Grooming services and packages",
        "Care and safety cues",
        "Booking inquiry form",
      ],
      fi: [
        "Hoitopalvelut ja paketit",
        "Huolenpito ja turvallisuus",
        "Ajanvarauskysely",
      ],
    },
    {
      en: "Friendly pet groomer website with services, packages, and a booking inquiry form",
      fi: "Ystävällinen eläinhoitolan sivusto: palvelut, paketit ja ajanvarauslomake",
    },
    {
      en: ["pet groomer website", "dog grooming website"],
      fi: ["eläinhoitola verkkosivut", "koiranhoito kotisivut"],
    }
  ),
  uc(
    "it-support",
    { en: "it-support", fi: "it-tuki" },
    {
      en: "IT support company website",
      fi: "IT-tuen verkkosivut",
    },
    {
      en: "Practical IT support site with services for SMEs and a support request form.",
      fi: "Käytännöllinen IT-tukisivusto PK-palveluilla ja tukipyyntölomakkeella.",
    },
    {
      en: [
        "Managed IT and helpdesk",
        "SME-focused clarity",
        "Support request form",
      ],
      fi: [
        "Hallittu IT ja helpdesk",
        "PK-yrityksille selkeästi",
        "Tukipyyntölomake",
      ],
    },
    {
      en: "Practical IT support company website with managed services and a support request form",
      fi: "Käytännöllinen IT-tukifirman sivusto: hallitut palvelut ja tukipyyntölomake",
    },
    {
      en: ["IT support website", "MSP website"],
      fi: ["IT-tuki verkkosivut", "tietotuki kotisivut"],
    }
  ),
  uc(
    "insurance",
    { en: "insurance", fi: "vakuutus" },
    {
      en: "Insurance broker website",
      fi: "Vakuutusmeklarin sivusto",
    },
    {
      en: "Trust-first insurance site with coverage areas and a quote inquiry form.",
      fi: "Luottamusta rakentava vakuutussivusto kattavuusalueilla ja tarjouskyselyllä.",
    },
    {
      en: [
        "Personal and business coverage",
        "Advisor trust cues",
        "Quote inquiry form",
      ],
      fi: [
        "Henkilö- ja yritysvakuutukset",
        "Neuvojan luottamus",
        "Tarjouskyselylomake",
      ],
    },
    {
      en: "Trustworthy insurance broker website with coverage areas and a quote inquiry form",
      fi: "Luotettava vakuutusmeklarin sivusto: kattavuudet ja tarjouskyselylomake",
    },
    {
      en: ["insurance website", "insurance broker website"],
      fi: ["vakuutus verkkosivut", "vakuutusmeklari kotisivut"],
    }
  ),
  uc(
    "optician",
    { en: "optician", fi: "optikko" },
    {
      en: "Optician website",
      fi: "Optikon verkkosivut",
    },
    {
      en: "Clear optician site with eye exams, frames, and an appointment form.",
      fi: "Selkeä optikkosivusto näöntarkastuksilla, kehyksillä ja ajanvarauslomakkeella.",
    },
    {
      en: [
        "Eye exams and products",
        "Brand / frame cues",
        "Appointment form",
      ],
      fi: [
        "Näöntarkastukset ja tuotteet",
        "Kehysnostot",
        "Ajanvarauslomake",
      ],
    },
    {
      en: "Clear optician website with eye exams, frames, and an appointment request form",
      fi: "Selkeä optikon sivusto: näöntarkastukset, kehykset ja ajanvarauslomake",
    },
    {
      en: ["optician website", "eye care website"],
      fi: ["optikko verkkosivut", "optikkoliike kotisivut"],
    }
  ),
  uc(
    "pharmacy",
    { en: "pharmacy", fi: "apteekki" },
    {
      en: "Pharmacy website",
      fi: "Apteekin verkkosivut",
    },
    {
      en: "Local pharmacy site with services, hours, and a contact or refill inquiry form.",
      fi: "Paikallinen apteekkisivusto palveluineen, aukioloineen ja yhteydenotto- tai uusintakyselyllä.",
    },
    {
      en: [
        "Services and health advice cues",
        "Hours and location",
        "Contact / inquiry form",
      ],
      fi: [
        "Palvelut ja neuvonta",
        "Aukioloajat ja sijainti",
        "Yhteydenotto- / kyselylomake",
      ],
    },
    {
      en: "Local pharmacy website with services, hours, and a contact inquiry form",
      fi: "Paikallinen apteekin sivusto: palvelut, aukioloajat ja yhteydenottolomake",
    },
    {
      en: ["pharmacy website"],
      fi: ["apteekki verkkosivut", "apteekin kotisivut"],
    }
  ),
  uc(
    "farm",
    { en: "farm", fi: "maatila" },
    {
      en: "Farm & local produce website",
      fi: "Maatilan verkkosivut",
    },
    {
      en: "Farm site with produce, story, and an order or visit inquiry form.",
      fi: "Maatilasivusto tuotteilla, tarinalla ja tilaus- tai vierailukyselyllä.",
    },
    {
      en: [
        "Produce and seasons",
        "Farm story",
        "Order / visit form",
      ],
      fi: [
        "Tuotteet ja sesongit",
        "Tilatarina",
        "Tilaus- / vierailulomake",
      ],
    },
    {
      en: "Warm local farm website with seasonal produce, farm story, and an order inquiry form",
      fi: "Lämmin maatilasivusto: sesonkituotteet, tilatarina ja tilauslomake",
    },
    {
      en: ["farm website", "farm shop website"],
      fi: ["maatila verkkosivut", "tilakauppa kotisivut"],
    }
  ),
  uc(
    "brewery",
    { en: "brewery", fi: "panimo" },
    {
      en: "Brewery website",
      fi: "Panimon verkkosivut",
    },
    {
      en: "Craft brewery site with beers, taproom cues, and an events or contact form.",
      fi: "Käsittepanimosivusto oluilla, taproom-nostoilla ja tapahtuma- tai yhteydenottolomakkeella.",
    },
    {
      en: [
        "Beer lineup and story",
        "Taproom / hours",
        "Events or contact form",
      ],
      fi: [
        "Olutvalikoima ja tarina",
        "Taproom / aukiolo",
        "Tapahtuma- tai yhteydenottolomake",
      ],
    },
    {
      en: "Craft brewery website with beer lineup, taproom hours, and an events contact form",
      fi: "Käsittepanimon sivusto: oluet, taproom-aukiolot ja tapahtumalomake",
    },
    {
      en: ["brewery website", "craft brewery website"],
      fi: ["panimo verkkosivut", "pienpanimo kotisivut"],
    }
  ),
  uc(
    "bike-shop",
    { en: "bike-shop", fi: "pyoraliike" },
    {
      en: "Bike shop website",
      fi: "Pyöräliikkeen verkkosivut",
    },
    {
      en: "Bike shop site with service, brands, and a repair or contact form.",
      fi: "Pyöräliikesivusto huollolla, merkeillä ja korjaus- tai yhteydenottolomakkeella.",
    },
    {
      en: [
        "Sales and service",
        "Brand highlights",
        "Repair / contact form",
      ],
      fi: [
        "Myynti ja huolto",
        "Merkkinostot",
        "Korjaus- / yhteydenottolomake",
      ],
    },
    {
      en: "Active bike shop website with sales, service, and a repair booking form",
      fi: "Aktiivinen pyöräliikkeen sivusto: myynti, huolto ja korjausvarauslomake",
    },
    {
      en: ["bike shop website", "bicycle shop website"],
      fi: ["pyöräliike verkkosivut", "pyörähuolto kotisivut"],
    }
  ),
  uc(
    "security",
    { en: "security", fi: "turvallisuuspalvelu" },
    {
      en: "Security company website",
      fi: "Turvallisuuspalvelun sivusto",
    },
    {
      en: "Professional security firm site with services and a site assessment form.",
      fi: "Ammattimainen turvallisuusyrityksen sivusto palveluineen ja kohdearviointilomakkeella.",
    },
    {
      en: [
        "Guarding and systems",
        "Trust and compliance cues",
        "Site assessment form",
      ],
      fi: [
        "Vartiointi ja järjestelmät",
        "Luottamus ja vaatimukset",
        "Kohdearviointilomake",
      ],
    },
    {
      en: "Professional security company website with services and a site assessment request form",
      fi: "Ammattimainen turvallisuuspalvelun sivusto: palvelut ja kohdearviointilomake",
    },
    {
      en: ["security company website", "security services website"],
      fi: ["turvallisuuspalvelu verkkosivut", "vartiointi kotisivut"],
    }
  ),
  uc(
    "pest-control",
    { en: "pest-control", fi: "tuholaistorjunta" },
    {
      en: "Pest control website",
      fi: "Tuholaistorjunnan sivusto",
    },
    {
      en: "Problem-solving pest control site with treatments and a fast quote form.",
      fi: "Ongelmanratkaiseva tuholaistorjuntasivusto hoidoilla ja nopealla tarjouslomakkeella.",
    },
    {
      en: [
        "Residential and commercial treatments",
        "Fast response cues",
        "Quote request form",
      ],
      fi: [
        "Koti- ja yrityshoidot",
        "Nopea vaste",
        "Tarjouspyyntölomake",
      ],
    },
    {
      en: "Straightforward pest control website with treatments and a fast quote request form",
      fi: "Suora tuholaistorjunnan sivusto: hoidot ja nopea tarjouslomake",
    },
    {
      en: ["pest control website"],
      fi: ["tuholaistorjunta verkkosivut", "tuholaiset kotisivut"],
    }
  ),
  uc(
    "funeral-home",
    { en: "funeral-home", fi: "hautaustoimisto" },
    {
      en: "Funeral home website",
      fi: "Hautaustoimiston verkkosivut",
    },
    {
      en: "Respectful funeral home site with services and a confidential contact form.",
      fi: "Kunnioittava hautaustoimistosivusto palveluineen ja luottamuksellisella yhteydenottolomakkeella.",
    },
    {
      en: [
        "Services and guidance",
        "Calm, respectful tone",
        "Confidential contact form",
      ],
      fi: [
        "Palvelut ja ohjaus",
        "Rauhallinen, kunnioittava sävy",
        "Luottamuksellinen yhteydenotto",
      ],
    },
    {
      en: "Respectful funeral home website with services, guidance, and a confidential contact form",
      fi: "Kunnioittava hautaustoimiston sivusto: palvelut, ohjaus ja luottamuksellinen lomake",
    },
    {
      en: ["funeral home website"],
      fi: ["hautaustoimisto verkkosivut", "hautauspalvelu kotisivut"],
    }
  ),
  uc(
    "language-school",
    { en: "language-school", fi: "kielikoulu" },
    {
      en: "Language school website",
      fi: "Kielikoulun verkkosivut",
    },
    {
      en: "Language school site with courses, levels, and a placement or trial form.",
      fi: "Kielikoulusivusto kursseilla, tasoilla ja tasotesti- tai kokeilulomakkeella.",
    },
    {
      en: [
        "Courses and languages",
        "Levels and formats",
        "Trial / placement form",
      ],
      fi: [
        "Kurssit ja kielet",
        "Tasot ja muodot",
        "Kokeilu- / tasotestilomake",
      ],
    },
    {
      en: "Clear language school website with courses, levels, and a trial class form",
      fi: "Selkeä kielikoulun sivusto: kurssit, tasot ja kokeilutuntilomake",
    },
    {
      en: ["language school website", "language courses website"],
      fi: ["kielikoulu verkkosivut", "kieltenopetus kotisivut"],
    }
  ),
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

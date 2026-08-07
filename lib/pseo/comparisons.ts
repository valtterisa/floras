import type { Locale } from "@/i18n/routing";

export type Comparison = {
  id: string;
  competitor: string;
  slugs: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  summary: Record<Locale, string>;
  florasWins: Record<Locale, string[]>;
  competitorWins: Record<Locale, string[]>;
  bestForFloras: Record<Locale, string>;
  bestForCompetitor: Record<Locale, string>;
  keywords: Record<Locale, string[]>;
};

function cmp(
  id: string,
  competitor: string,
  slugs: Record<Locale, string>,
  title: Record<Locale, string>,
  description: Record<Locale, string>,
  summary: Record<Locale, string>,
  florasWins: Record<Locale, string[]>,
  competitorWins: Record<Locale, string[]>,
  bestForFloras: Record<Locale, string>,
  bestForCompetitor: Record<Locale, string>,
  keywords: Record<Locale, string[]>
): Comparison {
  return {
    id,
    competitor,
    slugs,
    title,
    description,
    summary,
    florasWins,
    competitorWins,
    bestForFloras,
    bestForCompetitor,
    keywords,
  };
}

export const COMPARISONS: Comparison[] = [
  cmp(
    "wordpress",
    "WordPress",
    { en: "wordpress", fi: "wordpress" },
    {
      en: "Floras vs WordPress",
      fi: "Floras vs WordPress",
    },
    {
      en: "Compare Floras and WordPress for building a business website — speed, maintenance, and who each is best for.",
      fi: "Vertaa Florasta ja WordPressiä yrityssivuston rakentamiseen — nopeus, ylläpito ja kenelle kumpi sopii.",
    },
    {
      en: "WordPress is a flexible CMS with plugins for almost anything. Floras turns a plain-English brief into a live Astro site you refine in chat — without themes, hosting stacks, or plugin upkeep.",
      fi: "WordPress on joustava CMS, johon saa lähes mitä tahansa plugineilla. Floras muuttaa suomen- tai englanninkielisen briefin live-Astro-sivustoksi, jota hiot chatissa — ilman teemoja, hosting-pinoa tai plugin-ylläpitoa.",
    },
    {
      en: [
        "Site from one sentence, live preview in minutes",
        "No themes, plugins, or PHP updates to manage",
        "Chat to tweak copy, layout, and sections",
        "Publish to floras.app hosting on Pro",
      ],
      fi: [
        "Sivusto yhdellä lauseella, live-esikatselu minuuteissa",
        "Ei teemoja, plugineja tai PHP-päivityksiä",
        "Hio copya, layoutia ja osioita chatissa",
        "Julkaisu floras.app-hostingiin Prolla",
      ],
    },
    {
      en: [
        "Huge plugin and theme ecosystem",
        "Full control for developers and agencies",
        "Blog and complex content models at scale",
      ],
      fi: [
        "Valtava plugin- ja teemaekosysteemi",
        "Täysi kontrolli kehittäjille ja toimistoille",
        "Blogi ja monimutkaiset sisältömallit skaalassa",
      ],
    },
    {
      en: "Small businesses that want a polished marketing site fast without learning WordPress.",
      fi: "PK-yrityksille jotka haluavat hiottun markkinointisivuston nopeasti ilman WordPress-opettelua.",
    },
    {
      en: "Teams that need deep customization, editorial workflows, or a large plugin-driven stack.",
      fi: "Tiimeille jotka tarvitsevat syvää räätälöintiä, toimitustyötä tai laajaa plugin-pinoa.",
    },
    {
      en: ["Floras vs WordPress", "WordPress alternative", "AI website builder vs WordPress"],
      fi: ["Floras vs WordPress", "WordPress vaihtoehto", "AI-sivustonrakentaja vs WordPress"],
    }
  ),
  cmp(
    "wix",
    "Wix",
    { en: "wix", fi: "wix" },
    {
      en: "Floras vs Wix",
      fi: "Floras vs Wix",
    },
    {
      en: "Floras vs Wix: AI chat site building versus drag-and-drop templates for small business sites.",
      fi: "Floras vs Wix: AI-chat-sivustonrakennus vastaan drag-and-drop-pohjat PK-sivustoille.",
    },
    {
      en: "Wix gives you a visual editor and templates. Floras generates a real site from your description and lets you iterate in conversation instead of dragging boxes.",
      fi: "Wix tarjoaa visuaalisen editorin ja pohjat. Floras generoi oikean sivuston kuvauksestasi ja antaa iteroida keskustelussa — ei laatikoita raahaamalla.",
    },
    {
      en: [
        "Describe once, get a full site draft",
        "Iterate in chat instead of pixel nudging",
        "Astro-based sites, not locked template kits",
        "Lead forms land in your Floras inbox",
      ],
      fi: [
        "Kuvaile kerran, saa kokonainen sivustoluonnos",
        "Iteroi chatissa pikselin siirtelyn sijaan",
        "Astro-sivustot, ei lukittuja pohjapaketteja",
        "Liidilomakkeet Floras-postilaatikkoon",
      ],
    },
    {
      en: [
        "Mature drag-and-drop editor",
        "App market for bookings, stores, and more",
        "Familiar for non-technical DIY users",
      ],
      fi: [
        "Kypsä drag-and-drop-editori",
        "App-markkinapaikka varauksille, kaupalle ym.",
        "Tuttu ei-teknisille DIY-käyttäjille",
      ],
    },
    {
      en: "Owners who prefer writing a brief over learning an editor.",
      fi: "Yrittäjille jotka mieluummin kirjoittavat briefin kuin opettelevat editoria.",
    },
    {
      en: "Users who want hands-on visual control and Wix’s app ecosystem.",
      fi: "Käyttäjille jotka haluavat visuaalisen kontrollin ja Wixin app-ekosysteemin.",
    },
    {
      en: ["Floras vs Wix", "Wix alternative", "AI website builder vs Wix"],
      fi: ["Floras vs Wix", "Wix vaihtoehto", "AI-sivustonrakentaja vs Wix"],
    }
  ),
  cmp(
    "squarespace",
    "Squarespace",
    { en: "squarespace", fi: "squarespace" },
    {
      en: "Floras vs Squarespace",
      fi: "Floras vs Squarespace",
    },
    {
      en: "Floras vs Squarespace for beautiful business websites — design templates versus AI generation.",
      fi: "Floras vs Squarespace kauniisiin yrityssivustoihin — design-pohjat vastaan AI-generointi.",
    },
    {
      en: "Squarespace is known for polished templates. Floras aims for the same quality bar from a sentence, then chat refinements — without picking and configuring a template family.",
      fi: "Squarespace tunnetaan hiotuista pohjista. Floras tavoittelee samaa laatua yhdellä lauseella ja chat-hiomisella — ilman pohjaperheen valintaa ja säätöä.",
    },
    {
      en: [
        "Start from intent, not template browsing",
        "Chat-driven layout and copy changes",
        "Fast path from idea to live preview",
        "Hosting and publish on Pro",
      ],
      fi: [
        "Aloita tarkoituksesta, älä pohjaselailusta",
        "Chat-vetoiset layout- ja copy-muutokset",
        "Nopea polku ideasta live-esikatseluun",
        "Hosting ja julkaisu Prolla",
      ],
    },
    {
      en: [
        "Strong curated design system",
        "Commerce and scheduling add-ons",
        "Brand-consistent template families",
      ],
      fi: [
        "Vahva kuratoitu design-järjestelmä",
        "Kauppa- ja ajanvarauslisät",
        "Brändiyhtenäiset pohjaperheet",
      ],
    },
    {
      en: "Teams that want a custom-feeling site without template shopping.",
      fi: "Tiimeille jotka haluavat räätälöidyn tuntuiset sivut ilman pohjaoshoppailua.",
    },
    {
      en: "Brands that love Squarespace’s look and built-in commerce tooling.",
      fi: "Brändeille jotka rakastavat Squarespacen ilmettä ja kauppatyökaluja.",
    },
    {
      en: ["Floras vs Squarespace", "Squarespace alternative"],
      fi: ["Floras vs Squarespace", "Squarespace vaihtoehto"],
    }
  ),
  cmp(
    "webflow",
    "Webflow",
    { en: "webflow", fi: "webflow" },
    {
      en: "Floras vs Webflow",
      fi: "Floras vs Webflow",
    },
    {
      en: "Floras vs Webflow: AI site generation versus professional visual development.",
      fi: "Floras vs Webflow: AI-sivustogenerointi vastaan ammattimainen visuaalinen kehitys.",
    },
    {
      en: "Webflow is a pro visual development tool. Floras is for business owners who want a finished marketing site from a prompt — not a design system to master.",
      fi: "Webflow on ammattilaisen visuaalinen kehitystyökalu. Floras on yrittäjille jotka haluavat valmiin markkinointisivuston promptilla — ei design-järjestelmää opeteltavaksi.",
    },
    {
      en: [
        "Zero learning curve for site structure",
        "Prompt + chat instead of Designer skills",
        "Built for small business marketing sites",
        "Preview and publish without CMS setup",
      ],
      fi: [
        "Ei oppimiskäyrää sivurakenteelle",
        "Prompt + chat Designer-osaamisen sijaan",
        "Rakennettu PK-markkinointisivustoille",
        "Esikatselu ja julkaisu ilman CMS-setuppia",
      ],
    },
    {
      en: [
        "Pixel-level design control",
        "CMS collections and interactions",
        "Ideal for designers and agencies",
      ],
      fi: [
        "Pikselitason design-kontrolli",
        "CMS-kokoelmat ja interaktiot",
        "Ihanteellinen suunnittelijoille ja toimistoille",
      ],
    },
    {
      en: "Owners who need a site, not a career in Webflow Designer.",
      fi: "Yrittäjille jotka tarvitsevat sivuston, eivät uraa Webflow Designerissa.",
    },
    {
      en: "Designers shipping complex marketing sites with custom interactions.",
      fi: "Suunnittelijoille jotka tekevät monimutkaisia markkinointisivustoja custom-interaktioilla.",
    },
    {
      en: ["Floras vs Webflow", "Webflow alternative", "AI alternative to Webflow"],
      fi: ["Floras vs Webflow", "Webflow vaihtoehto"],
    }
  ),
  cmp(
    "framer",
    "Framer",
    { en: "framer", fi: "framer" },
    {
      en: "Floras vs Framer",
      fi: "Floras vs Framer",
    },
    {
      en: "Floras vs Framer for marketing sites — conversational generation versus design-led canvas.",
      fi: "Floras vs Framer markkinointisivustoille — keskustelugenerointi vastaan design-vetoinen canvas.",
    },
    {
      en: "Framer blends design and publishing with a powerful canvas. Floras skips the canvas: describe the business, preview the site, refine in chat.",
      fi: "Framer yhdistää designin ja julkaisun tehokkaalla canvaksella. Floras ohittaa canvauksen: kuvaile yritys, esikatsele, hio chatissa.",
    },
    {
      en: [
        "No canvas or component system to learn",
        "Business brief → live site",
        "Chat edits for non-designers",
        "Lead capture into Floras inbox",
      ],
      fi: [
        "Ei canvasta tai komponenttijärjestelmää opeteltavaksi",
        "Yritysbrief → live-sivusto",
        "Chat-muokkaukset ei-suunnittelijoille",
        "Liidien keruu Floras-postilaatikkoon",
      ],
    },
    {
      en: [
        "Excellent motion and visual polish",
        "Design-first workflow",
        "Strong for product marketing sites",
      ],
      fi: [
        "Erinomainen liike ja visuaalinen hiottuus",
        "Design-first-työnkulku",
        "Vahva tuotemarkkinointisivustoille",
      ],
    },
    {
      en: "Local and service businesses that want speed over design tooling.",
      fi: "Paikallisille ja palveluyrityksille joille nopeus voittaa design-työkalut.",
    },
    {
      en: "Designers who want Framer’s motion and canvas control.",
      fi: "Suunnittelijoille jotka haluavat Framerin liikkeen ja canvas-kontrollin.",
    },
    {
      en: ["Floras vs Framer", "Framer alternative"],
      fi: ["Floras vs Framer", "Framer vaihtoehto"],
    }
  ),
  cmp(
    "shopify",
    "Shopify",
    { en: "shopify", fi: "shopify" },
    {
      en: "Floras vs Shopify",
      fi: "Floras vs Shopify",
    },
    {
      en: "Floras vs Shopify: marketing brochure sites versus full ecommerce stores.",
      fi: "Floras vs Shopify: markkinointisivustot vastaan täysi verkkokauppa.",
    },
    {
      en: "Shopify is built to sell products online. Floras builds marketing and lead-gen sites — menus, services, portfolios, and contact forms — not a full cart checkout stack.",
      fi: "Shopify on rakennettu myymään tuotteita verkossa. Floras rakentaa markkinointi- ja liidisivustoja — menuja, palveluita, portfolioita ja lomakkeita — ei täyttä ostoskori-stackia.",
    },
    {
      en: [
        "Ideal for service and brochure sites",
        "Faster than setting up a store theme",
        "Inquiry forms instead of checkout complexity",
        "Chat-based site iteration",
      ],
      fi: [
        "Ihanteellinen palvelu- ja esittelysivustoille",
        "Nopeampi kuin kauppapohjan pystytys",
        "Kyselylomakkeet checkout-kompleksisuuden sijaan",
        "Chat-pohjainen sivuston iterointi",
      ],
    },
    {
      en: [
        "Native ecommerce, payments, and inventory",
        "App ecosystem for stores",
        "Built for product catalogs",
      ],
      fi: [
        "Natiivi verkkokauppa, maksut ja varasto",
        "App-ekosysteemi kaupoille",
        "Rakennettu tuotekatalogeille",
      ],
    },
    {
      en: "Businesses that need leads and credibility, not a shopping cart.",
      fi: "Yrityksille jotka tarvitsevat liidejä ja uskottavuutta, eivät ostoskoria.",
    },
    {
      en: "Merchants selling products with payments and inventory.",
      fi: "Kauppiaille jotka myyvät tuotteita maksuilla ja varastolla.",
    },
    {
      en: ["Floras vs Shopify", "Shopify alternative for brochure sites"],
      fi: ["Floras vs Shopify", "Shopify vaihtoehto esittelysivustolle"],
    }
  ),
  cmp(
    "carrd",
    "Carrd",
    { en: "carrd", fi: "carrd" },
    {
      en: "Floras vs Carrd",
      fi: "Floras vs Carrd",
    },
    {
      en: "Floras vs Carrd for one-page and small business sites.",
      fi: "Floras vs Carrd yksisivuisille ja PK-sivustoille.",
    },
    {
      en: "Carrd is great for simple one-pagers you assemble yourself. Floras generates a fuller business site from a prompt and keeps iterating via chat.",
      fi: "Carrd on loistava yksinkertaisiin one-pagereihin jotka kokoat itse. Floras generoi täydemmän yrityssivuston promptilla ja jatkaa iterointia chatissa.",
    },
    {
      en: [
        "Richer multi-section business sites",
        "AI-generated structure and copy",
        "Chat refinements over manual blocks",
        "Inbox for form submissions",
      ],
      fi: [
        "Rikkaammat moniosioiset yrityssivustot",
        "AI-generoitu rakenne ja copy",
        "Chat-hiominen manuaalisten lohkojen sijaan",
        "Postilaatikko lomakevastauksille",
      ],
    },
    {
      en: [
        "Extremely lightweight and cheap",
        "Fast DIY one-pagers",
        "Simple personal / link-in-bio sites",
      ],
      fi: [
        "Erittäin kevyt ja edullinen",
        "Nopeat DIY-one-pagerit",
        "Yksinkertaiset henkilö- / link-in-bio-sivut",
      ],
    },
    {
      en: "Local businesses that need more than a minimal one-pager.",
      fi: "Paikallisille yrityksille jotka tarvitsevat enemmän kuin minimalistisen one-pagerin.",
    },
    {
      en: "Tiny one-page needs where Carrd’s simplicity wins.",
      fi: "Pieniin one-page-tarpeisiin joissa Carrdin yksinkertaisuus voittaa.",
    },
    {
      en: ["Floras vs Carrd", "Carrd alternative"],
      fi: ["Floras vs Carrd", "Carrd vaihtoehto"],
    }
  ),
  cmp(
    "lovable",
    "Lovable",
    { en: "lovable", fi: "lovable" },
    {
      en: "Floras vs Lovable",
      fi: "Floras vs Lovable",
    },
    {
      en: "Floras vs Lovable: AI website builder for businesses versus AI app builder.",
      fi: "Floras vs Lovable: AI-sivustonrakentaja yrityksille vastaan AI-app-rakentaja.",
    },
    {
      en: "Lovable focuses on generating apps and software UIs. Floras is specialized for production marketing websites with preview, chat edits, and publish.",
      fi: "Lovable keskittyy appien ja softa-UI:den generointiin. Floras on erikoistunut tuotantomarkkinointisivustoihin: esikatselu, chat-muokkaukset ja julkaisu.",
    },
    {
      en: [
        "Purpose-built for business websites",
        "Live preview and publish flow",
        "Lead forms into Floras inbox",
        "Hosting on floras.app (Pro)",
      ],
      fi: [
        "Rakennettu yrityssivustoille",
        "Live-esikatselu ja julkaisupolku",
        "Liidilomakkeet Floras-postilaatikkoon",
        "Hosting floras.appissa (Pro)",
      ],
    },
    {
      en: [
        "Strong for app and product UI generation",
        "Broader software prototyping",
        "Dev-oriented iteration loops",
      ],
      fi: [
        "Vahva app- ja tuote-UI-generointiin",
        "Laajempi softaprototyyppaus",
        "Dev-orientoituneet iteraatiot",
      ],
    },
    {
      en: "Business owners shipping a real marketing site.",
      fi: "Yrittäjille jotka julkaisevat oikean markkinointisivuston.",
    },
    {
      en: "Builders prototyping apps and product interfaces.",
      fi: "Rakentajille jotka prototyyppaavat appeja ja tuote-UI:ta.",
    },
    {
      en: ["Floras vs Lovable", "Lovable alternative for websites"],
      fi: ["Floras vs Lovable", "Lovable vaihtoehto sivustoille"],
    }
  ),
  cmp(
    "durable",
    "Durable",
    { en: "durable", fi: "durable" },
    {
      en: "Floras vs Durable",
      fi: "Floras vs Durable",
    },
    {
      en: "Floras vs Durable AI website builders for small businesses.",
      fi: "Floras vs Durable AI-sivustonrakentajat PK-yrityksille.",
    },
    {
      en: "Both aim to generate small business sites with AI. Floras emphasizes chat refinement, Astro output, and a clear preview-to-publish path.",
      fi: "Molemmat generoivat PK-sivustoja AI:lla. Floras painottaa chat-hiomista, Astro-tulostetta ja selkeää esikatselu→julkaisu-polkua.",
    },
    {
      en: [
        "Chat-native refinements",
        "Astro sites with live sandbox preview",
        "BYOK and Pro billing options",
        "Form submissions in-product inbox",
      ],
      fi: [
        "Chat-natiivit hiomiset",
        "Astro-sivustot live-sandbox-esikatselulla",
        "BYOK- ja Pro-laskutusvaihtoehdot",
        "Lomakevastaukset tuote-inboxissa",
      ],
    },
    {
      en: [
        "Established AI small-business positioning",
        "All-in-one business tool framing",
        "Quick generate flows",
      ],
      fi: [
        "Vakiintunut AI-PK-positiointi",
        "All-in-one-liiketoimintatyökalu",
        "Nopeat generate-flowt",
      ],
    },
    {
      en: "Users who want chat-driven Astro sites and Floras hosting.",
      fi: "Käyttäjille jotka haluavat chat-vetoiset Astro-sivustot ja Floras-hostingin.",
    },
    {
      en: "Users already happy inside Durable’s broader business toolkit.",
      fi: "Käyttäjille jotka ovat jo Durable-työkalupaketin sisällä.",
    },
    {
      en: ["Floras vs Durable", "Durable alternative"],
      fi: ["Floras vs Durable", "Durable vaihtoehto"],
    }
  ),
  cmp(
    "v0",
    "v0",
    { en: "v0", fi: "v0" },
    {
      en: "Floras vs v0",
      fi: "Floras vs v0",
    },
    {
      en: "Floras vs v0 by Vercel — business websites versus UI generation for developers.",
      fi: "Floras vs v0 (Vercel) — yrityssivustot vastaan UI-generointi kehittäjille.",
    },
    {
      en: "v0 generates UI components for developers to drop into apps. Floras generates and hosts complete marketing websites for business owners.",
      fi: "v0 generoi UI-komponentteja kehittäjille. Floras generoi ja hostaa kokonaisia markkinointisivustoja yrittäjille.",
    },
    {
      en: [
        "End-to-end website, not just components",
        "No React/Next wiring required",
        "Publish and custom domains (Pro)",
        "Built for non-developers",
      ],
      fi: [
        "Kokonainen sivusto, ei vain komponentteja",
        "Ei React/Next-kytkentää",
        "Julkaisu ja custom-domainit (Pro)",
        "Rakennettu ei-kehittäjille",
      ],
    },
    {
      en: [
        "Excellent shadcn/UI generation",
        "Fits developer workflows",
        "Great for app UI experiments",
      ],
      fi: [
        "Erinomainen shadcn/UI-generointi",
        "Sopii kehittäjätyönkulkuihin",
        "Hyvä app-UI-kokeiluihin",
      ],
    },
    {
      en: "Business owners launching a public marketing site.",
      fi: "Yrittäjille jotka julkaisevat julkisen markkinointisivuston.",
    },
    {
      en: "Developers assembling UI inside existing codebases.",
      fi: "Kehittäjille jotka kokoavat UI:ta olemassa oleviin codebaaseihin.",
    },
    {
      en: ["Floras vs v0", "v0 alternative for websites"],
      fi: ["Floras vs v0", "v0 vaihtoehto sivustoille"],
    }
  ),
  cmp(
    "jimdo",
    "Jimdo",
    { en: "jimdo", fi: "jimdo" },
    {
      en: "Floras vs Jimdo",
      fi: "Floras vs Jimdo",
    },
    {
      en: "Floras vs Jimdo website builders for small businesses.",
      fi: "Floras vs Jimdo sivustonrakentajat PK-yrityksille.",
    },
    {
      en: "Jimdo offers classic DIY website building. Floras replaces template editing with AI generation and chat iteration.",
      fi: "Jimdo tarjoaa klassisen DIY-sivustonrakennuksen. Floras korvaa pohjaeditoinnin AI-generoinnilla ja chat-iteraatiolla.",
    },
    {
      en: [
        "AI-first site creation",
        "Chat instead of section editors",
        "Modern Astro output",
        "Live sandbox preview",
      ],
      fi: [
        "AI-first sivuston luonti",
        "Chat osioeditorien sijaan",
        "Moderni Astro-tuloste",
        "Live-sandbox-esikatselu",
      ],
    },
    {
      en: [
        "Familiar DIY builder UX",
        "Long track record for SMBs",
        "Simple hosting bundles",
      ],
      fi: [
        "Tuttu DIY-builder-UX",
        "Pitkä historia PK-yrityksille",
        "Yksinkertaiset hosting-paketit",
      ],
    },
    {
      en: "Owners who want AI to draft and refine the site.",
      fi: "Yrittäjille jotka haluavat AI:n luonnostelevan ja hiovan sivuston.",
    },
    {
      en: "Users comfortable with traditional DIY builders.",
      fi: "Käyttäjille jotka ovat tottuneet perinteisiin DIY-buildereihin.",
    },
    {
      en: ["Floras vs Jimdo", "Jimdo alternative"],
      fi: ["Floras vs Jimdo", "Jimdo vaihtoehto"],
    }
  ),
  cmp(
    "weebly",
    "Weebly",
    { en: "weebly", fi: "weebly" },
    {
      en: "Floras vs Weebly",
      fi: "Floras vs Weebly",
    },
    {
      en: "Floras vs Weebly for simple small business websites.",
      fi: "Floras vs Weebly yksinkertaisiin PK-sivustoihin.",
    },
    {
      en: "Weebly is a classic drag-and-drop builder. Floras generates the site from language and keeps improvements conversational.",
      fi: "Weebly on klassinen drag-and-drop-rakentaja. Floras generoi sivuston kielestä ja pitää parannukset keskustelullisina.",
    },
    {
      en: [
        "Faster first draft via AI",
        "Modern stack and preview",
        "Chat refinements",
        "Form inbox included",
      ],
      fi: [
        "Nopeampi ensimmäinen luonnos AI:lla",
        "Moderni stack ja esikatselu",
        "Chat-hiomiset",
        "Lomake-inbox mukana",
      ],
    },
    {
      en: [
        "Simple drag-and-drop",
        "Square ecosystem ties",
        "Known DIY path",
      ],
      fi: [
        "Yksinkertainen drag-and-drop",
        "Square-ekosysteemin kytkennät",
        "Tutttu DIY-polku",
      ],
    },
    {
      en: "Anyone who wants to skip drag-and-drop entirely.",
      fi: "Kenelle tahansa joka haluaa ohittaa drag-and-dropin kokonaan.",
    },
    {
      en: "Users already in the Weebly/Square DIY world.",
      fi: "Käyttäjille jotka ovat jo Weebly/Square-DIY-maailmassa.",
    },
    {
      en: ["Floras vs Weebly", "Weebly alternative"],
      fi: ["Floras vs Weebly", "Weebly vaihtoehto"],
    }
  ),
  cmp(
    "godaddy",
    "GoDaddy",
    { en: "godaddy", fi: "godaddy" },
    {
      en: "Floras vs GoDaddy Website Builder",
      fi: "Floras vs GoDaddy Website Builder",
    },
    {
      en: "Floras vs GoDaddy Website Builder for business sites and domains.",
      fi: "Floras vs GoDaddy Website Builder yrityssivustoille ja domaineille.",
    },
    {
      en: "GoDaddy bundles domains with a website builder. Floras focuses on generating a strong site from a prompt; domains and hosting come with publish on Pro.",
      fi: "GoDaddy niputtaa domainit sivustonrakentajaan. Floras keskittyy vahvan sivuston generointiin promptilla; domainit ja hosting tulevat julkaisun mukana Prolla.",
    },
    {
      en: [
        "Higher-quality AI-generated first draft",
        "Chat-based design iteration",
        "Astro performance-oriented sites",
        "Lead capture inbox",
      ],
      fi: [
        "Laadukkaampi AI-generointi ensimmäiseen luonnokseen",
        "Chat-pohjainen design-iterointi",
        "Astro-suorituskykyiset sivustot",
        "Liidien inbox",
      ],
    },
    {
      en: [
        "Domain + builder bundling",
        "Familiar registrar brand",
        "One-stop domain shopping",
      ],
      fi: [
        "Domain + builder -niputus",
        "Tutttu registrar-brändi",
        "Yhden luukun domain-ostos",
      ],
    },
    {
      en: "Businesses prioritizing site quality over registrar bundling.",
      fi: "Yrityksille joille sivuston laatu voittaa registrar-niputuksen.",
    },
    {
      en: "Buyers who want domain + basic site in one GoDaddy cart.",
      fi: "Ostajille jotka haluavat domainin + perussivuston yhdessä GoDaddy-korissa.",
    },
    {
      en: ["Floras vs GoDaddy", "GoDaddy website builder alternative"],
      fi: ["Floras vs GoDaddy", "GoDaddy sivustonrakentaja vaihtoehto"],
    }
  ),
  cmp(
    "hostinger",
    "Hostinger",
    { en: "hostinger", fi: "hostinger" },
    {
      en: "Floras vs Hostinger Website Builder",
      fi: "Floras vs Hostinger Website Builder",
    },
    {
      en: "Floras vs Hostinger Website Builder — AI marketing sites versus hosting-bundled builders.",
      fi: "Floras vs Hostinger Website Builder — AI-markkinointisivustot vastaan hosting-niputetut builderit.",
    },
    {
      en: "Hostinger pairs cheap hosting with a builder. Floras is productized around AI generation, chat edits, and Floras publish — not shared hosting plans.",
      fi: "Hostinger yhdistää halvan hostingin builderiin. Floras on tuotteistettu AI-generoinnin, chat-muokkausten ja Floras-julkaisun ympärille — ei shared hosting -paketteihin.",
    },
    {
      en: [
        "Conversation-first site building",
        "Live Blaxel sandbox preview",
        "Pro publish to floras.app",
        "BYOK option for power users",
      ],
      fi: [
        "Keskustelu edellä sivuston rakentamisessa",
        "Live Blaxel-sandbox-esikatselu",
        "Pro-julkaisu floras.appiin",
        "BYOK-vaihtoehto power usereille",
      ],
    },
    {
      en: [
        "Aggressive hosting pricing",
        "Builder included with plans",
        "Wide hosting audience",
      ],
      fi: [
        "Aggressiivinen hosting-hinnoittelu",
        "Builder mukana paketeissa",
        "Laaja hosting-yleisö",
      ],
    },
    {
      en: "Users who care about AI site quality and chat iteration.",
      fi: "Käyttäjille joille AI-sivuston laatu ja chat-iterointi merkitsevät.",
    },
    {
      en: "Users shopping primarily for low-cost hosting.",
      fi: "Käyttäjille jotka etsivät ensisijaisesti edullista hostingia.",
    },
    {
      en: ["Floras vs Hostinger", "Hostinger website builder alternative"],
      fi: ["Floras vs Hostinger", "Hostinger sivustonrakentaja vaihtoehto"],
    }
  ),
  cmp(
    "10web",
    "10Web",
    { en: "10web", fi: "10web" },
    {
      en: "Floras vs 10Web",
      fi: "Floras vs 10Web",
    },
    {
      en: "Floras vs 10Web AI website builders — Astro chat sites versus AI WordPress.",
      fi: "Floras vs 10Web AI-sivustonrakentajat — Astro-chat-sivustot vastaan AI-WordPress.",
    },
    {
      en: "10Web generates and hosts WordPress with AI. Floras generates Astro sites and avoids the WordPress maintenance model entirely.",
      fi: "10Web generoi ja hostaa WordPressiä AI:lla. Floras generoi Astro-sivustoja ja välttää WordPress-ylläpitomallin kokonaan.",
    },
    {
      en: [
        "No WordPress plugins or updates",
        "Chat-native Astro workflow",
        "Cleaner stack for brochure sites",
        "Floras inbox for leads",
      ],
      fi: [
        "Ei WordPress-plugineja tai päivityksiä",
        "Chat-natiivi Astro-työnkulku",
        "Puhtaampi stack esittelysivustoille",
        "Floras-inbox liideille",
      ],
    },
    {
      en: [
        "WordPress compatibility",
        "AI + familiar WP admin",
        "Hosting tuned for WP",
      ],
      fi: [
        "WordPress-yhteensopivuus",
        "AI + tutttu WP-admin",
        "Hosting optimoitu WP:lle",
      ],
    },
    {
      en: "Teams that want to leave WordPress behind.",
      fi: "Tiimeille jotka haluavat jättää WordPressin taakse.",
    },
    {
      en: "Teams that still need WordPress plugins and admin.",
      fi: "Tiimeille jotka tarvitsevat yhä WordPress-plugineja ja adminia.",
    },
    {
      en: ["Floras vs 10Web", "10Web alternative"],
      fi: ["Floras vs 10Web", "10Web vaihtoehto"],
    }
  ),
  cmp(
    "dora",
    "Dora",
    { en: "dora", fi: "dora" },
    {
      en: "Floras vs Dora AI",
      fi: "Floras vs Dora AI",
    },
    {
      en: "Floras vs Dora for AI-generated websites and design.",
      fi: "Floras vs Dora AI-generoituille sivustoille ja designille.",
    },
    {
      en: "Dora leans into generative design and 3D/web experiences. Floras focuses on practical business marketing sites with chat edits and publish.",
      fi: "Dora nojaa generatiiviseen designiin ja 3D/web-kokemuksiin. Floras keskittyy käytännöllisiin yritysmarkkinointisivustoihin chat-muokkauksilla ja julkaisulla.",
    },
    {
      en: [
        "Practical SMB marketing sites",
        "Prompt → preview → publish",
        "Lead forms and inbox",
        "Less design-tool complexity",
      ],
      fi: [
        "Käytännölliset PK-markkinointisivustot",
        "Prompt → esikatselu → julkaisu",
        "Liidilomakkeet ja inbox",
        "Vähemmän design-työkalun kompleksisuutta",
      ],
    },
    {
      en: [
        "Generative visual experimentation",
        "Design-forward experiences",
        "Creative agency aesthetics",
      ],
      fi: [
        "Generatiivinen visuaalinen kokeilu",
        "Design-vetoiset kokemukset",
        "Luovan toimiston estetiikka",
      ],
    },
    {
      en: "Service businesses shipping a credible site this week.",
      fi: "Palveluyrityksille jotka julkaisevat uskottavan sivuston tällä viikolla.",
    },
    {
      en: "Creative teams exploring generative visual sites.",
      fi: "Luoville tiimeille jotka tutkivat generatiivisia visuaalisia sivustoja.",
    },
    {
      en: ["Floras vs Dora", "Dora AI alternative"],
      fi: ["Floras vs Dora", "Dora AI vaihtoehto"],
    }
  ),
  cmp(
    "relume",
    "Relume",
    { en: "relume", fi: "relume" },
    {
      en: "Floras vs Relume",
      fi: "Floras vs Relume",
    },
    {
      en: "Floras vs Relume — finished sites versus AI sitemaps and Webflow libraries.",
      fi: "Floras vs Relume — valmiit sivustot vastaan AI-sivukartat ja Webflow-kirjastot.",
    },
    {
      en: "Relume helps designers plan and build in Webflow faster. Floras delivers a finished site for owners who will not open Webflow at all.",
      fi: "Relume auttaa suunnittelijoita suunnittelemaan ja rakentamaan Webflow’ssa nopeammin. Floras toimittaa valmiin sivuston yrittäjille jotka eivät avaa Webflow’ta lainkaan.",
    },
    {
      en: [
        "Finished site, not a component library",
        "No Webflow required",
        "Owner-friendly chat edits",
        "Publish without Designer skills",
      ],
      fi: [
        "Valmis sivusto, ei komponenttikirjasto",
        "Ei Webflow’ta tarvita",
        "Yrittäjäystävälliset chat-muokkaukset",
        "Julkaisu ilman Designer-osaamista",
      ],
    },
    {
      en: [
        "Sitemap and wireframe AI for pros",
        "Webflow component libraries",
        "Fits agency design systems",
      ],
      fi: [
        "Sivukartta- ja wireframe-AI proille",
        "Webflow-komponenttikirjastot",
        "Sopii toimiston design-järjestelmiin",
      ],
    },
    {
      en: "Non-designers who need the site itself.",
      fi: "Ei-suunnittelijoille jotka tarvitsevat itse sivuston.",
    },
    {
      en: "Webflow designers accelerating delivery with Relume.",
      fi: "Webflow-suunnittelijoille jotka nopeuttavat toimitusta Relumella.",
    },
    {
      en: ["Floras vs Relume", "Relume alternative"],
      fi: ["Floras vs Relume", "Relume vaihtoehto"],
    }
  ),
  cmp(
    "typedream",
    "Typedream",
    { en: "typedream", fi: "typedream" },
    {
      en: "Floras vs Typedream",
      fi: "Floras vs Typedream",
    },
    {
      en: "Floras vs Typedream for no-code and AI website building.",
      fi: "Floras vs Typedream no-code- ja AI-sivustonrakennukseen.",
    },
    {
      en: "Typedream offers Notion-like site editing. Floras generates from a prompt and iterates in chat toward a publishable business site.",
      fi: "Typedream tarjoaa Notion-maista sivueditointia. Floras generoi promptilla ja iteroi chatissa kohti julkaisukelpoista yrityssivustoa.",
    },
    {
      en: [
        "Prompt-first generation",
        "Chat refinement loop",
        "Business-site oriented structure",
        "Floras publish path",
      ],
      fi: [
        "Prompt-first generointi",
        "Chat-hiomislooppi",
        "Yrityssivustoille orientoitunut rakenne",
        "Floras-julkaisupolku",
      ],
    },
    {
      en: [
        "Notion-like writing UX",
        "Simple no-code pages",
        "Lightweight editing model",
      ],
      fi: [
        "Notion-mainen kirjoitus-UX",
        "Yksinkertaiset no-code-sivut",
        "Kevyt editointimalli",
      ],
    },
    {
      en: "Users who want AI to draft the whole site structure.",
      fi: "Käyttäjille jotka haluavat AI:n luonnostelevan koko sivuston rakenteen.",
    },
    {
      en: "Writers who prefer Typedream’s document-style editor.",
      fi: "Kirjoittajille jotka pitävät Typedreamin dokumenttityylisestä editorista.",
    },
    {
      en: ["Floras vs Typedream", "Typedream alternative"],
      fi: ["Floras vs Typedream", "Typedream vaihtoehto"],
    }
  ),
  cmp(
    "bookmark",
    "Bookmark",
    { en: "bookmark", fi: "bookmark" },
    {
      en: "Floras vs Bookmark AiDA",
      fi: "Floras vs Bookmark AiDA",
    },
    {
      en: "Floras vs Bookmark AiDA AI website builders.",
      fi: "Floras vs Bookmark AiDA AI-sivustonrakentajat.",
    },
    {
      en: "Bookmark popularized AI site drafting. Floras pairs generation with ongoing chat refinement, Astro preview, and Pro publish.",
      fi: "Bookmark popularisoi AI-sivustoluonnokset. Floras yhdistää generoinnin jatkuvaan chat-hiomiseen, Astro-esikatseluun ja Pro-julkaisuun.",
    },
    {
      en: [
        "Ongoing chat agent refinements",
        "Modern Astro sandbox preview",
        "BYOK and Pro plans",
        "In-product form inbox",
      ],
      fi: [
        "Jatkuvat chat-agentin hiomiset",
        "Moderni Astro-sandbox-esikatselu",
        "BYOK- ja Pro-suunnitelmat",
        "Tuotteen sisäinen lomake-inbox",
      ],
    },
    {
      en: [
        "Early AI website builder brand",
        "AiDA generation flows",
        "SMB positioning",
      ],
      fi: [
        "Varhainen AI-sivustonrakentajabrändi",
        "AiDA-generointiflowt",
        "PK-positiointi",
      ],
    },
    {
      en: "Users who want a modern chat-native builder.",
      fi: "Käyttäjille jotka haluavat modernin chat-natiivin builderin.",
    },
    {
      en: "Users already invested in Bookmark’s AiDA flow.",
      fi: "Käyttäjille jotka ovat jo Bookmarkin AiDA-flow’ssa.",
    },
    {
      en: ["Floras vs Bookmark", "Bookmark AiDA alternative"],
      fi: ["Floras vs Bookmark", "Bookmark AiDA vaihtoehto"],
    }
  ),
  cmp(
    "duda",
    "Duda",
    { en: "duda", fi: "duda" },
    {
      en: "Floras vs Duda",
      fi: "Floras vs Duda",
    },
    {
      en: "Floras vs Duda — owner-facing AI sites versus agency white-label builders.",
      fi: "Floras vs Duda — yrittäjävetoiset AI-sivustot vastaan toimiston white-label-builderit.",
    },
    {
      en: "Duda is built for agencies and white-label client sites. Floras is built for the business owner generating and refining their own site.",
      fi: "Duda on rakennettu toimistoille ja white-label-asiakassivustoille. Floras on rakennettu yrittäjälle joka generoi ja hioo oman sivustonsa.",
    },
    {
      en: [
        "Direct-to-owner experience",
        "No agency platform required",
        "Prompt and chat workflow",
        "Simple Pro publish",
      ],
      fi: [
        "Suoraan yrittäjälle",
        "Ei toimistoalustaa tarvita",
        "Prompt- ja chat-työnkulku",
        "Yksinkertainen Pro-julkaisu",
      ],
    },
    {
      en: [
        "Agency and white-label features",
        "Client management at scale",
        "Team collaboration for builders",
      ],
      fi: [
        "Toimisto- ja white-label-ominaisuudet",
        "Asiakashallinta skaalassa",
        "Tiimiyhteistyö buildereille",
      ],
    },
    {
      en: "Business owners building their own site.",
      fi: "Yrittäjille jotka rakentavat oman sivustonsa.",
    },
    {
      en: "Agencies managing many client sites on Duda.",
      fi: "Toimistoille jotka hallitsevat monia asiakassivustoja Dudalla.",
    },
    {
      en: ["Floras vs Duda", "Duda alternative"],
      fi: ["Floras vs Duda", "Duda vaihtoehto"],
    }
  ),
  cmp(
    "kotisivukone",
    "Kotisivukone",
    { en: "kotisivukone", fi: "kotisivukone" },
    {
      en: "Floras vs Kotisivukone",
      fi: "Floras vs Kotisivukone",
    },
    {
      en: "Floras vs Kotisivukone for Finnish small business websites.",
      fi: "Floras vs Kotisivukone suomalaisille PK-yritysten verkkosivuille.",
    },
    {
      en: "Kotisivukone is a familiar Finnish DIY builder. Floras generates a modern site from a Finnish or English description and lets you refine it in chat.",
      fi: "Kotisivukone on tutttu suomalainen DIY-rakentaja. Floras generoi modernin sivuston suomen- tai englanninkielisestä kuvauksesta ja antaa hioa sitä chatissa.",
    },
    {
      en: [
        "AI draft in Finnish or English",
        "Chat-based improvements",
        "Modern Astro sites",
        "Live preview before publish",
      ],
      fi: [
        "AI-luonnos suomeksi tai englanniksi",
        "Chat-pohjaiset parannukset",
        "Modernit Astro-sivustot",
        "Live-esikatselu ennen julkaisua",
      ],
    },
    {
      en: [
        "Finnish market familiarity",
        "Classic DIY editor",
        "Local support expectations",
      ],
      fi: [
        "Suomen markkinan tuttuus",
        "Klassinen DIY-editori",
        "Paikallisen tuen odotukset",
      ],
    },
    {
      en: "Finnish SMBs that want AI instead of a traditional editor.",
      fi: "Suomalaisille PK-yrityksille jotka haluavat AI:n perinteisen editorin sijaan.",
    },
    {
      en: "Users who prefer Kotisivukone’s established DIY flow.",
      fi: "Käyttäjille jotka pitävät Kotisivukoneen vakiintuneesta DIY-flow’sta.",
    },
    {
      en: ["Floras vs Kotisivukone", "Kotisivukone alternative"],
      fi: ["Floras vs Kotisivukone", "Kotisivukone vaihtoehto", "parempi kuin Kotisivukone"],
    }
  ),
  cmp(
    "webnode",
    "Webnode",
    { en: "webnode", fi: "webnode" },
    {
      en: "Floras vs Webnode",
      fi: "Floras vs Webnode",
    },
    {
      en: "Floras vs Webnode website builders for SMBs in Europe.",
      fi: "Floras vs Webnode sivustonrakentajat eurooppalaisille PK-yrityksille.",
    },
    {
      en: "Webnode is a multilingual DIY builder popular in Europe. Floras replaces DIY assembly with AI generation and chat.",
      fi: "Webnode on monikielinen DIY-rakentaja Euroopassa. Floras korvaa DIY-kokoamisen AI-generoinnilla ja chatilla.",
    },
    {
      en: [
        "Faster AI-first draft",
        "Chat iteration",
        "Astro preview sandbox",
        "Pro hosting publish",
      ],
      fi: [
        "Nopeampi AI-first-luonnos",
        "Chat-iterointi",
        "Astro-esikatselu-sandbox",
        "Pro-hosting-julkaisu",
      ],
    },
    {
      en: [
        "Multilingual DIY builder",
        "European SMB footprint",
        "Template-based editing",
      ],
      fi: [
        "Monikielinen DIY-rakentaja",
        "Eurooppalainen PK-jalanjälki",
        "Pohjapohjainen editointi",
      ],
    },
    {
      en: "Owners who want generation over templates.",
      fi: "Yrittäjille jotka haluavat generoinnin pohjien sijaan.",
    },
    {
      en: "Users who like Webnode’s multilingual DIY editor.",
      fi: "Käyttäjille jotka pitävät Webnoden monikielisestä DIY-editorista.",
    },
    {
      en: ["Floras vs Webnode", "Webnode alternative"],
      fi: ["Floras vs Webnode", "Webnode vaihtoehto"],
    }
  ),
  cmp(
    "one-com",
    "One.com",
    { en: "one-com", fi: "one-com" },
    {
      en: "Floras vs One.com Website Builder",
      fi: "Floras vs One.com Website Builder",
    },
    {
      en: "Floras vs One.com for Nordic small business websites.",
      fi: "Floras vs One.com pohjoismaisille PK-yritysten sivustoille.",
    },
    {
      en: "One.com bundles domains, hosting, and a builder across the Nordics. Floras focuses on AI-generated site quality and chat-driven iteration.",
      fi: "One.com niputtaa domainit, hostingin ja builderin Pohjoismaissa. Floras keskittyy AI-generoidun sivuston laatuun ja chat-iterointiin.",
    },
    {
      en: [
        "AI site quality first",
        "Chat refinements",
        "Modern Astro stack",
        "Lead inbox built in",
      ],
      fi: [
        "AI-sivuston laatu edellä",
        "Chat-hiomiset",
        "Moderni Astro-stack",
        "Liidi-inbox sisäänrakennettuna",
      ],
    },
    {
      en: [
        "Nordic domain + hosting brand",
        "Bundled website builder",
        "Familiar local packaging",
      ],
      fi: [
        "Pohjoismainen domain + hosting -brändi",
        "Niputettu sivustonrakentaja",
        "Tutttu paikallinen paketointi",
      ],
    },
    {
      en: "Nordic SMBs prioritizing a better generated site.",
      fi: "Pohjoismaisille PK-yrityksille joille generoidun sivuston laatu on ykkönen.",
    },
    {
      en: "Customers who want One.com’s domain and hosting bundle.",
      fi: "Asiakkaille jotka haluavat One.comin domain- ja hosting-nipun.",
    },
    {
      en: ["Floras vs One.com", "One.com website builder alternative"],
      fi: ["Floras vs One.com", "One.com sivustonrakentaja vaihtoehto"],
    }
  ),
  cmp(
    "homepages",
    "Homepages",
    { en: "homepages", fi: "homepages" },
    {
      en: "Floras vs Homepages",
      fi: "Floras vs Homepages",
    },
    {
      en: "Floras vs Homepages (Visma) for Finnish business websites.",
      fi: "Floras vs Homepages (Visma) suomalaisille yrityssivustoille.",
    },
    {
      en: "Homepages is a Finnish website product in the Visma ecosystem. Floras is an AI-native builder for a modern site from a short description.",
      fi: "Homepages on suomalainen sivustotuote Visma-ekosysteemissä. Floras on AI-natiivi rakentaja modernille sivustolle lyhyestä kuvauksesta.",
    },
    {
      en: [
        "AI generation in FI/EN",
        "Chat-native edits",
        "Fast live preview",
        "Independent of Visma tooling",
      ],
      fi: [
        "AI-generointi FI/EN",
        "Chat-natiivit muokkaukset",
        "Nopea live-esikatselu",
        "Riippumaton Visma-työkaluista",
      ],
    },
    {
      en: [
        "Finnish Visma ecosystem ties",
        "Local product familiarity",
        "Traditional builder expectations",
      ],
      fi: [
        "Suomalaiset Visma-kytkennät",
        "Paikallinen tuotetuttuisuus",
        "Perinteisen builderin odotukset",
      ],
    },
    {
      en: "Finnish businesses that want AI-first site creation.",
      fi: "Suomalaisille yrityksille jotka haluavat AI-first sivustonluonnin.",
    },
    {
      en: "Businesses already standardized on Visma Homepages.",
      fi: "Yrityksille jotka ovat jo standardisoineet Visma Homepagesiin.",
    },
    {
      en: ["Floras vs Homepages", "Homepages alternative", "Visma Homepages alternative"],
      fi: ["Floras vs Homepages", "Homepages vaihtoehto", "Visma Homepages vaihtoehto"],
    }
  ),
];

export function getComparisonBySlug(
  locale: Locale,
  slug: string
): Comparison | undefined {
  return COMPARISONS.find((c) => c.slugs[locale] === slug);
}

export function getComparisonSlugs(locale: Locale): string[] {
  return COMPARISONS.map((c) => c.slugs[locale]);
}

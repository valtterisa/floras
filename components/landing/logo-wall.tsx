import { Reveal } from "@/components/site/reveal";

const STACK = [
  { name: "Tailwind", slug: "tailwindcss" },
  { name: "Vercel", slug: "vercel" },
  { name: "Cloudflare", slug: "cloudflare" },
  { name: "GitHub", slug: "github" },
];

export function LogoWall() {
  return (
    <section className="border-b border-border">
      <div className="grid sm:grid-cols-[9rem_1fr]">
        <div className="flex items-center border-b border-border px-6 py-4 sm:border-b-0 sm:border-r md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Built on
          </p>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-4">
          {STACK.map((item, i) => (
            <li
              key={item.slug}
              className={`flex h-14 items-center justify-center border-border ${
                i % 2 === 0 ? "border-r" : ""
              } sm:border-r sm:last:border-r-0 ${i < 2 ? "border-b sm:border-b-0" : ""}`}
            >
              <Reveal>
                <img
                  src={`https://cdn.simpleicons.org/${item.slug}/545864`}
                  alt={item.name}
                  width={88}
                  height={22}
                  className="h-5 w-auto opacity-80 dark:invert dark:opacity-70"
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

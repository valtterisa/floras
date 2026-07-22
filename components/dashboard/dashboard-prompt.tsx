"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Check, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ModelSelector } from "@/components/site/model-selector";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpgradeProModal } from "@/components/billing/upgrade-pro-modal";
import { TopUpModal } from "@/components/billing/top-up-modal";
import { useCreateSite } from "@/lib/hooks/use-create-site";
import { useGenerationAccess } from "@/lib/hooks/use-generation-access";
import { triggerGeneration } from "@/lib/generate/trigger-generation";
import {
  DEFAULT_AGENT_MODEL_ID,
  type AgentModelId,
} from "@/lib/ai/models";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Website for a solar-panel installer",
  "Simple portfolio for a photographer",
  "Launch site with a blog for a coffee roaster",
  "Booking page for a yoga studio",
  "Boutique hotel site with rooms and rates",
  "Homepage for a local bakery",
];

const ASK_SUGGESTIONS = [
  "What should a bakery homepage include?",
  "Help me pick a tone for a yoga studio",
  "How many pages does a hotel site need?",
  "Draft a one-sentence brief for a photographer",
  "Which sections belong on a coffee roaster site?",
  "What CTA works for a solar installer?",
];

const ROLLING = [
  "a solar-panel installer website",
  "a simple portfolio for a photographer",
  "a coffee roaster launch site with a blog",
  "a booking page for a yoga studio",
  "a boutique hotel site",
  "a homepage for a local bakery",
];

const TEXTAREA_MIN_PX = 88;
const TEXTAREA_MAX_PX = 240;

type AskTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function DashboardPrompt({
  resetKey = 0,
}: {
  resetKey?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createSite = useCreateSite();
  const { getDenyReason, billingReady, hasPaidPlan, refetch } =
    useGenerationAccess();
  const reduce = useReducedMotion();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const askScrollRef = useRef<HTMLDivElement>(null);
  const fromAuthPrompt = useRef(false);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [modelId, setModelId] = useState<AgentModelId>(DEFAULT_AGENT_MODEL_ID);
  const [rollIndex, setRollIndex] = useState(0);
  const [modKey, setModKey] = useState("Ctrl");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [askMode, setAskMode] = useState(false);
  const [askTurns, setAskTurns] = useState<AskTurn[]>([]);

  useEffect(() => {
    setText("");
    setAskTurns([]);
    setAskMode(false);
    textareaRef.current?.focus();
  }, [resetKey]);

  useEffect(() => {
    const fromAuth = searchParams.get("prompt");
    if (!fromAuth) return;
    fromAuthPrompt.current = true;
    setText(fromAuth);
    router.replace("/dashboard", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!fromAuthPrompt.current || !billingReady) return;
    fromAuthPrompt.current = false;
    if (!hasPaidPlan) setUpgradeOpen(true);
  }, [billingReady, hasPaidPlan]);

  useEffect(() => {
    const mac =
      /Mac|iPhone|iPad/.test(navigator.platform) ||
      navigator.userAgent.includes("Mac");
    setModKey(mac ? "⌘" : "Ctrl");
  }, []);

  useEffect(() => {
    if (text || reduce || askMode) return;
    const id = window.setInterval(() => {
      setRollIndex((i) => (i + 1) % ROLLING.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [text, reduce, askMode]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(
      TEXTAREA_MAX_PX,
      Math.max(TEXTAREA_MIN_PX, el.scrollHeight)
    );
    el.style.height = `${next}px`;
  }, [text]);

  useEffect(() => {
    const el = askScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [askTurns]);

  const handleAsk = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || pending) return;

    const reason = getDenyReason();
    if (reason === "no_plan") {
      setUpgradeOpen(true);
      return;
    }
    if (reason === "no_credits") {
      setTopUpOpen(true);
      return;
    }

    const userTurn: AskTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const assistantId = `a-${Date.now()}`;
    const history = askTurns.map((t) => ({
      role: t.role,
      content: t.content,
    }));

    setText("");
    setAskTurns((prev) => [
      ...prev,
      userTurn,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setPending(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history,
          modelId,
        }),
      });

      if (!res.ok) {
        let code: string | undefined;
        let message = "Could not ask Floras";
        try {
          const data = (await res.json()) as { error?: string; code?: string };
          if (data.error) message = data.error;
          code = data.code;
        } catch {
        }
        if (code === "NO_PLAN") setUpgradeOpen(true);
        else if (code === "NO_CREDITS") setTopUpOpen(true);
        else toast.error(message);
        setAskTurns((prev) => prev.filter((t) => t.id !== assistantId));
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        toast.error("No response stream");
        setAskTurns((prev) => prev.filter((t) => t.id !== assistantId));
        return;
      }

      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const snapshot = full;
        setAskTurns((prev) =>
          prev.map((t) =>
            t.id === assistantId ? { ...t, content: snapshot } : t
          )
        );
      }
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not ask Floras");
      setAskTurns((prev) => prev.filter((t) => t.id !== assistantId));
    } finally {
      setPending(false);
    }
  };

  const handleBuild = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || pending) return;

    const reason = getDenyReason();
    if (reason === "no_plan") {
      setUpgradeOpen(true);
      return;
    }
    if (reason === "no_credits") {
      setTopUpOpen(true);
      return;
    }

    setPending(true);
    try {
      const id = await createSite({ prompt: trimmed, modelId });
      await triggerGeneration(id);
      await refetch();
      router.push(`/build/${id}`);
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "NO_PLAN") {
        setUpgradeOpen(true);
      } else if (err.code === "NO_CREDITS") {
        setTopUpOpen(true);
      } else {
        toast.error(err.message || "Could not start generation");
      }
      setPending(false);
    }
  };

  const handle = async (value: string) => {
    if (askMode) await handleAsk(value);
    else await handleBuild(value);
  };

  const showRoll = !text && !pending && !askMode;
  const suggestionList = askMode ? ASK_SUGGESTIONS : SUGGESTIONS;

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 md:px-10">
      <div className="w-full max-w-2xl">
        <div className="grid text-center">
          <h1
            className={cn(
              "col-start-1 row-start-1 text-3xl font-semibold tracking-tight md:text-4xl",
              askMode && "invisible"
            )}
            aria-hidden={askMode}
          >
            What do you want to create?
          </h1>
          <h1
            className={cn(
              "col-start-1 row-start-1 text-3xl font-semibold tracking-tight md:text-4xl",
              !askMode && "invisible"
            )}
            aria-hidden={!askMode}
          >
            Ask before you build.
          </h1>
        </div>
        <div className="mx-auto mt-3 grid max-w-[42ch] text-center">
          <p
            className={cn(
              "col-start-1 row-start-1 text-sm leading-relaxed text-muted-foreground",
              askMode && "invisible"
            )}
            aria-hidden={askMode}
          >
            Describe a site and Floras builds a live preview you can refine.
          </p>
          <p
            className={cn(
              "col-start-1 row-start-1 text-sm leading-relaxed text-muted-foreground",
              !askMode && "invisible"
            )}
            aria-hidden={!askMode}
          >
            Clarify the brief, sections, and tone. Turn ASK off when you’re ready
            to generate.
          </p>
        </div>

        {askMode && askTurns.length > 0 ? (
          <div
            ref={askScrollRef}
            className="mt-8 max-h-[40vh] overflow-y-auto border border-border"
          >
            <ul className="flex flex-col">
              {askTurns.map((turn) => (
                <li
                  key={turn.id}
                  className={cn(
                    "border-b border-border px-5 py-4 text-sm leading-relaxed last:border-b-0",
                    turn.role === "user"
                      ? "bg-card text-foreground"
                      : "bg-background text-muted-foreground"
                  )}
                >
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {turn.role === "user" ? "You" : "Floras"}
                  </p>
                  <p className="whitespace-pre-wrap">
                    {turn.content || (pending ? "…" : "")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handle(text);
          }}
          className={cn(
            "border border-border bg-card",
            askMode && askTurns.length > 0 ? "mt-0 border-t-0" : "mt-10"
          )}
        >
          <label htmlFor="dashboard-prompt" className="sr-only">
            {askMode ? "Ask Floras" : "Describe the site to build"}
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="dashboard-prompt"
              name="message"
              autoFocus
              value={text}
              disabled={pending}
              rows={3}
              placeholder=""
              aria-label={askMode ? "Ask Floras" : "Describe the site to build"}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  void handle(text);
                }
              }}
              className="min-h-[88px] max-h-[240px] w-full resize-none overflow-y-auto bg-transparent px-5 pt-4 pb-3 text-sm leading-relaxed text-foreground focus:outline-none disabled:opacity-50"
            />
            {showRoll ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-5 top-4 text-sm leading-relaxed text-muted-foreground/45"
              >
                <span>Ask Floras to build </span>
                <span className="relative inline-grid overflow-hidden align-baseline">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={ROLLING[rollIndex]}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="col-start-1 row-start-1"
                    >
                      {ROLLING[rollIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            ) : null}
            {askMode && !text && !pending ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-5 top-4 text-sm leading-relaxed text-muted-foreground/45"
              >
                Ask about structure, tone, pages…
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={pending}
                  aria-label="Composer mode"
                  className={cn(
                    "inline-flex h-9 w-[4.75rem] shrink-0 cursor-pointer items-center justify-between gap-1.5 border border-border bg-background px-2.5 text-left text-muted-foreground transition-colors",
                    "hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
                    "focus:outline-none data-[state=open]:bg-card data-[state=open]:text-foreground"
                  )}
                >
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-foreground">
                    {askMode ? "Ask" : "Build"}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={6}
                  className="w-64 rounded-none border-border p-0 shadow-none"
                >
                  <DropdownMenuItem
                    onSelect={() => setAskMode(false)}
                    className={cn(
                      "cursor-pointer gap-3 rounded-none px-3 py-2.5 focus:bg-card",
                      "border-b border-border",
                      !askMode && "bg-card"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        Build
                      </span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        Generate a site
                      </span>
                    </span>
                    {!askMode ? (
                      <Check className="size-4 shrink-0 text-brand" />
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setAskMode(true)}
                    className={cn(
                      "cursor-pointer gap-3 rounded-none px-3 py-2.5 focus:bg-card",
                      askMode && "bg-card"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        Ask
                      </span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        Plan before you build
                      </span>
                    </span>
                    {askMode ? (
                      <Check className="size-4 shrink-0 text-brand" />
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModelSelector
                value={modelId}
                onChange={setModelId}
                disabled={pending}
              />
            </div>
            <button
              type="submit"
              disabled={pending || !text.trim()}
              aria-label={
                pending ? "Working" : askMode ? "Ask Floras" : "Build site"
              }
              className={cn(
                "inline-flex size-9 cursor-pointer items-center justify-center gap-2 transition-[filter] active:scale-[0.98] sm:h-9 sm:w-auto sm:px-3",
                "bg-brand text-brand-foreground hover:brightness-110",
                "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
              )}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <>
                  <ArrowUp className="size-4 shrink-0" aria-hidden />
                  <KbdGroup className="hidden gap-1 sm:inline-flex">
                    <Kbd className="h-6 min-w-6 border-brand-foreground/30 bg-brand-foreground/15 px-1.5 text-[11px] text-brand-foreground normal-case">
                      {modKey}
                    </Kbd>
                    <Kbd className="h-6 border-brand-foreground/30 bg-brand-foreground/15 px-1.5 text-[11px] text-brand-foreground">
                      Enter
                    </Kbd>
                  </KbdGroup>
                </>
              )}
            </button>
          </div>
        </form>

        <ul className="mt-8 border-t border-border">
          {suggestionList.map((suggestion) => (
            <li key={suggestion} className="border-b border-border">
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setText(suggestion);
                  void handle(suggestion);
                }}
                className="group flex w-full cursor-pointer items-baseline py-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {suggestion}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <UpgradeProModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        onPurchased={() => void refetch()}
      />
      <TopUpModal
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onPurchased={() => void refetch()}
      />
    </section>
  );
}

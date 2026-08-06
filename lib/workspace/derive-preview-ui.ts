const LIVE_SANDBOX_STATES = new Set(["ready"]);
const STARTING_SANDBOX_STATES = new Set(["starting"]);

export type PreviewUi = {
  screen: {
    title: string;
    body: string;
    spinning: boolean;
    showRestart: boolean;
  };
  badge: string;
};

export function derivePreviewUi(input: {
  state: string | null | "loading";
  waking: boolean;
  restarting: boolean;
  previewOk: boolean;
  previewError: string | null;
  projectLabel?: string;
}): PreviewUi {
  const { state, waking, restarting, previewOk, previewError, projectLabel } =
    input;
  const sandboxLive = typeof state === "string" && LIVE_SANDBOX_STATES.has(state);

  let badge = "Offline";
  if (previewError && !waking) badge = "Error";
  else if (state === "stopping") badge = "Stopping";
  else if (state === "stopped") badge = waking ? "Starting" : "Stopped";
  else if (state === "loading") badge = "Checking";
  else if (state === "error") badge = "Error";
  else if (typeof state === "string" && STARTING_SANDBOX_STATES.has(state))
    badge = "Starting";
  else if (sandboxLive && previewOk && !waking) badge = projectLabel ?? "Live";
  else if (waking || (sandboxLive && !previewOk))
    badge = restarting ? "Restarting" : "Starting";

  if (previewError && !waking) {
    return {
      badge,
      screen: {
        title: "Preview failed",
        body: previewError,
        spinning: false,
        showRestart: true,
      },
    };
  }

  if (waking) {
    if (state === "stopping") {
      return {
        badge,
        screen: {
          title: "Stopping sandbox",
          body: "Waiting for the previous stop to finish.",
          spinning: true,
          showRestart: false,
        },
      };
    }
    if (sandboxLive) {
      return {
        badge,
        screen: {
          title: "Starting preview",
          body: "Waiting until the public preview URL responds.",
          spinning: true,
          showRestart: false,
        },
      };
    }
    return {
      badge,
      screen: {
        title: "Starting sandbox",
        body: "This can take a minute. Hang tight.",
        spinning: true,
        showRestart: false,
      },
    };
  }

  if (sandboxLive && !previewOk) {
    return {
      badge,
      screen: {
        title: "Preview offline",
        body: "Sandbox is up, but the site preview is not responding.",
        spinning: false,
        showRestart: true,
      },
    };
  }

  const screens: Record<string, PreviewUi["screen"]> = {
    loading: {
      title: "Checking sandbox",
      body: "Reading machine status.",
      spinning: true,
      showRestart: false,
    },
    stopped: {
      title: "Sandbox stopped",
      body: "Preview is offline. Restart the preview to wake it up.",
      spinning: false,
      showRestart: true,
    },
    stopping: {
      title: "Stopping sandbox",
      body: "Dev server is shutting down.",
      spinning: true,
      showRestart: false,
    },
    error: {
      title: "Sandbox error",
      body: "Something went wrong with the machine. Try restarting the preview.",
      spinning: false,
      showRestart: true,
    },
  };

  if (state && screens[state]) {
    return { badge, screen: screens[state]! };
  }
  if (typeof state === "string" && STARTING_SANDBOX_STATES.has(state)) {
    return {
      badge,
      screen: {
        title: "Starting sandbox",
        body: "The machine is still coming online.",
        spinning: true,
        showRestart: false,
      },
    };
  }
  if (state === null) {
    return {
      badge,
      screen: {
        title: "No sandbox",
        body: "Generate a site to provision a preview machine.",
        spinning: false,
        showRestart: false,
      },
    };
  }
  return {
    badge,
    screen: {
      title: "Sandbox unavailable",
      body: "Preview is not ready yet. Try restarting the preview.",
      spinning: false,
      showRestart: true,
    },
  };
}

export { LIVE_SANDBOX_STATES, STARTING_SANDBOX_STATES };

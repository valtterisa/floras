const LIVE_SANDBOX_STATES = new Set(["ready"]);
const STARTING_SANDBOX_STATES = new Set(["starting"]);

export type PreviewUi = {
  screen: {
    titleKey: string;
    bodyKey?: string;
    bodyOverride?: string;
    spinning: boolean;
    showRestart: boolean;
  };
  badge: string;
  badgeOverride?: string;
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

  let badge = "offline";
  let badgeOverride: string | undefined;
  if (previewError && !waking) badge = "error";
  else if (state === "stopping") badge = "stopping";
  else if (state === "stopped") badge = waking ? "starting" : "stopped";
  else if (state === "loading") badge = "checking";
  else if (state === "error") badge = "error";
  else if (typeof state === "string" && STARTING_SANDBOX_STATES.has(state))
    badge = "starting";
  else if (sandboxLive && previewOk && !waking) {
    badge = "live";
    if (projectLabel) badgeOverride = projectLabel;
  } else if (waking || (sandboxLive && !previewOk))
    badge = restarting ? "restarting" : "starting";

  if (previewError && !waking) {
    return {
      badge,
      badgeOverride,
      screen: {
        titleKey: "screen.previewFailed",
        bodyOverride: previewError,
        spinning: false,
        showRestart: true,
      },
    };
  }

  if (waking) {
    if (state === "stopping") {
      return {
        badge,
        badgeOverride,
        screen: {
          titleKey: "screen.stoppingTitle",
          bodyKey: "screen.stoppingBody",
          spinning: true,
          showRestart: false,
        },
      };
    }
    if (sandboxLive) {
      return {
        badge,
        badgeOverride,
        screen: {
          titleKey: "screen.startingPreviewTitle",
          bodyKey: "screen.startingPreviewBody",
          spinning: true,
          showRestart: false,
        },
      };
    }
    return {
      badge,
      badgeOverride,
      screen: {
        titleKey: "screen.startingSandboxTitle",
        bodyKey: "screen.startingSandboxBody",
        spinning: true,
        showRestart: false,
      },
    };
  }

  if (sandboxLive && !previewOk) {
    return {
      badge,
      badgeOverride,
      screen: {
        titleKey: "screen.previewOfflineTitle",
        bodyKey: "screen.previewOfflineBody",
        spinning: false,
        showRestart: true,
      },
    };
  }

  const screens: Record<string, PreviewUi["screen"]> = {
    loading: {
      titleKey: "screen.checkingTitle",
      bodyKey: "screen.checkingBody",
      spinning: true,
      showRestart: false,
    },
    stopped: {
      titleKey: "screen.stoppedTitle",
      bodyKey: "screen.stoppedBody",
      spinning: false,
      showRestart: true,
    },
    stopping: {
      titleKey: "screen.stoppingDevTitle",
      bodyKey: "screen.stoppingDevBody",
      spinning: true,
      showRestart: false,
    },
    error: {
      titleKey: "screen.errorTitle",
      bodyKey: "screen.errorBody",
      spinning: false,
      showRestart: true,
    },
  };

  if (state && screens[state]) {
    return { badge, badgeOverride, screen: screens[state]! };
  }
  if (typeof state === "string" && STARTING_SANDBOX_STATES.has(state)) {
    return {
      badge,
      badgeOverride,
      screen: {
        titleKey: "screen.startingOnlineTitle",
        bodyKey: "screen.startingOnlineBody",
        spinning: true,
        showRestart: false,
      },
    };
  }
  if (state === null) {
    return {
      badge,
      badgeOverride,
      screen: {
        titleKey: "screen.noSandboxTitle",
        bodyKey: "screen.noSandboxBody",
        spinning: false,
        showRestart: false,
      },
    };
  }
  return {
    badge,
    badgeOverride,
    screen: {
      titleKey: "screen.unavailableTitle",
      bodyKey: "screen.unavailableBody",
      spinning: false,
      showRestart: true,
    },
  };
}

export { LIVE_SANDBOX_STATES, STARTING_SANDBOX_STATES };

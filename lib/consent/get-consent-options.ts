import {
  policyPackPresets,
  type ConsentManagerOptions,
} from "@c15t/nextjs";

const consentCategories = [
  "necessary",
  "functionality",
  "experience",
  "measurement",
  "marketing",
] satisfies ConsentManagerOptions["consentCategories"];

export function getConsentOptions(): ConsentManagerOptions {
  const backendURL = process.env.NEXT_PUBLIC_C15T_URL;

  const sharedOptions = {
    consentCategories,
    colorScheme: "light",
    theme: {
      colors: {
        primary: "#003E45",
        primaryHover: "#005060",
        surface: "#FFFFFF",
        surfaceHover: "#F8FAFB",
        border: "#C2E2E6",
        borderHover: "#9CCDD4",
        text: "#003E45",
        textMuted: "#4B5563",
        textOnPrimary: "#FFFFFF",
        overlay: "rgba(0, 40, 48, 0.48)",
        switchTrack: "#C2E2E6",
        switchTrackActive: "#003E45",
        switchThumb: "#FFFFFF",
      },
      typography: {
        fontFamily: "var(--font-agenda)",
        fontSize: {
          sm: "0.875rem",
          base: "0.95rem",
          lg: "1.05rem",
        },
        fontWeight: {
          normal: 400,
          medium: 600,
          semibold: 700,
        },
        lineHeight: {
          tight: "1.2",
          normal: "1.55",
          relaxed: "1.75",
        },
      },
      spacing: {
        xs: "0.375rem",
        sm: "0.625rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      radius: {
        sm: "8px",
        md: "8px",
        lg: "12px",
        full: "9999px",
      },
      shadows: {
        sm: "0 4px 14px rgba(0, 62, 69, 0.08)",
        md: "0 12px 32px rgba(0, 62, 69, 0.12)",
        lg: "0 24px 60px rgba(0, 62, 69, 0.18)",
      },
      motion: {
        duration: {
          fast: "160ms",
          normal: "220ms",
          slow: "320ms",
        },
        easing: "ease",
        easingOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        easingInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
        easingSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      consentActions: {
        default: {
          variant: "neutral",
          mode: "stroke",
        },
        accept: {
          variant: "primary",
          mode: "filled",
        },
        reject: {
          variant: "neutral",
          mode: "ghost",
        },
        customize: {
          variant: "neutral",
          mode: "stroke",
        },
      },
    },
  } satisfies Partial<ConsentManagerOptions>;

  if (backendURL) {
    return {
      ...sharedOptions,
      mode: "hosted",
      backendURL,
    };
  }

  return {
    ...sharedOptions,
    mode: "offline",
    offlinePolicy: {
      policyPacks: [
        policyPackPresets.europeOptIn(),
        policyPackPresets.californiaOptOut(),
        policyPackPresets.worldNoBanner(),
      ],
    },
  };
}

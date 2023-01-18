const theme = {
  border: {
    radius: "0.4rem",
  },
  font: {
    family:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    monospace: "Roboto Mono, monospace",
    sizes: {
      xsmall: "1.2rem",
      small: "1.4rem",
      medium: "1.6rem",
      large: "1.8rem",
      xlarge: "2.0rem",
      xxlarge: "2.4rem",
      xxxlarge: "3.2rem",
    },
  },
  colors: {
    primary: "#1A1A2E",
    red: "#FF605C",
    green: "#00CA4E",
    yellow: "#FFBD44",
    blue: "#0072F5",
    black: "rgba(41, 41, 41, 1)",
  },
  transition: {
    default: "0.3s ease-in-out",
    fast: "0.1s ease-in-out",
  },
  gradients: {
    primary: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
  },
  shadows: {
    default: "-2px 2px 8px #001D4029;",
  },
} as const;

export type Colors = keyof typeof theme.colors;

export default theme;

import { styled } from "@/styles/stitches.config"

export const Text = styled("p", {
  // Reset
  margin: "0",
  fontWeight: 400,
  display: "inherit",

  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "$untitled",
  fontSize: "$1",
  fontVariantNumeric: "tabular-nums",
  cursor: "default",
  whiteSpace: "nowrap",

  variants: {
    bold: {
      true: { fontWeight: 500 },
    },
    inline: {
      true: {
        display: "inline",
      },
    },

    wrap: {
      true: { whiteSpace: "normal" },
    },

    size: {
      "1": {
        fontSize: "$1",
      },
      "2": {
        fontSize: "$2",
      },
      "3": {
        fontSize: "$3",
      },
      "4": {
        fontSize: "$4",
      },
      "5": {
        fontSize: "$5",
        letterSpacing: "-.015em",
      },
      "6": {
        fontSize: "$6",
        letterSpacing: "-.016em",
      },
      "7": {
        fontSize: "$7",
        letterSpacing: "-.031em",
        textIndent: "-.005em",
      },
      "8": {
        fontSize: "$8",
        letterSpacing: "-.034em",
        textIndent: "-.018em",
      },
      "9": {
        fontSize: "$9",
        letterSpacing: "-.055em",
        textIndent: "-.025em",
      },
    },
    variant: {
      yellow: {
        color: "$yellow11",
      },
      orange: {
        color: "$orange11",
      },
      gray: {
        color: "$slate11",
      },
      contrast: {
        color: "$hiContrast",
      },
    },
    faded: {
      true: { color: "$loContrast" },
    },
    gradient: {
      true: {
        backgroundClip: "text",
        color: "transparent !important",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
  },
  compoundVariants: [
    {
      variant: "crimson",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $crimson11, $pink11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },

    {
      variant: "yellow",
      gradient: "true",
      css: {
        // 👇 show a solid color in older browsers (e.g., IE11)
        color: "$yellow11",

        // 👇 show the text gradient in modern browsers
        "@supports (--css: variables)": {
          // background: linear-gradient(to right, darkblue, darkorchid);
          // color: transparent;
          // -webkit-background-clip: text;
          // background-clip: text;
          backgroundClip: "text",
          color: "transparent",
          background: "-webkit-linear-gradient(top right, $yellow11, $orange11)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
      },
    },

    {
      variant: "gray",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $gray11, $gray12)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "contrast",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(135deg, white, rgb(223, 223, 223))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
  ],
  defaultVariants: {
    size: "3",
    variant: "contrast",
  },
});

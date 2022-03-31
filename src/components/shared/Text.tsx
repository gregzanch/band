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
      red: {
        color: "$red11",
      },
      crimson: {
        color: "$crimson11",
      },
      pink: {
        color: "$pink11",
      },
      purple: {
        color: "$purple11",
      },
      violet: {
        color: "$violet11",
      },
      indigo: {
        color: "$indigo11",
      },
      blue: {
        color: "$blue11",
      },
      cyan: {
        color: "$cyan11",
      },
      teal: {
        color: "$teal11",
      },
      green: {
        color: "$green11",
      },
      lime: {
        color: "$lime11",
      },
      yellow: {
        color: "$yellow11",
      },
      orange: {
        color: "$orange11",
      },
      gold: {
        color: "$gold11",
      },
      bronze: {
        color: "$bronze11",
      },
      gray: {
        color: "$slate11",
      },
      contrast: {
        color: "$hiContrast",
      },
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
      variant: "red",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $red11, $crimson11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
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
      variant: "pink",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $pink11, $purple11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "purple",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $purple11, $violet11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "violet",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $violet11, $indigo11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "indigo",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $indigo11, $blue11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "blue",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $blue11, $cyan11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "cyan",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $cyan11, $teal11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "teal",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $teal11, $green11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "green",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $green11, $lime11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "lime",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $lime11, $yellow11)",
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
      variant: "orange",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $orange11, $red11)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "gold",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $gold11, $gold9)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    {
      variant: "bronze",
      gradient: "true",
      css: {
        backgroundClip: "text",
        color: "transparent",
        background: "-webkit-linear-gradient(top right, $bronze11, $bronze9)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
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
})

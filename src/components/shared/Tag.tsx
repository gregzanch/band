import { Text } from "./Text";
import { Box } from "./Box";

import { css, styled, getCssText, darkTheme, lightTheme } from "@/styles/stitches.config";
import { ElementRef, forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { parseRgb } from "@/helpers/dom/parseRgb";
import { getTextShade } from "@/helpers/color";

const textStyle = css({
  margin: "0",
  fontWeight: 400,
  // display: "inherit",
  fontFamily: "$untitled",
  fontSize: "$1",
  fontVariantNumeric: "tabular-nums",
  cursor: "default",
  whiteSpace: "nowrap",

  variants: {
    size: {
      "1": {
        fontSize: "calc($1 / 2)",
      },
      "2": {
        fontSize: "$1",
      },
      "3": {
        fontSize: "$2",
      },
      "4": {
        fontSize: "$3",
      },
      "5": {
        fontSize: "$4",
      },
      "6": {
        fontSize: "$5",
      },
      "7": {
        fontSize: "$6",
      },
      "8": {
        fontSize: "$7",
      },
      "9": {
        fontSize: "$8",
      },
    },
  },
});

const StyledContainer = styled(Box, {
  borderRadius: "$pill",
  px: "0.5em",
});

const StyledText = styled(Text, textStyle);

export const Tag = ({ label, size = 2, color = "$orange10", ...props }) => {
  const containerRef = useRef(null);
  const [textColor, setTextColor] = useState<string>("inherit");
  useEffect(() => {
    if (containerRef.current) {
      console.log(containerRef.current);
      const bg = getComputedStyle(containerRef.current).backgroundColor;
      const color = parseRgb(bg);
      const textShade = getTextShade(color, {
        dark: lightTheme.colors.slate12.value,
        light: darkTheme.colors.slate12.value,
      });
      console.log(textShade);
      setTextColor(textShade);
    }
  }, [color]);

  return (
    <StyledContainer {...props} css={{ backgroundColor: color }} ref={containerRef}>
      <StyledText size={size} css={{ color: textColor }}>
        {label}
      </StyledText>
    </StyledContainer>
  );
};

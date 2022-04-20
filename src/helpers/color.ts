// import { parseRgb, RGB } from "./dom/parseRgb";
import { parseRgb } from "./dom/parseRgb";
import type { RGB } from "./dom/parseRgb";

export { parseRgb, RGB };

export function calculateContrast(color: RGB) {
  // for each c in r,g,b:
  //   c = c / 255.0
  //   if c <= 0.03928 then c = c/12.92 else c = ((c+0.055)/1.055) ^ 2.4
  // L = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const adjustValue = (val: number) => {
    val = val / 255;
    if (val <= 0.03928) {
      val = val / 12.92;
    } else {
      val = ((val + 0.055) / 1.055) ** 2.4;
    }
    return val;
  };
  const L = 0.2126 * adjustValue(color.r) + 0.7152 * adjustValue(color.g) + 0.0722 * adjustValue(color.b);
  return L;
}

type Shades = {
  dark: string;
  light: string;
};
export function getTextShade(color: RGB, shades: Shades): string {
  if (color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 186) {
    return shades.dark;
  }
  return shades.light;
}

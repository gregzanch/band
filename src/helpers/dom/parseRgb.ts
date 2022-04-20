export type RGB = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export function parseRgb(rgbString: string): RGB {
  if (rgbString.startsWith("rgba")) {
    const values = rgbString.slice(5, -1).split(/,\s?/);
    if (values.length !== 4) {
      throw new Error(`Could not parse '${rgbString}' as RGBA`);
    }
    return {
      r: Number(values[0]),
      g: Number(values[1]),
      b: Number(values[2]),
      a: Number(values[3]),
    };
  } else if (rgbString.startsWith("rgb")) {
    const values = rgbString.slice(4, -1).split(/,\s?/);
    if (values.length !== 3) {
      throw new Error(`Could not parse '${rgbString}' as RGB`);
    }
    return {
      r: Number(values[0]),
      g: Number(values[1]),
      b: Number(values[2]),
    };
  } else {
    throw new Error(`Could not parse '${rgbString}'`);
  }
}

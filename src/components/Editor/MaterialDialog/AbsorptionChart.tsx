import useTheme from "@/state/theme";
import { lightTheme, darkTheme } from "@/styles/stitches.config";
import { slate } from "@radix-ui/colors";
import { ResponsiveBar } from "@nivo/bar";

const NivoThemeMap = {
  [darkTheme]: {
    background: "transparent",
    textColor: darkTheme.colors.slate11.computedValue,
    fontSize: 11,
    axis: {
      domain: {
        line: {
          stroke: darkTheme.colors.slate10.computedValue,
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 13,
          fill: slate.slate8,
        },
      },
      ticks: {
        line: {
          stroke: darkTheme.colors.slate10.computedValue,
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: darkTheme.colors.slate11.computedValue,
        },
      },
    },
    grid: {
      line: {
        stroke: darkTheme.colors.slate7.computedValue,
        strokeWidth: 1,
      },
    },
    legends: {
      title: {
        text: {
          fontSize: 11,
          fill: darkTheme.colors.hiContrast.computedValue,
        },
      },
      text: {
        fontSize: 11,
        fill: darkTheme.colors.slate12.computedValue,
      },
      ticks: {
        line: {},
        text: {
          fontSize: 10,
          fill: darkTheme.colors.hiContrast.computedValue,
        },
      },
    },
    tooltip: {
      container: {
        background: darkTheme.colors.slate4,
        color: darkTheme.colors.hiContrast.computedValue,
        fontSize: 12,
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {},
    },
    annotations: {
      text: {
        fontSize: 13,
        fill: "#333333",
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      link: {
        stroke: "#000000",
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      outline: {
        stroke: "#000000",
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      symbol: {
        fill: "#000000",
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
    },
  },
  [lightTheme]: {
    background: "transparent",
    textColor: lightTheme.colors.hiContrast.computedValue,
    fontSize: 11,
    axis: {
      domain: {
        line: {
          stroke: lightTheme.colors.slate9.computedValue,
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: lightTheme.colors.slate12.computedValue,
        },
      },
      ticks: {
        line: {
          stroke: lightTheme.colors.slate9.computedValue,
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: lightTheme.colors.slate12.computedValue,
        },
      },
    },
    grid: {
      line: {
        stroke: lightTheme.colors.slate6.computedValue,
        strokeWidth: 1,
      },
    },
    legends: {
      title: {
        text: {
          fontSize: 11,
          fill: lightTheme.colors.hiContrast.computedValue,
        },
      },
      text: {
        fontSize: 11,
        fill: lightTheme.colors.hiContrast.computedValue,
      },
      ticks: {
        line: {},
        text: {
          fontSize: 10,
          fill: lightTheme.colors.hiContrast.computedValue,
        },
      },
    },

    tooltip: {
      container: {
        background: lightTheme.colors.slate4,
        color: lightTheme.colors.hiContrast.computedValue,
        fontSize: 12,
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {},
    },
    annotations: {
      text: {
        fontSize: 13,
        fill: "#333333",
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      link: {
        stroke: "#000000",
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      outline: {
        stroke: "#000000",
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      symbol: {
        fill: "#000000",
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
    },
  },
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export function AbsorptionChart({ data }) {
  const theme = useTheme((state) => state.theme);
  return (
    <ResponsiveBar
      data={data}
      //@ts-ignore
      theme={NivoThemeMap[theme]}
      keys={["absorption"]}
      indexBy='frequency'
      margin={{ top: 40, right: 10, bottom: 50, left: 40 }}
      padding={0.1}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisRight={{
        legend: null,
        legendPosition: "middle",
        legendOffset: 0,
        tickSize: null,
        tickPadding: null,
        tickValues: null,
        renderTick: () => null,
        ariaHidden: true,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Freq (Hz)",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisTop={{
        legend: "Acoustic Absorption",
        legendPosition: "middle",
        legendOffset: -20,
        tickSize: null,
        tickPadding: null,
        tickValues: null,
        renderTick: () => null,
        ariaHidden: true,
      }}
      // axisLeft={{
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0,
      //   legend: "Absorption",
      //   legendPosition: "middle",
      //   legendOffset: -60,
      // }}
      minValue={0}
      maxValue={1}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      // legends={[
      //   {
      //     dataFrom: "keys",
      //     anchor: "bottom-right",
      //     direction: "column",
      //     justify: false,
      //     translateX: 120,
      //     translateY: 0,
      //     itemsSpacing: 2,
      //     itemWidth: 100,
      //     itemHeight: 20,
      //     itemDirection: "left-to-right",
      //     itemOpacity: 0.85,
      //     symbolSize: 20,
      //     effects: [
      //       {
      //         on: "hover",
      //         style: {
      //           itemOpacity: 1,
      //         },
      //       },
      //     ],
      //   },
      // ]}
      role='application'
      ariaLabel='Nivo bar chart demo'

      // barAriaLabel={function (e) {
      //   return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      // }}
    />
  );
}

import { MaterialView } from "@/components/Editor/MaterialDialog/MaterialView";
import Landing from "@/components/Home/Landing";
import { Box } from "@/components/shared/Box";
import { Flex } from "@/components/shared/Flex";
import useTheme from "@/state/theme";

import { globalCss, css, darkTheme, lightTheme, styled } from "@/styles/stitches.config";
import { Fragment, useEffect } from "react";

// console.log(theme)
// console.log(darkTheme)

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: "$gray1",
  },
});

const Page = () => {
  const currTheme = useTheme((state) => state.theme);

  useEffect(() => {
    Object.assign(window, { useTheme });
    document.body.classList.remove(lightTheme, darkTheme);
    document.body.classList.add(currTheme);
  }, [currTheme]);

  globalStyles();

  return (
    <Flex justify='center' align='start' css={{ width: "100vw", height: "100vh", mt: "$8" }}>
      <Box css={{ width: "400px" }}>
        <MaterialView />
      </Box>
    </Flex>
  );
};

export default Page;

export async function getStaticProps() {
  return {
    props: {
      title: "localhost",
    },
  };
}

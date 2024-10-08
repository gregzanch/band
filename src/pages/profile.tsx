import useTheme from "@/state/theme";
import { globalCss, css, darkTheme, lightTheme, styled } from "@/styles/stitches.config";
import { Fragment, useEffect } from "react";
import { Docs } from "@/components/Docs/Docs";
import { ProfilePage } from "@/components/Profile/ProfilePage";

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

  return <ProfilePage />;
};

export default Page;

export async function getStaticProps() {
  return {
    props: {
      title: "Band",
    },
  };
}

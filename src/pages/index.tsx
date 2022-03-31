import Landing from "@/components/site/Landing"
import useTheme from "@/state/theme"

import { globalCss, css, darkTheme, theme, styled } from "@/styles/stitches.config"
import { Fragment, useEffect } from "react"

// console.log(theme)
// console.log(darkTheme)

const globalStyles = globalCss({
  body: { margin: 0, padding: 0, backgroundColor: "$elevation1" },
})

const Page = () => {
  const currTheme = useTheme((state) => state.theme)

  useEffect(() => {
    Object.assign(window, { useTheme })
    document.body.classList.remove(theme, darkTheme)
    document.body.classList.add(currTheme)
  }, [currTheme])

  globalStyles()

  return <Landing />
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: "Band",
    },
  }
}

import Head from "next/head"
import { useWindowFocus } from "@/hooks"
import { useEffect, useState } from "react"
const titleDefault = "Band"
const url = "https://github.com/gregzanch"
const description = "Simulate acoustic phenomena and generate impulse responses"
const author = "Greg Zanchelli"

const keywords = [
  "Simulation",
  "FDTD",
  "WebApp",
  "Raytracer",
  "Ray Tracing",
  "Acoustics",
  "Room Impulse Response",
  "Image Source Model",
  "Room Acoustics",
  "Computational Acoustics",
]

function getDir() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const Header = ({ title = titleDefault }) => {
  const [dir, setDir] = useState(null)
  useEffect(() => {
    setDir(getDir())
  }, [])
  useWindowFocus((e) => {
    const newDir = getDir()
    if (newDir !== dir) {
      setDir(newDir)
    }
  })
  return (
    <>
      <Head>
        {/* Recommended Meta Tags */}
        <meta charSet='utf-8' />
        <meta name='language' content='english' />
        <meta httpEquiv='content-type' content='text/html' />
        <meta name='author' content={author} />
        <meta name='designer' content={author} />
        <meta name='publisher' content={author} />

        {/* Search Engine Optimization Meta Tags */}
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords.join(",")} />
        <meta name='robots' content='index,follow' />
        <meta name='distribution' content='web' />
        {/* Facebook Open Graph meta tags */}
        <meta name='og:title' content={title} />
        <meta name='og:type' content='site' />
        <meta name='og:url' content={url} />
        <meta name='og:image' content={"/icons/share.png"} />
        <meta name='og:site_name' content={title} />
        <meta name='og:description' content={description} />

        <link rel='apple-touch-icon' sizes='180x180' href={`/icons/${dir}/apple-touch-icon.png`} />
        <link rel='icon' type='image/png' sizes='32x32' href={`/icons/${dir}/favicon-32x32.png`} />
        <link rel='icon' type='image/png' sizes='16x16' href={`/icons/${dir}/favicon-16x16.png`} />

        <meta name='msapplication-config' content='/browserconfig.xml' />
        <meta name='msapplication-TileColor' content='#000000' />
        <meta name='theme-color' content='#000000' />

        <link rel='manifest' href='/manifest.json' />

        {/* Meta Tags for HTML pages on Mobile */}
        {/* <meta name="format-detection" content="telephone=yes"/>
        <meta name="HandheldFriendly" content="true"/>  */}
        <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1.0' />
        <meta name='theme-color' content='#000' />
        <link rel='shortcut icon' href={`/icons/${dir}favicon.ico`} />

        {/* 
      Twitter Summary card
        documentation: https://dev.twitter.com/cards/getting-started
        Be sure validate your Twitter card markup on the documentation site. */}
        {/* <meta name='twitter:card' content='summary' /> */}
        {/* <meta name='twitter:site' content='@gregzanch' /> */}
      </Head>
    </>
  )
}

export default Header

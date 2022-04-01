import { useRouter } from 'next/router'
import useStore from '@/state/store'
import useTheme from "@/state/theme"
import { useEffect } from "react"
import Header from "@/config"
import "@/styles/index.css"

import ProgressBar from "@badrap/bar-of-progress"


const progress = new ProgressBar({
  size: 2,
  color: "#3b82f6",
  className: "bar-of-progress",
  delay: 100,
})

function App({ Component, pageProps = { title: "index" } }) {
  const router = useRouter()

  useEffect(() => {
    useStore.setState({ router })
    router.events.on("routeChangeStart", progress.start)
    router.events.on("routeChangeComplete", progress.finish)
    router.events.on("routeChangeError", progress.finish)

    return () => {
      router.events.off("routeChangeStart", progress.start)
      router.events.off("routeChangeComplete", progress.finish)
      router.events.off("routeChangeError", progress.finish)
    }
  }, [router])

  return (
    <>
      <Header title={pageProps.title} />
      <Component {...pageProps} />
    </>
  )
}

export default App

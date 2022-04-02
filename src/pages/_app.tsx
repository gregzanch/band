import { useRouter } from 'next/router'

import useTheme from "@/state/theme"
import { Fragment, useEffect } from "react"
import Header from "@/config"
import "@/styles/index.css"

import ProgressBar from "@badrap/bar-of-progress"

const progress = new ProgressBar({
  size: 2,
  color: "#3b82f6",
  className: "bar-of-progress",
  delay: 100,
})

const CSRPages = ["/editor"]

function App({ Component, pageProps = { title: "index" } }) {
  const router = useRouter()

  useEffect(() => {
    router.events.on("routeChangeStart", progress.start)
    router.events.on("routeChangeComplete", progress.finish)
    router.events.on("routeChangeError", progress.finish)

    return () => {
      router.events.off("routeChangeStart", progress.start)
      router.events.off("routeChangeComplete", progress.finish)
      router.events.off("routeChangeError", progress.finish)
    }
  }, [router])

  const isCSR = !!CSRPages.find((route) => router.pathname.startsWith(route))

  return isCSR ? (
    <div className='csr-container' suppressHydrationWarning>
      {typeof window !== "undefined" && (
        <Fragment>
          <Header title={pageProps.title} />
          <Component {...pageProps} />
        </Fragment>
      )}
    </div>
  ) : (
    <Fragment>
      <Header title={pageProps.title} />
      <Component {...pageProps} />
    </Fragment>
  )
}

export default App

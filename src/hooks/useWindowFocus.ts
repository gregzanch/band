import { useCallback, useEffect } from "react"

export function useWindowFocus(eventHandler: (e: FocusEvent) => void) {
  useEffect(() => {
    function handler(e: FocusEvent) {
      eventHandler(e)
    }
    window.addEventListener("focus", handler)
    window.addEventListener("blur", handler)
    return () => {
      window.removeEventListener("focus", handler)
      window.removeEventListener("blur", handler)
    }
  }, [])
}

import useEditor from "@/state/editor"
import useStore from "@/state/store"
import { Leva } from "@/components/dom/leva"
import { useEffect, useRef } from "react"

export default function Toolbar() {
  // const divRef = useRef<HTMLDivElement>(null)
  // useEffect(() => {
  //   if (divRef && divRef.current) {
  //     const parentElement = divRef.current.parentElement as HTMLDivElement
  //     const levaElement = divRef.current

  //     const onDownLeva = (e) => {
  //       useEditor.setState({ orbitControlDisabled: true })
  //       // e.stopPropagation()
  //     }

  //     const onUpLeva = (e) => {
  //       useEditor.setState({ orbitControlDisabled: false })
  //       // e.stopPropagation()
  //     }

  //     const onDownParent = (e) => {
  //       const target = e.target as HTMLElement
  //       if (levaElement.contains(target)) {
  //         useEditor.setState({ orbitControlDisabled: true })
  //       } else {
  //         useEditor.setState({ orbitControlDisabled: false })
  //       }
  //     }

  //     // levaElement.addEventListener('mousedown', onDownLeva)
  //     levaElement.addEventListener('pointerdown', onDownLeva)

  //     // parentElement.addEventListener('mousedown', onDownParent("m"), { capture: true })
  //     parentElement.addEventListener('pointerdown', onDownParent, { capture: true })

  //     // levaElement.addEventListener('mouseup', onUpLeva)
  //     levaElement.addEventListener('pointerup', onUpLeva)

  //     return () => {
  //       // levaElement.removeEventListener('mousedown', onDownLeva)
  //       levaElement.removeEventListener('pointerdown', onDownLeva)

  //       // parentElement.removeEventListener('mousedown', onDownParent)
  //       parentElement.removeEventListener('pointerdown', onDownParent)

  //       // levaElement.removeEventListener('mouseup', onUpLeva)
  //       levaElement.removeEventListener('pointerup', onUpLeva)
  //     }
  //   }
  // }, [])

  return (
    <div>
      <Leva
        // theme={myTheme} // you can pass a custom theme (see the styling section)
        // fill // default = false,  true makes the pane fill the parent dom node it's rendered in
        flat // default = false,  true removes border radius and shadow
        oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
        // hideTitleBar // default = false, hides the GUI header
        // collapsed // default = false, when true the GUI is collpased
        // hidden // default = false, when true the GUI is hidden
      />
    </div>
  )
}

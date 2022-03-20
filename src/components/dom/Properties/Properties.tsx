import useEditor from "@/state/editor"
import useStore from "@/state/store"
import { Leva } from "@/components/dom/leva"
import { useEffect, useRef } from "react"

export default function Properties() {
  return (
    <div className='h-full'>
      <Leva
        // theme={myTheme} // you can pass a custom theme (see the styling section)
        fill // default = false,  true makes the pane fill the parent dom node it's rendered in
        flat // default = false,  true removes border radius and shadow
        // oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
        titleBar={false} // default = false, hides the GUI header
        // collapsed // default = false, when true the GUI is collpased
        // hidden // default = false, when true the GUI is hidden
        hideCopyButton
      />
    </div>
  )
}

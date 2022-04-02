import { ContactShadows } from "@/components/Editor/Overlays/ContactShadows"
import { useRef } from "react"

export function Shadows() {
  const ref = useRef()

  return (
    <ContactShadows
      ref={ref}
      position={[0, 0.001, 0]}
      width={100}
      height={100}
      // far={20}
      // blur={20}
      // frames={1}
      rotation={[Math.PI / 2, 0, 0]}
    />
    // <Shadow
    //   color='black'
    //   colorStop={0}
    //   ref={ref}
    //   opacity={0.5}
    //   fog={false} // Reacts to fog (default=false)
    // />
  )
}

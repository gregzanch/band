import { ContactShadows } from "@react-three/drei"

export function Shadows() {
  return (
    <ContactShadows
      position={[0, 0.001, 0]}
      width={100}
      height={100}
      // far={20}
      // blur={20}
      rotation={[Math.PI / 2, 0, 0]}
    />
  )
}

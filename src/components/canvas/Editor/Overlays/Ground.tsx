import { Plane } from "@react-three/drei"

// function Plane({ color, ...props }) {
//   return (
//     <RoundedBox receiveShadow castShadow smoothness={10} radius={0.015} {...props}>
//       <meshStandardMaterial color={color} envMapIntensity={0.5} />
//     </RoundedBox>
//   )
// }

type GroundProps = {
  size?: number
  segments?: number
  color?: string | number
}

export function Ground({ size = 100, segments = 100, color = 0xb3b3b3 }: GroundProps) {
  return (
    <Plane
      args={[size, size, segments, segments]}
      receiveShadow
      castShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
    >
      <meshPhongMaterial attach='material' color={color} />
    </Plane>
  )
}

import { Plane } from "@react-three/drei"
import { LayerMap } from "@/components/Editor/Objects/types"
import useEditor from "../State/useEditor"
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
      // castShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      layers={LayerMap.ENVIRONMENT}
      // onClick={(e) => {
      //   useEditor.getState().signals.pointerMissed.dispatch()
      //   e.stopPropagation()
      // }}
      raycast={null}
    >
      <meshStandardMaterial
        attach='material'
        color={color}
        polygonOffset
        polygonOffsetFactor={0.1}
        // reflectivity={0.05}
        roughness={0.88}
        metalness={0}
        // clearcoat={0.25}
        // clearcoatRoughness={0.45}
        // transmission={0}
        // ior={1.5}
      />
      {/* <meshPhysicalMaterial
        attach='material'
        color={color}
        reflectivity={0.05}
        roughness={0.88}
        metalness={0}
        clearcoat={0.25}
        clearcoatRoughness={0.45}
        transmission={0}
        ior={1.5}
      /> */}
    </Plane>
  )
}

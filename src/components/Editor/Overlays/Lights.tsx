import { Fragment, useRef } from "react"
import { DirectionalLightHelper, SpotLightHelper, Vector3 } from "three"
import { Environment, BakeShadows, useHelper, Sky } from "@react-three/drei"
import useEditor from "@/components/Editor/State/useEditor"
import { RectAreaLightHelper } from "three-stdlib"
import { LayerMap } from "@/components/Editor/Objects/types"

const inclination = 0.2
const azimuth = 0.25
const theta = Math.PI * (inclination - 0.5)
const phi = 2 * Math.PI * (azimuth - 0.5)
const sunPosition = new Vector3(Math.cos(phi), Math.sin(phi) * Math.sin(theta), Math.sin(phi) * Math.cos(theta))
  .multiplyScalar(10)
  .toArray()

type DirectionalProps = {
  debug?: boolean
}

function Directional({ debug }: DirectionalProps) {
  const colors = useEditor((state) => state.colors)
  const ref = useRef()

  // const mesh = useRef()
  useHelper(debug && ref, DirectionalLightHelper, 1, "red") // you can passe false instead of the object ref to hide the helper

  return (
    <>
      <directionalLight
        ref={ref}
        position={[0, 8, -5]}
        castShadow
        intensity={0.7}
        color={colors.directionalLight.getHex()}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        // layers={LayerMap.LIGHTS}
      />
      <directionalLight
        ref={ref}
        position={[0, 8, 5]}
        castShadow
        intensity={0.7}
        color={colors.directionalLight.getHex()}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        // layers={LayerMap.LIGHTS}
      />
    </>
  )
}

type SpotProps = {
  debug?: boolean
}

function Spot({ debug }: SpotProps) {
  const colors = useEditor((state) => state.colors)
  const ref = useRef()

  // const mesh = useRef()
  useHelper(debug && ref, SpotLightHelper, "red") // you can passe false instead of the object ref to hide the helper

  return (
    <spotLight
      ref={ref}
      position={[0, 30, 0]}
      color={colors.spotLight.getHex()}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={100}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
      castShadow
      intensity={1}
      penumbra={0.75}
      distance={100}
      angle={0.8}
      decay={0.1}
      // layers={LayerMap.LIGHTS}
    />
  )
}

export function Lights() {
  const colors = useEditor((state) => state.colors)

  return (
    <>
      <Directional />
      {/* <RectArea debug /> */}
      {/* <Spot debug /> */}
      <ambientLight intensity={1.0} color={colors.ambientLight.getHex()} />
      <Environment files='/env-maps/studio_small_08_1k.pic' background={false} />
      {/* <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} /> */}
    </>
  )
}

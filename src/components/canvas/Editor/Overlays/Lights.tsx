import { Fragment, useRef } from "react"
import { DirectionalLightHelper, SpotLightHelper, Vector3 } from "three"
import { Environment, BakeShadows, useHelper } from "@react-three/drei"

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
  const ref = useRef()

  // const mesh = useRef()
  useHelper(debug && ref, DirectionalLightHelper, 1, "red") // you can passe false instead of the object ref to hide the helper

  return (
    <directionalLight
      ref={ref}
      position={sunPosition}
      castShadow
      intensity={1.5}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={100}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
    />
  )
}

type SpotProps = {
  debug?: boolean
}

function Spot({ debug }: SpotProps) {
  const ref = useRef()

  // const mesh = useRef()
  useHelper(debug && ref, SpotLightHelper, "red") // you can passe false instead of the object ref to hide the helper

  return (
    <spotLight
      ref={ref}
      position={sunPosition}
      // castShadow
      intensity={1}
      penumbra={0.5}
      distance={200}
      angle={0.7}
      decay={2}
    />
  )
}

export function Lights() {
  return (
    <>
      {/* <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      /> */}
      <Directional />
      <Spot />
      <ambientLight intensity={0.6} color={0xffffff} />
      <Environment files='https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/lebombo/lebombo_1k.hdr' />
      {/* <BakeShadows /> */}
    </>
  )
}

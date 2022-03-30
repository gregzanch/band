import { OutlineEffect } from "postprocessing"
import React, { createContext, forwardRef, ReactNode, useContext, useMemo, useState } from "react"
import { useThree } from "@react-three/fiber"

const OutlineContext = createContext<any>(null)

export interface OutlineEffectOptions {
  blendFunction?: number
  blur?: boolean
  edgeStrength?: number
  pulseSpeed?: number
  hiddenEdgeColor?: number
  visibleEdgeColor?: number
  kernelSize?: number
  width?: number
  height?: number
  xRay?: boolean
}

interface Props {
  children: ReactNode
  options?: OutlineEffectOptions
}
export function OutlineProvider(props: Props) {
  const { scene, camera } = useThree()
  const [options] = useState(props.options)
  const outlineEffect = useMemo(() => new OutlineEffect(scene, camera, options), [scene, camera, options])

  return <OutlineContext.Provider value={outlineEffect}>{props.children}</OutlineContext.Provider>
}

export function useOutline() {
  const outlineEffect = useContext(OutlineContext)
  if (!outlineEffect) {
    throw new Error("Missing Outline Provider")
  }
  return outlineEffect
}

export const Outline = forwardRef<any, {}>((props, ref) => {
  return <primitive ref={ref} object={useOutline()} dispose={null} />
})

export default useOutline

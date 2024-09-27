import { Environment, BakeShadows, useHelper, Sky } from "@react-three/drei";
import useEditor from "@/components/Editor/State/useEditor";
import { HemisphereLight, PMREMGenerator } from "three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

export function ModelEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const texture = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    window["pmrem"] = pmrem;
    return pmrem.fromScene(scene, 0.04).texture;
  }, [gl, scene]);

  return <hemisphereLight />;
}

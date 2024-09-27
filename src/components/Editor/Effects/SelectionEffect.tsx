import { useThree } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import { EffectComposer, Outline } from "@/components/Editor/Effects";
import { OutlineEffect, BlendFunction, EffectComposer as EffectComposerImpl } from "postprocessing";
import useEditor from "../State/useEditor";
import type { BandObject } from "@/components/Editor/Objects";
import { Source, Receiver, Group, Mesh, ObjectType } from "@/components/Editor/Objects";

export function SelectionEffect() {
  const outlineRef = useRef<OutlineEffect>();
  const composerRef = useRef<EffectComposerImpl>();
  const { gl, camera, scene } = useThree();
  const selection = useEditor((state) => state.selection);

  return (
    <Suspense fallback={null}>
      <EffectComposer ref={composerRef} autoClear={false} enabled camera={camera} scene={scene} multisampling={8}>
        <Outline
          edgeStrength={5}
          blendFunction={BlendFunction.ALPHA}
          pulseSpeed={0.0}
          visibleEdgeColor={0xffcc00}
          hiddenEdgeColor={0xffcc00}
          selection={selection.length > 0 ? unwrapSelection(selection) : undefined}
          //@ts-ignore
          ref={outlineRef}
        />
      </EffectComposer>
    </Suspense>
  );
}

function isBandObject(obj: any): obj is BandObject {
  return [Group, Mesh, Receiver, Source].some((ObjClass) => obj instanceof ObjClass);
}

function unwrapSelection(selection: BandObject[]): BandObject[] {
  return selection.reduce((acc, curr) => {
    if (curr.type === ObjectType.GROUP) {
      //@ts-ignore
      return [
        ...acc,
        ...unwrapSelection(
          curr.children
            .filter((child) => isBandObject(child))
            .map((child) => (child instanceof Mesh ? (child.edges as any) : child))
        ),
      ];
    } else {
      return [...acc, curr instanceof Mesh ? curr.edges : curr];
    }
  }, []);
}

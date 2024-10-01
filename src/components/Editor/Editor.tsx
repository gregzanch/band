import hotkeys from "hotkeys-js"
import { useEffect, Suspense, useCallback } from "react";
import { Floor, Ground, Shadows } from "@/components/Editor/Overlays";
import { Lights } from "@/components/Editor/Lighting";
import { Controls } from "@/components/Editor/Controls";
import { Color, Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import useEditor, { EditorColorMap } from "@/components/Editor/State/useEditor";

import { useHotkeys } from "react-hotkeys-hook";
import { MenuHotkeys, ActionMap } from "@/components/Editor/MainMenu";
import { SelectionEffect } from "@/components/Editor/Effects";
import { OrientationGizmo } from "@/components/Editor/Gizmos/OrientationGizmo";
import { darkTheme, theme } from "@/styles/stitches.config";
import useTheme from "@/state/theme";

import { AddObjectCommand } from "@/components/Editor/State/Commands/AddObjectCommand";
import { Source, Receiver, RenderObjects, BandObject } from "@/components/Editor/Objects";
import { RayTracer } from "@/solvers";
import { RayTracerResults } from "./Solutions";
import { RenderSolutions } from "./Solutions/RenderSolutions";

function useThemeSubscription() {
  useEffect(() => {
    const unsub = useTheme.subscribe(
      (store) => store.theme,
      (theme) => {
        if (EditorColorMap.has(theme)) {
          // TODO change wireframe color?
          useEditor.setState({ colors: EditorColorMap.get(theme) });
        }
      },
      {
        fireImmediately: true,
      }
    );
    return unsub;
  }, []);
}

function useEditorHotkeys() {
  useHotkeys("esc", () => {
    const { transformControls, materialDialogOpen } = useEditor.getState();
    if (transformControls && transformControls.enabled) {
      transformControls.enabled = false;
      transformControls.visible = false;
    } else if (!materialDialogOpen) {
      useEditor.setState({ selection: [] });
    }
  });

  useHotkeys("m", (keyboardEvent, hotkeysEvent) => {
    const { transformControls } = useEditor.getState();
    if (transformControls) {
      transformControls.enabled = true;
      transformControls.visible = true;
    }
  });

  useEffect(() => {
    Object.entries(MenuHotkeys).forEach(([action, hotkey]) => {
      hotkeys(hotkey, () => {
        if (ActionMap[action]) {
          ActionMap[action]();
          return false;
        }
      });
    });

    return () => {
      Object.entries(MenuHotkeys).forEach(([action, hotkey]) => {
        if (ActionMap[action]) {
          hotkeys.unbind(hotkey, ActionMap[action]);
        }
      });
    };
  }, []);
}

function useEditorDebug() {
  useEffect(() => {
    Object.assign(window, { useEditor, darkTheme, theme, Color, Vector3, RayTracer });
    setTimeout(() => {
      // console.clear();
      const { initialize, uploadFileFromUrl, history } = useEditor.getState();
      initialize();
      uploadFileFromUrl("models/raya/split-strange.gltf");
      history.execute(
        new AddObjectCommand(
          useEditor,
          new Source("New Source", [-2.15, 1.85, -5.5], 0x44a273).addToDefaultScene(useEditor)
        )
      );
      const rec = new Receiver("New Receiver", [7.4, 2.87, -10.2], 0xe5732a).addToDefaultScene(useEditor);
      rec.scale.set(2.5, 2.5, 2.5);
      history.execute(new AddObjectCommand(useEditor, rec));
    }, 500);
    setTimeout(() => {
      const rt = new RayTracer("name");
      const [src, receiver, group] = useEditor.getState().scene.children.slice(-3);
      rt.sources.add(src as Source);
      rt.receivers.add(receiver as Receiver);
      rt.intersectableObjects.push(...(group.children as BandObject[]));
      rt.intersectableObjects.push(receiver as Receiver);
      Object.assign(window, { rt });
      useEditor.setState({ solvers: { [rt.id]: rt } });
      const { history } = useEditor.getState();
      // history.execute()
    }, 1500);
  }, []);
}

function Editor() {
  const colors = useEditor((state) => state.colors);

  useThemeSubscription();
  useEditorHotkeys();
  useEditorDebug();

  const handlePointerMissed = useCallback((e: MouseEvent) => {
    const { transformControls } = useEditor.getState();
    if (transformControls && transformControls.enabled) {
      transformControls.enabled = false;
      transformControls.visible = false;
    } else {
      useEditor.setState((prev) => ({ selection: e.shiftKey ? prev.selection : [] }));
    }
    e.stopPropagation();
  }, []);

  return (
    <Canvas
      shadows
      mode='concurrent'
      dpr={[1, 2]}
      gl={{ antialias: true, stencil: true }}
      style={{ backgroundColor: `#${colors.canvasBackground.getHexString()}`, userSelect: "none" }}
      onPointerMissed={handlePointerMissed}
    >
      <Controls />
      <OrientationGizmo />
      <Suspense fallback={null}>
        <Lights />
        <fog attach='fog' args={[colors.fog.getHex(), 0, 75]} />
      </Suspense>
      <Floor
        size={100}
        segments={100}
        primary={colors.floorPrimary.getHex()}
        secondary={colors.floorSecondary.getHex()}
      />
      <Ground color={colors.ground.getHex()} size={100} segments={100} />
      <Shadows />
      <SelectionEffect />
      <RenderObjects />
      <RenderSolutions />
    </Canvas>
  );
}

export default Editor

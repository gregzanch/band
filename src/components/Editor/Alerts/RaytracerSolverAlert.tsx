import React from "react";

import { useEditor } from "@/components/Editor/State/useEditor";
import { useSolver } from "@/components/Editor/State/useSolver";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/shared/AlertDialog";
import { Flex } from "@/components/shared/Flex";
import { Button } from "@/components/shared/Button";
import { LevaPanel, useControls } from "@/components/Editor/Leva";
import { Store } from "../Leva/store";

import { SolutionLocation } from "@/solvers/Solver";
import { RayTracerSolverConfig } from "@/solvers/RayTracerSolver";
import { Effect } from "effect";

export const raytracerSolverParameterStore = new Store();

export function RaytracerSolverAlert({}) {
  const raytracerSolverAlertOpen = useEditor((state) => state.raytracerSolverAlertOpen);
  const { maxOrder, rayCount, location, outputName, stepsPerIteration } = useControls(
    {
      location: {
        value: "local" as SolutionLocation,
        options: ["local", "worker", "cloud"] as SolutionLocation[],
        label: "Solution Location",
      },
      maxOrder: {
        value: 250,
        min: 0,
        label: "Max Order",
      },
      rayCount: {
        min: 1,
        label: "Total Rays",
        value: 250000,
      },
      stepsPerIteration: {
        value: 2500,
        label: "Steps per Iteration",
        min: 1,
      },
      outputName: {
        value: "raytraced-ir.wav",
        label: "Output Filename",
      },
    },
    { store: raytracerSolverParameterStore }
  );

  const rayTracerParams: RayTracerSolverConfig = { maxOrder, rayCount, outputName, stepsPerIteration };
  const objects = useEditor((store) => store.objects);
  const onSolve = async (e) => {

    const rayTracerSolver = useSolver
      .getState()
      .createRayTracerSolver(location, rayTracerParams, objects)
      .addProgressCallback("start", console.log)
      .addProgressCallback("progress", console.log)
      .addProgressCallback("end", console.log)
      .addProgressCallback("fail", console.error)
      .addProgressCallback("cancel", () => console.log("canceled"));

    Effect.runPromise(rayTracerSolver.start()).then(console.log, console.error);
  };
  return (
    <AlertDialog
      defaultOpen={false}
      open={raytracerSolverAlertOpen}
      onOpenChange={(isOpen) => useEditor.setState({ raytracerSolverAlertOpen: isOpen })}
    >
      <AlertDialogContent>
        <AlertDialogTitle>Raytracer Parameters</AlertDialogTitle>
        <Flex fillWidth gap='2'>
          <LevaPanel store={raytracerSolverParameterStore} fill flat titleBar={false} hideCopyButton />
        </Flex>
        <Flex css={{ justifyContent: "flex-end" }}>
          <AlertDialogCancel asChild>
            <Button variant='gray' css={{ marginRight: "$2" }}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant='green' onClick={onSolve}>
              Solve
            </Button>
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import React, { useState } from "react";
import { styled, keyframes } from "@/styles/stitches.config";
import { violet, blackA, red, mauve } from "@radix-ui/colors";
import { useEditor } from "@/components/Editor/State/useEditor";
import { useSolver } from "@/components/Editor/State/useSolver";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shared/AlertDialog";
import { Flex } from "@/components/shared/Flex";
import { Button } from "@/components/shared/Button";
import { Slider } from "@/components/shared/Slider";
import { Box } from "@/components/shared/Box";
import { RaytracerSolverParameters } from "@/components/Editor/State/Schema/Raytracer";
import { Text } from "@/components/shared/Text";
import { Tooltip } from "@/components/shared/Tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { Number } from "../Leva/components/Number";
import { ValueInput } from "../Leva/components/ValueInput";

import { LevaPanel, useControls } from "@/components/Editor/Leva";
import { Store } from "../Leva/store";
import { Job, JobStatus } from "../State/Schema/Job";
import { SolutionType } from "../State/Procedure";

export const raytracerSolverParameterStore = new Store();

const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  gap: 20,
  alignItems: "center",
});

// const Label = styled('label', {
//   fontSize: 13,
//   color: violet.violet11,
//   width: 75,
// });

const Input = styled("input", {
  all: "unset",
  width: "100%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1",
  borderRadius: "$2",
  px: "$2",
  // padding: "0 10px",
  fontSize: "$3",
  lineHeight: 1,
  color: "$highlight2",
  backgroundColor: "$slate2",
  boxShadow: "inset 0px 0px 0px 1px $colors$slate7",
  height: 25,

  "&:focus": { boxShadow: "inset 0px 0px 0px 2px $colors$slate7", color: "$hiContrast" },
});

export function RaytracerSolverAlert({}) {
  const raytracerSolverAlertOpen = useEditor((state) => state.raytracerSolverAlertOpen);
  // const jobs = useSolver((state) => state.jobs);
  // const jobs = useSolver((state) => state.createWebSocketWithId);
  const { maxOrder, rayCount, modelName, outputName } = useControls(
    {
      maxOrder: {
        value: 250,
        label: "Max Order",
      },
      rayCount: {
        label: "Total Rays",
        value: 250000,
      },
      modelName: {
        value: "raytraced-1.gltf",
        label: "Model Filename",
      },
      outputName: {
        value: "raytraced-ir.wav",
        label: "Output Filename",
      },
    },
    { store: raytracerSolverParameterStore }
  );

  return (
    <AlertDialog
      defaultOpen={false}
      open={raytracerSolverAlertOpen}
      onOpenChange={(isOpen) => useEditor.setState({ raytracerSolverAlertOpen: isOpen })}
    >
      {/* <AlertDialogTrigger asChild>
      <Button>Delete account</Button>
    </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogTitle>Raytracer Parameters</AlertDialogTitle>
        {/* <AlertDialogDescription>
          Adjust these parameters to fine tune your raytraced impulse response
        </AlertDialogDescription> */}
        <Flex fillWidth gap='2'>
          <LevaPanel store={raytracerSolverParameterStore} fill flat titleBar={false} hideCopyButton />
          {/* <Slider defaultValue={[250]} step={5} min={5} max={1000} /> */}
        </Flex>
        <Flex css={{ justifyContent: "flex-end" }}>
          <AlertDialogCancel asChild>
            <Button variant='gray' css={{ marginRight: "$2" }}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant='green'
              onClick={async (e) => {
                const { solve } = useSolver.getState();
                const rayaModel = await useEditor.getState().getRayaModelFile(
                  {
                    max_order: maxOrder,
                    ray_count: rayCount,
                  },
                  modelName
                );

                await solve(
                  "raytrace-1",
                  {
                    max_order: maxOrder,
                    ray_count: rayCount,
                    model_path: modelName,
                    output_path: outputName,
                  },
                  rayaModel
                );
              }}
            >
              Solve
            </Button>
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
}

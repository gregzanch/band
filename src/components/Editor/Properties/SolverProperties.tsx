import useEditor from "@/components/Editor/State/useEditor";
import { LevaPanel, useControls } from "@/components/Editor/Leva";
import { Store } from "../Leva/store";
import { useEffect, useMemo, useRef } from "react";
import { Text } from "@/components/shared/Text";
import { Box } from "@/components/shared/Box";
import { ObjectType } from "@/components/Editor/Objects/types";
import { BandObject } from "../Objects";
import { intersection } from "@/helpers/set";
import { Vector3Tuple } from "three";
import { Schema, SpecialInputs } from "../Leva/types";
import { Mesh } from "../Objects";
import { button, buttonGroup } from "../Leva/helpers";
import { EmptySelection } from "./EmptySelection";
import { Solver, SolverUpdateKeys } from "@/solvers";

export const solverPropertiesStore = new Store();

function convertSolversToOptions(solvers: Record<string, Solver>): Record<string, Solver> {
  const options = {};
  for (const id of Object.keys(solvers)) {
    options[solvers[id].name] = solvers[id];
  }
  return options;
}

function SelectedSolverSwitcher() {
  const solvers = useEditor(
    (state) => {
      return state.solvers;
    },
    (solvers, newSolvers) => {
      const oldIds = new Set(Object.keys(solvers));
      const newIds = new Set(Object.keys(newSolvers));
      return oldIds.difference(newIds).size == 0;
    }
  );
  const selectedSolver = useEditor(
    (state) => state.selectedSolver,
    (oldSelection, newSelection) => {
      if (oldSelection == null) return false;
      if (oldSelection.id !== newSelection.id) return false;
      return true;
    }
  );

  const [, set] = useControls(
    () => {
      const controlSchema = {
        solver: {
          options: solvers,
          onChange: (selectedSolver) => {
            useEditor.setState({ selectedSolver });
          },
        },
      };
      return controlSchema;
    },
    { store: solverPropertiesStore },
    [selectedSolver?.updateSymbol]
  );

  return <LevaPanel store={solverPropertiesStore} fill flat titleBar={false} hideCopyButton />;
}

export function SolverProperties() {
  return (
    <Box id='object-properties'>
      <SelectedSolverSwitcher />
    </Box>
  );
}

export default SolverProperties;

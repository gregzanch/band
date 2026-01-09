import create, { SetState, GetState, Mutate, StoreApi } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { RayTracerSolver, RayTracerSolverConfig } from "@/solvers/RayTracerSolver";
import { BandObject } from "../Objects";
import { SolutionLocation, Solver } from "@/solvers/Solver";
import { StatisticalReverbTimeSolverConfig } from "@/solvers/StatisticalReverbTimeSolver";

declare global {
  type WebSocketWithId = WebSocket & { connectionId: string };
}

type SolverState = {
  solvers: Solver<RayTracerSolverConfig | StatisticalReverbTimeSolverConfig>[];
};

type SolverReducers = {
  set: SetState<SolverState & SolverReducers>;
  createRayTracerSolver: (location: SolutionLocation, params: RayTracerSolverConfig, objects: Record<string, BandObject>) => RayTracerSolver;
};

const initialState: SolverState = {
  solvers: [],
};

export const useSolver = create<
  SolverState & SolverReducers,
  SetState<SolverState & SolverReducers>,
  GetState<SolverState & SolverReducers>,
  Mutate<StoreApi<SolverState & SolverReducers>, [["zustand/subscribeWithSelector", never]]>
>(
  subscribeWithSelector((set, get, api) => ({
    ...initialState,
    set,
    createRayTracerSolver: (location: SolutionLocation, params: RayTracerSolverConfig, objects: Record<string, BandObject>) => {
      const rts = new RayTracerSolver(location).setConfig(params).setObjects(objects);
      return rts;
    },

  }))
);

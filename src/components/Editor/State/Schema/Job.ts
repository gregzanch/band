import { SolutionType } from "../Procedure";
import { RaytracerSolverParameters } from "./Raytracer";

export enum JobStatus {
  QUEUED = "queued",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export type BaseJob = {
  id: string;
  name: string;
  created: Date;
  status: JobStatus;
  progress: number;
  log: string[];
};

export type Job = BaseJob & {
  solutionType: SolutionType.RAYTRACER;
  solverParameters: RaytracerSolverParameters;
};

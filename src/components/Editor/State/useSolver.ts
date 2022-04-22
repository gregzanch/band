import { nanoid } from "nanoid";
import create, { SetState, GetState, Mutate, StoreApi } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { MessageType, Procedure, SolutionType } from "./Procedure";
import { Job, JobStatus } from "./Schema/Job";
import { RaytracerSolverParameters } from "./Schema/Raytracer";

declare global {
  type WebSocketWithId = WebSocket & { connectionId: string };
}

type SolverState = {
  webSockets: Record<string, WebSocketWithId>;
  jobs: Record<string, Job>;
};

type SolverReducers = {
  set: SetState<SolverState & SolverReducers>;
  solve: (name: string, params: RaytracerSolverParameters, modelFile: File) => Promise<void>;
  createWebSocketWithId: () => WebSocketWithId;
};

const initialState: SolverState = {
  webSockets: {},
  jobs: {},
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
    createWebSocketWithId: () => {
      const ws: WebSocketWithId = Object.assign(new WebSocket("ws://localhost:8080"), { connectionId: nanoid(10) });
      set((prev) => ({
        webSockets: {
          ...prev.webSockets,
          [ws.connectionId]: ws,
        },
      }));
      return ws;
    },
    solve: async (name: string, params: RaytracerSolverParameters, modelFile: File) => {
      const ws = get().createWebSocketWithId();

      const job: Job = {
        id: ws.connectionId,
        name,
        created: new Date(),
        log: [],
        progress: 0,
        solutionType: SolutionType.RAYTRACER,
        status: JobStatus.QUEUED,
        solverParameters: params,
      };

      const procedure = new Procedure(ws);

      procedure.addTask("connect", async (task) => {
        await task.begin();

        async function listen(e: MessageEvent<any>) {
          const data = JSON.parse(e.data);
          console.log(data);
          switch (data.messageType) {
            case MessageType.ERROR:
              task.ws.removeEventListener("message", listen);
              await task.fail(data.reason);
              break;
            case MessageType.INIT:
              task.ws.removeEventListener("message", listen);
              await task.finish();
              break;
            default:
              break;
          }
        }

        task.ws.addEventListener("message", listen);

        task.ws.send(
          JSON.stringify({
            connectionId: task.ws.connectionId,
            messageType: MessageType.INIT,
          })
        );
      });

      procedure.addTask("set solver parameters", async (task) => {
        await task.begin();

        const headers = new Headers();
        headers.append("connectionId", task.ws.connectionId);
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          name,
          solutionType: SolutionType.RAYTRACER,
          solverParameters: {
            max_order: 300, // TODO make this work
            ray_count: 100000, // TODO make this work
            model_path: modelFile.name,
            output_path: `${name}.wav`,
          },
        });

        const result = await fetch("http://localhost:8081/set-solver-parameters", {
          method: "POST",
          headers,
          body: raw,
          redirect: "follow",
        }).then((response) => response.json());

        if (!result.success) {
          return task.fail(result.reason);
        }
        return task.finish();
      });

      procedure.addTask("upload resources", async (task) => {
        await task.begin();

        const headers = new Headers();
        headers.append("connectionId", task.ws.connectionId);

        const formdata = new FormData();
        formdata.append("model", modelFile, modelFile.name);

        const result = await fetch("http://localhost:8081/upload-resources", {
          method: "POST",
          headers,
          body: formdata,
          redirect: "follow",
        }).then((response) => response.json());

        if (!result.success) {
          return task.fail(result.reason);
        }
        return task.finish();
      });

      procedure.addTask("solve", async (task) => {
        await task.begin();

        const progressMessages = [];

        async function listen(e: MessageEvent<any>) {
          const data = JSON.parse(e.data);
          console.log(data);
          switch (data.messageType) {
            // fail if theres an error
            case MessageType.ERROR:
              task.ws.removeEventListener("message", listen);
              await task.fail(data.reason);
              break;

            // finish task on completed message
            case MessageType.COMPLETED:
              {
                task.ws.removeEventListener("message", listen);
                const fullLog = progressMessages.join("\n");
                console.log(fullLog);
                await task.finish();
              }
              break;

            // update user on progress
            case MessageType.PROGRESS:
              // TODO
              progressMessages.push(
                ...data.message
                  .split("\n")
                  .map((x) => x.trim())
                  .filter((x) => x)
              );
              break;

            default:
              break;
          }
        }

        task.ws.addEventListener("message", listen);

        task.ws.send(
          JSON.stringify({
            connectionId: task.ws.connectionId,
            messageType: MessageType.START,
          })
        );
      });

      procedure.onFinish = async (proc) => {
        console.log(proc);
      };

      ws.onopen = async () => {
        await procedure.tasks[0].fn(procedure.tasks[0]);
      };
    },
  }))
);

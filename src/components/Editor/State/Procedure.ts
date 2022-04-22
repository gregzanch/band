export enum MessageType {
  INIT = "init",
  START = "start",
  PROGRESS = "progress",
  COMPLETED = "completed",
  CLOSE = "close",
  ERROR = "error",
}

export enum TaskStatus {
  NOT_STARTED = "not-started",
  STARTED = "started",
  FINISHED = "finished",
  FAILED = "failed",
}

export enum SolutionType {
  RAYTRACER = "raytracer",
}

type TaskFunction = (task: Task) => Promise<void>;

export class Task {
  name: string;
  ws: WebSocketWithId;
  status: TaskStatus;
  statusMessage: string;
  fn: TaskFunction;
  onStatusChange: TaskFunction;

  constructor(name: string, ws: WebSocketWithId, fn: TaskFunction, onStatusChange: TaskFunction) {
    this.name = name;
    this.ws = ws;
    this.status = TaskStatus.NOT_STARTED;
    this.statusMessage = "Waiting to start";
    this.fn = fn;
    this.onStatusChange = onStatusChange;
  }

  async begin() {
    this.status = TaskStatus.STARTED;
    this.statusMessage = "Task has started";
    await this.onStatusChange(this);
  }
  async fail(reason) {
    this.status = TaskStatus.FAILED;
    this.statusMessage = reason ? `Task failed because ${reason}` : "Task failed";
    await this.onStatusChange(this);
  }
  async finish() {
    this.status = TaskStatus.FINISHED;
    this.statusMessage = "Task finished";
    await this.onStatusChange(this);
  }
}

export class Procedure {
  ws: WebSocketWithId;
  tasks: Task[];
  completed: Task[];
  onFinish: (proc: Procedure) => Promise<void>;
  constructor(ws: WebSocketWithId) {
    this.ws = ws;
    this.tasks = [];
    this.completed = [];
    this.onFinish = async (proc) => {};
  }
  addTask(name: string, fn: TaskFunction, onStatusChange = async (task) => {}) {
    this.tasks.push(
      new Task(name, this.ws, fn, async (task) => {
        console.log(`${task.name} | ${task.status} | ${task.statusMessage}`);
        await onStatusChange(task);
        switch (task.status) {
          case TaskStatus.STARTED:
            break;
          case TaskStatus.FAILED:
            break;
          case TaskStatus.FINISHED:
            {
              const completedTask = this.tasks.shift();
              this.completed.push(completedTask);
              if (this.tasks.length > 0) {
                await this.tasks[0].fn(this.tasks[0]);
              } else {
                await this.onFinish(this);
              }
            }
            break;
          default:
            break;
        }
      })
    );
    return this;
  }
}

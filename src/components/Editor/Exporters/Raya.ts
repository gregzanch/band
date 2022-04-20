export type RayaParameters = {
  max_order: number;
  ray_count: number;
};

export enum NODE_TYPE {
  REFLECTOR = 1,
  SOURCE = 2,
  RECEIVER = 3,
  GROUP = 4,
}

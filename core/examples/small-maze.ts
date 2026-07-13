import { MazeWorld } from "@/core/environments/maze-world";
import { KeyValueStore } from "@/core/utils/key-value-store";

export const SMALLMAZE = new MazeWorld(
  [5, 5],
  new KeyValueStore([
    [[2, 2], { kind: "obstacle" }],
    [[4, 4], { kind: "terminal" }],
  ]),
);

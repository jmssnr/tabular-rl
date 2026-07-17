import { Grid } from "@/core/dynamics/grid";
import { createMazeWorld } from "@/core/dynamics/worlds/maze";

export const SMALL_MAZE_WORLD = createMazeWorld(
  new Grid(
    [5, 5],
    [
      [[2, 2], { kind: "obstacle" }],
      [[4, 4], { kind: "terminal" }],
    ],
  ),
);

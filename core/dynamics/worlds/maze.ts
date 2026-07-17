import { Environment } from "@/core/dynamics/environment";
import { Grid } from "@/core/dynamics/grid";
import { GridState } from "@/core/dynamics/types";
import { addsDefault } from "@/core/dynamics/utils";

const DEFAULTS = {
  stepPenalty: -1,
  terminalReward: 1,
};

type Config = Partial<typeof DEFAULTS>;

export type MazeState = GridState;

export function createMazeWorld(grid: Grid, config: Config = {}) {
  const options = addsDefault(config, DEFAULTS);

  const world = new Environment({
    grid,
    cellTransitions: {
      terminal: (ctx) => ({
        ...ctx.result,
        reward: ctx.result.reward + options.terminalReward,
        stop: true,
      }),
    },
    globalTransitions: [
      (ctx) => ({
        ...ctx.result,
        reward: ctx.result.reward + options.stepPenalty,
      }),
    ],
  });

  return world;
}

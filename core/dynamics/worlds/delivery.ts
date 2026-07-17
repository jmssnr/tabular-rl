import { Environment } from "@/core/dynamics/environment";
import { Grid } from "@/core/dynamics/grid";
import { GridState } from "@/core/dynamics/types";
import { addsDefault } from "@/core/dynamics/utils";

const DEFAULTS = {
  stepPenalty: -1,
  terminalReward: 5,
  terminalPenalty: -5,
};

type Config = Partial<typeof DEFAULTS>;

export type DeliveryState = GridState & { hasItem: 0 | 1 };

export function createDeliveryWorld(grid: Grid, config: Config = {}) {
  const options = addsDefault(config, DEFAULTS);

  const world = new Environment<DeliveryState>({
    grid,
    cellTransitions: {
      pickup: (ctx) => ({
        ...ctx.result,
        state: { ...ctx.result.state, hasItem: 1 },
      }),
      terminal: (ctx) => {
        const hasDelivered = ctx.result.state.hasItem === 1;
        const stop = hasDelivered ? true : undefined;

        return {
          ...ctx.result,
          state: { ...ctx.result.state, hasItem: 0 },
          reward:
            ctx.result.reward +
            (hasDelivered ? options.terminalReward : options.terminalPenalty),
          stop,
        };
      },
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

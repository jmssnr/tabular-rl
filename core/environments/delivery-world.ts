import { GridWorld } from "@/core/environments/grid-world";
import {
  CellBasedTransitions,
  GlobalTransitions,
  Grid,
  Position,
} from "@/core/types";

const DEFAULTS = {
  stepPenalty: -1,
  terminalReward: 5,
  terminalPenalty: -5,
};

type Config = typeof DEFAULTS;
type State = { position: Position; hasItem: 0 | 1 };

export class DeliveryWorld extends GridWorld<State, Config> {
  states: State[];
  cellBasedTransitions: CellBasedTransitions<State>;
  globalTransitions: GlobalTransitions<State>;

  constructor(
    shape: [number, number],
    grid: Grid,
    config: Partial<Config> = {},
  ) {
    super(shape, grid, config, DEFAULTS);

    this.states = this.enumerateStates();

    this.cellBasedTransitions = {
      terminal: (ctx) => {
        const hasDeliveredItem = ctx.result.state.hasItem === 1;
        const stop = hasDeliveredItem ? true : undefined;

        return {
          ...ctx.result,
          reward:
            ctx.result.reward +
            (hasDeliveredItem
              ? this.config.terminalReward
              : this.config.terminalPenalty),
          stop,
        };
      },

      pickup: (ctx) => ({
        ...ctx.result,
        state: { ...ctx.result.state, hasItem: 1 },
      }),
    };

    this.globalTransitions = [
      (ctx) => ({
        ...ctx.result,
        reward: ctx.result.reward + this.config.stepPenalty,
      }),
    ];
  }

  private enumerateStates() {
    const positions = this.walkablePositions();
    const hasItems = [0, 1] as const;

    return hasItems.flatMap((hasItem) =>
      positions.map((position) => ({ position, hasItem })),
    );
  }
}

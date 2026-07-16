import { GridWorld } from "@/core/environments/grid-world";
import {
  Cell,
  CellBasedTransitions,
  GlobalTransitions,
  Grid,
  Position,
} from "@/core/types";
import { KeyValueStore } from "@/core/utils/key-value-store";

const DEFAULTS = {
  stepPenalty: -1,
  idlePenalty: -50,
  overflowPenalty: -10,
  deliveryReward: 100,
  emptyHandedPenalty: -10,
};

type Config = typeof DEFAULTS;

export type State = {
  position: Position;
  hasItem: 0 | 1;
  buffers: KeyValueStore<Position, number>;
};

export class FactoryWorld extends GridWorld<State, Config> {
  states: State[];
  cellBasedTransitions: CellBasedTransitions<State>;
  globalTransitions: GlobalTransitions<State>;
  progress: KeyValueStore<Position, number>;

  constructor(
    shape: [number, number],
    grid: Grid,
    config: Partial<Config> = {},
  ) {
    super(shape, grid, config, DEFAULTS);

    this.states = this.enumerateStates();

    this.progress = this.initializeMachineProgress();
    const machines = this.getMachines();

    this.cellBasedTransitions = {
      pickup: (ctx) => ({
        ...ctx.result,
        state: { ...ctx.result.state, hasItem: 1 },
      }),

      machine: (ctx) => {
        const position = ctx.result.state.position;
        const buffers = new KeyValueStore(ctx.result.state.buffers.entries());
        const buffer = buffers.get(ctx.result.state.position)!;
        const bufferCapacity = ctx.cell.bufferCapacity;

        if (ctx.result.state.hasItem === 1) {
          if (buffer >= bufferCapacity)
            return {
              ...ctx.result,
              reward: ctx.result.reward + this.config.overflowPenalty,
            };

          buffers.set(position, buffer + 1);

          return {
            ...ctx.result,
            state: { ...ctx.result.state, buffers, hasItem: 0 },
            reward: ctx.result.reward + this.config.deliveryReward,
          };
        } else {
          if (buffer < bufferCapacity)
            return {
              ...ctx.result,
              reward: ctx.result.reward + this.config.emptyHandedPenalty,
            };
        }

        return ctx.result;
      },
    };

    this.globalTransitions = [
      // Machine transitions
      (ctx) => {
        const buffers = new KeyValueStore(ctx.result.state.buffers.entries());

        for (const [position, buffer] of buffers) {
          if (buffer > 0) {
            const currentMachineProgress = this.progress.get(position)!;
            const nextProgress =
              currentMachineProgress + machines.get(position)!.rate;

            if (nextProgress >= 1) {
              buffers.set(position, buffers.get(position)! - 1);
              this.progress.set(position, 0);
            } else {
              this.progress.set(position, nextProgress);
            }
          }
        }
        return { ...ctx.result, state: { ...ctx.result.state, buffers } };
      },

      // Idle cost
      (ctx) => {
        let penalty = 0;
        for (const [_, buffer] of ctx.result.state.buffers) {
          if (buffer === 0) {
            penalty += this.config.idlePenalty;
          }
        }
        return { ...ctx.result, reward: ctx.result.reward + penalty };
      },

      // Step cost
      (ctx) => ({
        ...ctx.result,
        reward: ctx.result.reward + this.config.stepPenalty,
      }),
    ];
  }

  private getMachines() {
    const machine = new KeyValueStore<
      Position,
      Extract<Cell, { kind: "machine" }>
    >();
    for (const [position, cell] of this.grid.entries()) {
      if (cell.kind === "machine") {
        machine.set(position, cell);
      }
    }
    return machine;
  }

  private getMachineCapacities() {
    const capacities = new KeyValueStore<Position, number>();
    for (const [position, cell] of this.grid.entries()) {
      if (cell.kind === "machine") {
        capacities.set(position, cell.bufferCapacity);
      }
    }
    return capacities;
  }

  private initializeMachineProgress() {
    const progress = new KeyValueStore<Position, number>();

    for (const [position, cell] of this.grid.entries()) {
      if (cell.kind === "machine") {
        progress.set(position, 0);
      }
    }

    return progress;
  }

  private bufferCombinations(capacities: KeyValueStore<Position, number>) {
    const keys = Array.from(capacities.keys());
    const current = new KeyValueStore(keys.map((k) => [k, 0]));
    const result: KeyValueStore<Position, number>[] = [];

    while (true) {
      result.push(new KeyValueStore(current.entries()));

      let i = keys.length - 1;

      while (i >= 0 && current.get(keys[i]) === capacities.get(keys[i])) {
        current.set(keys[i], 0);
        i--;
      }

      if (i < 0) break;

      current.set(keys[i], current.get(keys[i])! + 1);
    }

    return result;
  }

  private enumerateStates() {
    const positions = this.walkablePositions();
    const hasItems = [0, 1] as const;
    const bufferCombinations = this.bufferCombinations(
      this.getMachineCapacities(),
    );
    return hasItems.flatMap((hasItem) =>
      positions.flatMap((position) =>
        bufferCombinations.map((buffers) => ({ position, hasItem, buffers })),
      ),
    );
  }
}

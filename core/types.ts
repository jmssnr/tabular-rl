import { KeyValueStore } from "@/core/utils/key-value-store";

export type Action = [number, number];

export type Position = [number, number];

export type Cell =
  | { kind: "empty" }
  | { kind: "obstacle" }
  | { kind: "terminal" }
  | { kind: "pickup" }
  | { kind: "machine"; rate: number; bufferCapacity: number };

export type CellKind = Cell["kind"];

export type Grid = KeyValueStore<Position, Cell>;

export type StateReward<State> = {
  state: State;
  reward: number;
  stop?: true;
};

export type TransitionContext<S, C> = {
  result: StateReward<S>;
  action: Action;
  cell: C;
};

export type Transition<S, C> = (ctx: TransitionContext<S, C>) => StateReward<S>;

export type CellBasedTransitions<S> = {
  [K in CellKind]?: Transition<S, Extract<Cell, { kind: K }>>;
};

export type GlobalTransitions<S> = Array<Transition<S, Cell>>;

export type QTable<State> = KeyValueStore<State, KeyValueStore<Action, number>>;

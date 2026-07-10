import { KeyValueStore } from "@/core/utils/key-value-store";

export type Action = [number, number];

export type Position = [number, number];

export type Cell =
  | { kind: "empty" }
  | { kind: "obstacle" }
  | { kind: "terminal" };

export type CellKind = Cell["kind"];

export type Grid = KeyValueStore<Position, Cell>;

export type StateReward<State> = {
  state: State;
  reward: number;
  stop?: true;
};

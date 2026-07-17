export type Position = [number, number];
export type Action = [number, number];
export type Cell =
  | { kind: "empty" }
  | { kind: "terminal" }
  | { kind: "pickup" }
  | { kind: "obstacle" };

export type GridState = { position: Position };

export type StateReward<S> = {
  state: S;
  reward: number;
  stop?: true;
};

export type TransitionContext<S, C extends Cell = Cell> = {
  result: StateReward<S>;
  cell: C;
  action: Action;
};

export type Transition<S, C extends Cell = Cell> = (
  ctx: TransitionContext<S, C>,
) => StateReward<S>;

export type CellTransitions<S> = {
  [Kind in Cell["kind"]]?: Transition<S, Extract<Cell, { kind: Kind }>>;
};

export type GlobalTransitions<S> = Array<Transition<S, Cell>>;

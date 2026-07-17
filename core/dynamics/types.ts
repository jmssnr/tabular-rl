export type Position = [number, number];
export type Action = [number, number];
export type Cell =
  | { kind: "empty" }
  | { kind: "terminal" }
  | { kind: "pickup" }
  | { kind: "obstacle" };

export type CellKind = Cell["kind"];

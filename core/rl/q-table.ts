import { range } from "d3-array";

export class QTable<State> {
  entries: Map<string, number[]>;
  numActions: number;

  constructor(numActions: number) {
    this.numActions = numActions;
    this.entries = new Map();
  }

  private encode(state: State): string {
    return JSON.stringify(state);
  }

  getRow(state: State): number[] | undefined {
    return this.entries.get(this.encode(state));
  }

  getOrCreate(state: State): number[] {
    const key = this.encode(state);
    let row = this.entries.get(key);
    if (!row) {
      row = range(this.numActions).map(() => 0.0);
      this.entries.set(key, row);
    }
    return row;
  }

  get(state: State, action: number): number {
    return this.getRow(state)?.[action] ?? 0;
  }

  set(state: State, action: number, value: number) {
    const row = this.getOrCreate(state);
    row[action] = value;
  }

  argmax(state: State): number {
    const row = this.getRow(state);
    if (!row) return 0;

    let choice = 0;
    let best = row[choice];

    for (let action = 1; action < row.length; action++) {
      if (row[action] > best) {
        best = row[action];
        choice = action;
      }
    }
    return choice;
  }

  max(state: State): number {
    const action = this.argmax(state);
    return this.get(state, action);
  }
}

export class Model<State> {
  entries: Map<string, { reward: number; statePrime: State }>;
  keys: Array<string>;

  constructor() {
    this.entries = new Map();
    this.keys = [];
  }

  private encode(state: State, action: number) {
    return `${JSON.stringify(state)}|${action}`;
  }

  private decode(key: string): { state: State; action: number } {
    const separator = key.lastIndexOf("|");
    return {
      state: JSON.parse(key.slice(0, separator)) as State,
      action: Number(key.slice(separator + 1)),
    };
  }

  record(state: State, action: number, reward: number, statePrime: State) {
    const key = this.encode(state, action);
    if (!this.entries.has(key)) this.keys.push(key);
    this.entries.set(key, { reward, statePrime });
  }

  sample() {
    if (this.keys.length === 0) return undefined;
    const key = this.keys[Math.floor(Math.random() * this.keys.length)];
    const entry = this.entries.get(key)!;
    const { state, action } = this.decode(key);
    return {
      state,
      action,
      reward: entry.reward,
      statePrime: entry.statePrime,
    };
  }
}

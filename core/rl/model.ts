import { encodeState, encodeStateAction } from "@/core/rl/encoding";

export class Model<State> {
  entries: Map<string, { reward: number; statePrime: State }>;
  keys: Array<string>;
  predecessors: Map<string, Set<string>>;

  constructor() {
    this.entries = new Map();
    this.keys = [];
    this.predecessors = new Map();
  }

  private decode(key: string): { state: State; action: number } {
    const separator = key.lastIndexOf("|");
    return {
      state: JSON.parse(key.slice(0, separator)) as State,
      action: Number(key.slice(separator + 1)),
    };
  }

  record(state: State, action: number, reward: number, statePrime: State) {
    const key = encodeStateAction(state, action);
    if (!this.entries.has(key)) this.keys.push(key);
    this.entries.set(key, { reward, statePrime });

    const statePrimeKey = encodeState(statePrime);
    let predecessors = this.predecessors.get(statePrimeKey);
    if (!predecessors) {
      predecessors = new Set();
      this.predecessors.set(statePrimeKey, predecessors);
    }
    predecessors.add(key);
  }

  get(state: State, action: number) {
    return this.entries.get(encodeStateAction(state, action));
  }

  predecessorsOf(state: State) {
    const set = this.predecessors.get(encodeState(state));
    if (!set) return [];
    return [...set].map((key) => {
      const { state, action } = this.decode(key);
      return { state, action, reward: this.entries.get(key)!.reward };
    });
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

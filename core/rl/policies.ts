import { Policy } from "@/core/rl/types";
import { QTable } from "@/core/types";

export function greedy<State>(Q: QTable<State>): Policy<State> {
  return (state) => Q.argmax(state);
}

export function epsilonGreedy<State>(
  Q: QTable<State>,
  epsilon: number,
): Policy<State> {
  return (state) => {
    if (Math.random() < epsilon) {
      return Math.floor(Math.random() * Q.numActions);
    }

    return Q.argmax(state);
  };
}

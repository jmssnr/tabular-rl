import { Action, Position, QTable } from "@/core/types";

export function epsilonGreedy<State extends { position: Position }>(
  epsilon: number,
  Q: QTable<State>,
  actions: Array<Action>,
) {
  return (state: State): Action => {
    if (Math.random() <= epsilon) {
      return actions[Math.floor(Math.random() * actions.length)];
    }

    const qs = Q.get(state)!;
    let best = -Infinity;
    const ties: Array<Action> = [];

    for (const action of actions) {
      const q = qs.get(action)!;
      if (q > best) {
        best = q;
        ties.length = 0;
        ties.push(action);
      } else if (q === best) {
        ties.push(action);
      }
    }
    return ties[Math.floor(Math.random() * ties.length)];
  };
}

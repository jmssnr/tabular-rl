import { Environment } from "@/core/dynamics/environment";
import { GridState } from "@/core/dynamics/types";
import { greedy } from "@/core/rl/policies";
import { QTable } from "@/core/rl/q-table";

export function* playing<State extends GridState>(
  environment: Environment<State>,
  Q: QTable<State>,
  initial: State,
) {
  const policy = greedy(Q);
  let state = initial;
  let trajectory: Array<State> = [state];

  while (true) {
    const action = policy(state);
    const {
      state: statePrime,
      reward,
      stop,
    } = environment.act(state, environment.actions[action]);

    state = statePrime;

    trajectory.push(state);

    yield { trajectory, state, reward };

    if (stop) {
      state = initial;
      trajectory = [state];
    }
  }
}

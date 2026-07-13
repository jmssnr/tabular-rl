import { GridWorld } from "@/core/environments/grid-world";
import { Position } from "@/core/types";
import { addDefaults } from "@/core/utils/add-defaults";
import { epsilonGreedy } from "@/core/utils/epsilon-greedy";
import { initializeQTable } from "@/core/utils/initialize-q-table";

const DEFAULT_OPTIONS = {
  gamma: 0.9,
  alpha: 0.1,
  epsilon: 0.1,
  maxNumberEpisodes: 200,
};

type Options = typeof DEFAULT_OPTIONS;
export type SarsaConfig = Partial<Options>;

export function* sarsa<State extends { position: Position }>(
  start: State,
  world: GridWorld<State>,
  config: SarsaConfig = {},
) {
  const options = addDefaults(config, DEFAULT_OPTIONS);
  const Q = initializeQTable(world.states, world.actions);
  const pickAction = epsilonGreedy(options.epsilon, Q, world.actions);

  for (let episode = 0; episode < options.maxNumberEpisodes; episode++) {
    let state = start;
    let action = pickAction(state);
    const trajectory = [start];

    while (true) {
      const { stop, state: statePrime, reward } = world.act(state, action);
      const actionPrime = pickAction(statePrime);

      const QSAP = Q.get(statePrime)!.get(actionPrime)!;
      const QSA = Q.get(state)!.get(action)!;

      const target = reward + options.gamma * QSAP;
      Q.get(state)!.set(action, QSA + options.alpha * (target - QSA));

      state = statePrime;
      action = actionPrime;
      trajectory.push(state);

      yield {
        episode,
        trajectory,
        state,
      };

      if (stop) {
        break;
      }
    }
  }
}

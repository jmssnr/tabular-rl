import { Environment } from "@/core/dynamics/environment";
import { GridState } from "@/core/dynamics/types";
import { addsDefault } from "@/core/dynamics/utils";
import { epsilonGreedy } from "@/core/rl/policies";
import { QTable } from "@/core/rl/q-table";
import { LearningConfig, ValueUpdate } from "@/core/rl/types";

const DEFAULTS: LearningConfig = {
  epsilon: 0.1,
  gamma: 0.95,
  alpha: 0.1,
  numEpisodes: 1000,
  maxStepsPerEpisode: Infinity,
  maxTrajectoryLength: Infinity,
};

export function* learning<State extends GridState>(
  environment: Environment<State>,
  initial: State,
  Q: QTable<State>,
  update: ValueUpdate<State>,
  config: Partial<LearningConfig> = {},
) {
  const options = addsDefault(config, DEFAULTS);
  const policy = epsilonGreedy<State>(Q, options.epsilon);

  for (let episode = 0; episode < options.numEpisodes; episode++) {
    let state = initial;
    let action = policy(state);
    const trajectory: Array<State> = [state];

    for (let step = 0; step < options.maxStepsPerEpisode; step++) {
      const {
        state: statePrime,
        reward,
        stop,
      } = environment.act(state, environment.actions[action]);

      const actionPrime = stop ? 0 : policy(statePrime);

      update({
        Q,
        state,
        action,
        reward,
        statePrime,
        actionPrime,
        stop: !!stop,
        alpha: options.alpha,
        gamma: options.gamma,
      });

      trajectory.push(statePrime);

      if (trajectory.length > options.maxTrajectoryLength) trajectory.shift();

      yield { trajectory, reward, state: statePrime };

      if (stop) break;
      state = statePrime;
      action = actionPrime;
    }
  }
}

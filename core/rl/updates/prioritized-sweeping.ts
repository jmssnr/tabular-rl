import { encodeStateAction } from "@/core/rl/encoding";
import { Model } from "@/core/rl/model";
import { QTable } from "@/core/rl/q-table";
import { PriorityQueue } from "@/core/rl/queue";
import { ValueUpdate } from "@/core/rl/types";
import { qLearning } from "@/core/rl/updates/q-learning";

export function prioritizedSweeping<State>({
  numPlanningSteps,
  theta,
}: {
  numPlanningSteps: number;
  theta: number;
}): ValueUpdate<State> {
  const model = new Model<State>();
  const queue = new PriorityQueue<State>();
  const qUpdate = qLearning<State>();

  const priority = (
    Q: QTable<State>,
    state: State,
    action: number,
    reward: number,
    statePrime: State,
    gamma: number,
    stop: boolean,
  ) => {
    const bootstrap = stop ? 0 : Q.max(statePrime);
    return Math.abs(reward + gamma * bootstrap - Q.get(state, action));
  };

  return (ctx) => {
    qUpdate(ctx);
    const { Q, state, action, reward, statePrime, stop, gamma, alpha } = ctx;

    model.record(state, action, reward, statePrime);

    const p = priority(Q, state, action, reward, statePrime, gamma, stop);

    if (p > theta) {
      queue.push(encodeStateAction(state, action), p, { state, action });
    }

    for (let i = 0; i < numPlanningSteps; i++) {
      const node = queue.pop();
      if (!node) break;

      const transition = model.get(node.state, node.action);

      if (!transition) continue;

      qUpdate({
        Q,
        state: node.state,
        action: node.action,
        reward: transition.reward,
        statePrime: transition.statePrime,
        actionPrime: 0,
        stop: false,
        gamma,
        alpha,
      });

      for (const predecessor of model.predecessorsOf(node.state)) {
        const pp = priority(
          Q,
          predecessor.state,
          predecessor.action,
          predecessor.reward,
          node.state,
          gamma,
          false,
        );

        if (pp > theta) {
          queue.push(
            encodeStateAction(predecessor.state, predecessor.action),
            pp,
            { state: predecessor.state, action: predecessor.action },
          );
        }
      }
    }
  };
}

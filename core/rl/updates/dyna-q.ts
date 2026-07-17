import { Model } from "@/core/rl/model";
import { ValueUpdate } from "@/core/rl/types";
import { qLearning } from "@/core/rl/updates/q-learning";

export function dynaQ<State>({
  numPlanningSteps,
}: {
  numPlanningSteps: number;
}): ValueUpdate<State> {
  const model = new Model<State>();
  const qUpdate = qLearning<State>();

  return (ctx) => {
    qUpdate(ctx);
    model.record(ctx.state, ctx.action, ctx.reward, ctx.statePrime);

    // add record to model

    for (let i = 0; i < numPlanningSteps; i++) {
      const sample = model.sample();
      if (!sample) break;
      // sample model

      qUpdate({
        Q: ctx.Q,
        state: sample.state,
        action: sample.action,
        reward: sample.reward,
        statePrime: sample.statePrime,
        actionPrime: 0,
        stop: false,
        gamma: ctx.gamma,
        alpha: ctx.alpha,
      });
    }
  };
}

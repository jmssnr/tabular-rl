import { ValueUpdate } from "@/core/rl/types";

export function sarsa<State>(): ValueUpdate<State> {
  return ({ Q, state, action, statePrime, actionPrime, ...ctx }) => {
    const bootstrap = ctx.stop ? 0 : Q.get(statePrime, actionPrime);
    const target = ctx.reward + ctx.gamma * bootstrap;
    const current = Q.get(state, action);
    Q.set(state, action, current + ctx.alpha * (target - current));
  };
}

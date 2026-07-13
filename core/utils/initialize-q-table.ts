import { Action, QTable } from "@/core/types";
import { KeyValueStore } from "@/core/utils/key-value-store";

export function initializeQTable<State>(
  states: Array<State>,
  actions: Array<Action>,
): QTable<State> {
  return new KeyValueStore(
    states.map((state) => [
      state,
      new KeyValueStore(actions.map((action) => [action, 0.0])),
    ]),
  );
}

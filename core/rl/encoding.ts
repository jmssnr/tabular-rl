export function encodeState<State>(state: State): string {
  return JSON.stringify(state);
}

export function encodeStateAction<State>(state: State, action: number): string {
  return `${encodeState(state)}|${action}`;
}

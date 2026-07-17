export class PriorityQueue<State> {
  private items = new Map<
    string,
    { priority: number; item: { state: State; action: number } }
  >();

  getsize(): number {
    return this.items.size;
  }

  isEmpty(): boolean {
    return this.items.size === 0;
  }

  push(key: string, priority: number, item: { state: State; action: number }) {
    const existing = this.items.get(key);
    if (existing && existing.priority >= priority) return;
    this.items.set(key, { priority, item });
  }

  pop(): { state: State; action: number } | undefined {
    let bestKey: string | undefined;
    let bestPriority = -Infinity;

    for (const [key, entry] of this.items) {
      if (entry.priority > bestPriority) {
        bestPriority = entry.priority;
        bestKey = key;
      }
    }
    if (bestKey === undefined) return undefined;
    const { item } = this.items.get(bestKey)!;
    this.items.delete(bestKey);
    return item;
  }
}

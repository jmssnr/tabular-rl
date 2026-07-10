export class KeyValueStore<K, V> extends Map<K, V> {
  private map = new Map<string, K>();

  constructor(entries?: Iterable<readonly [K, V]>) {
    super();

    if (entries != undefined) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  private lookup_key(key: K) {
    const internalKey = JSON.stringify(key);
    const existing = this.map.get(internalKey);
    return existing !== undefined ? existing : key;
  }

  private lookup_set_key(key: K) {
    const internalKey = JSON.stringify(key);
    const existing = this.map.get(internalKey);
    if (existing !== undefined) {
      return existing;
    }
    this.map.set(internalKey, key);
    return key;
  }

  get(key: K) {
    return super.get(this.lookup_key(key));
  }

  set(key: K, value: V) {
    return super.set(this.lookup_set_key(key), value);
  }

  has(key: K) {
    return super.has(this.lookup_key(key));
  }

  delete(key: K) {
    return super.delete(this.lookup_key(key));
  }
}

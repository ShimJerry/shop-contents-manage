export type Setter<T> = (updateFn: (data: T) => T) => void;
export type Getter<T> = () => T;

export class BaseService<T> {
  private subscribers: ((data: T) => void)[] = [];
  private readonly getter: Getter<T>;
  private readonly setter: Setter<T>;

  constructor(getter: Getter<T>, setter: Setter<T>) {
    this.getter = getter;
    this.setter = setter;
  }

  private notifySubscribers(updatedData: T) {
    this.subscribers.forEach((listener) => listener(updatedData));
  }

  subscribe(listener: (data: T) => void) {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter((l) => l !== listener);
    };
  }

  protected updateState(updateFn: (data: T) => T) {
    this.setter((prev) => {
      const next = updateFn(prev);
      this.notifySubscribers(next);
      return next;
    });
  }

  protected getData(): T {
    return this.getter();
  }
}

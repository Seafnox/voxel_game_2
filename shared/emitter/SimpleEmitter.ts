export interface Listener<TEventData> {
  (event: TEventData): unknown;
}

export interface Disposable {
  dispose(): unknown;
}

/** passes through events as they happen. You will not get events from before you start listening */
export class SimpleEmitter<TEventData = any> {
  private listeners: Listener<TEventData>[] = [];
  private oneTimeListeners: Listener<TEventData>[] = [];

  on(listener: Listener<TEventData>): Disposable {
    this.listeners.push(listener);
    return {
      dispose: () => this.off(listener),
    };
  }

  once(listener: Listener<TEventData>): void {
    this.oneTimeListeners.push(listener);
  }

  off(listener: Listener<TEventData>) {
    const callbackIndex = this.listeners.indexOf(listener);
    if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
  }

  emit(event: TEventData) {
    /** Update any general listeners */
    this.listeners.forEach((listener) => listener(event));

    /** Clear the `once` queue */
    if (this.oneTimeListeners.length > 0) {
      const toCall = this.oneTimeListeners;
      this.oneTimeListeners = [];
      toCall.forEach((listener) => listener(event));
    }
  }
}

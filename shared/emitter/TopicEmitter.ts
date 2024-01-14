import { SimpleEmitter, Listener, Disposable } from './SimpleEmitter';

export class TopicEmitter<TEventType extends string | number | symbol = string> {
  private topics: Partial<Record<TEventType, SimpleEmitter>> = {

  };

  getTopic<TEventData>(topicName: TEventType): SimpleEmitter<TEventData> {
    if (!this.topics[topicName]) {
      this.topics[topicName] = new SimpleEmitter<TEventData>();
    }

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.topics[topicName]!;
  }

  public emit<TEventData>(topicName: TEventType, event: TEventData): void {
    this.getTopic<TEventData>(topicName).emit(event);
  }

  public off<TEventData>(topicName: TEventType, listener: Listener<TEventData>): void {
    this.getTopic<TEventData>(topicName).off(listener);
  }

  public on<TEventData>(topicName: TEventType, listener: Listener<TEventData>): Disposable {
    return this.getTopic<TEventData>(topicName).on(listener);
  }

  public once<TEventData>(topicName: TEventType, listener: Listener<TEventData>): void {
    this.getTopic<TEventData>(topicName).once(listener);
  }
}

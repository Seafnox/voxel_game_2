import { AbstractConnectionService } from '@block/server/connection/AbstractConnectionService';
import { ClientConnectionEventType } from '@block/server/connection/ClientConnectionEventType';
import { TopicEmitter } from '@block/shared/emitter/TopicEmitter';

export abstract class AbstractConnectionClient extends TopicEmitter<ClientConnectionEventType> {
  constructor(
    protected connectionService: AbstractConnectionService,
  ) {
    super();
  }

  abstract isClosed(): boolean;

  send(buffer: ArrayBuffer, callback: (error: Error) => void) {

  }
}

import { ConnectionEventType } from '@block/server/connection/ConnectionEventType';
import { TopicEmitter } from '@block/shared/emitter/TopicEmitter';

export class AbstractConnectionService extends TopicEmitter<ConnectionEventType> {
}

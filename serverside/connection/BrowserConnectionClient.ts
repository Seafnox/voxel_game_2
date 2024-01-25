import { AbstractConnectionClient } from '@block/server/connection/AbstractConnectionClient';

export class BrowserConnectionClient extends AbstractConnectionClient {
  isClosed(): boolean {
    return false;
  }

}

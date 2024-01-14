import { AbstractConnectionClient } from '@block/server/connection/AbstractConnectionClient';
import { AbstractConnectionService } from '@block/server/connection/AbstractConnectionService';
import { ClientConnectionEventType } from '@block/server/connection/ClientConnectionEventType';
import { WebSocket, RawData } from 'ws';

export class WebSocketConnectionClient extends AbstractConnectionClient {
  constructor(
    connectionService: AbstractConnectionService,
    private webSocketClient: WebSocket
  ) {
    super(connectionService);


    this.webSocketClient.on('message', this.onMessage.bind(this));
    this.webSocketClient.on('close', this.onPlayerWsClose.bind(this));
  }

  private onMessage(message: RawData) {
    this.emit(ClientConnectionEventType.Message, this.toArrayBuffer(message));
  }

  private onPlayerWsClose() {
    this.emit(ClientConnectionEventType.Closed, undefined);
  }

  private toArrayBuffer(buffer: RawData): ArrayBuffer {
    if (buffer instanceof ArrayBuffer) {
      return buffer;
    }

    if (Array.isArray(buffer)) {
      return buffer
        .map(bufferItem => this.getArrayBuffer(bufferItem))
        .reduce((buffer1, buffer2) => this.appendArrayBuffers(buffer1, buffer2), new ArrayBuffer(0));
    }

    if (buffer instanceof Buffer) {
      return this.getArrayBuffer(buffer);
    }

    throw new Error(`Unknown buffer type: ${typeof buffer}`);
  }

  private appendArrayBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  };

  private getArrayBuffer(buf: Buffer): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(buf.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return arrayBuffer;
  }

  isClosed(): boolean {
    return this.webSocketClient.readyState == WebSocket.CLOSED;
  }
}

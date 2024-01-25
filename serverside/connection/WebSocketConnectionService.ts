import { ConnectionEventType } from '@block/server/connection/ConnectionEventType';
import { WebSocketServer, WebSocket } from 'ws';
import { AbstractConnectionService } from './AbstractConnectionService';
import { WebSocketConnectionClient } from './WebSocketConnectionClient';

const enum WebSocketEventType {
  Connection = 'connection',
  Listening = 'listening',
  Error = 'error',
  Close = 'close',
}

export class WebSocketConnectionService extends AbstractConnectionService {
  private webSocket = new WebSocketServer({
    host: '0.0.0.0',
    port: 8081,
    perMessageDeflate: true,
  });

  constructor() {
    super();
    this.webSocket.on(WebSocketEventType.Connection, this.onConnect.bind(this));
    this.webSocket.on(WebSocketEventType.Listening, this.onReady.bind(this));
    this.webSocket.on(WebSocketEventType.Error, this.onError.bind(this));
    this.webSocket.on(WebSocketEventType.Close, this.onClose.bind(this));
  }


  private onConnect(ws: WebSocket) {
    console.log('WebSocketServer onConnect:', ws.constructor.name);
    const client = new WebSocketConnectionClient(this, ws);
    this.emit(ConnectionEventType.NewPlayer, client)
  }

  private onReady() {
    console.log('WebSocketServer ready at:', this.webSocket.address());
  }

  private onError(error: Error) {
    console.log('WebSocketServer error:');
    console.warn(error);
  }

  private onClose() {
    console.log('WebSocketServer close at:', this.webSocket.address());
  }
}

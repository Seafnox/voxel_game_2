import { AbstractConnectionClient } from '@block/server/connection/AbstractConnectionClient';
import { ClientConnectionEventType } from '@block/server/connection/ClientConnectionEventType';
import { ServerComponentMap } from '@block/server/entityManager/serverEntityMessage';
import { ComponentEventEmitter } from '@block/shared/ComponentEventEmitter';
import { AbstractComponent, AbstractComponentData } from '@block/shared/components/abstractComponent';
import { ComponentId, componentNames } from '@block/shared/constants/ComponentId';
import { MessageType } from '@block/shared/constants/MessageType';
import { terrainChunkSize } from '@block/shared/constants/interaction.constants';
import { EntityMessage } from '@block/shared/EntityMessage';

export interface NetworkComponentData extends AbstractComponentData {
  websocket: AbstractConnectionClient;
  bufferPos: number;
  buffer: ArrayBuffer;
}

export class NetworkComponent extends AbstractComponent<NetworkComponentData> {
  static ID = ComponentId.Network;

  private eventEmitter?: ComponentEventEmitter<ServerComponentMap>;
  private connectionClient?: AbstractConnectionClient;
  bufferPos: number = 0;
  buffer: ArrayBuffer = new ArrayBuffer(Math.pow(terrainChunkSize, 3) * 100); // volume * (count + 1)

  lastMessageTime = 0;

  addEventEmitter(eventEmitter: ComponentEventEmitter<ServerComponentMap>) {
    this.eventEmitter = eventEmitter;
  }

  addConnectionClient(connectionClient: AbstractConnectionClient, playerEntity: string) {
    this.connectionClient = connectionClient;


    this.connectionClient.on(ClientConnectionEventType.Message, this.onMessage.bind(this, playerEntity));
    this.connectionClient.on(ClientConnectionEventType.Closed, this.onPlayerWsClose.bind(this, playerEntity));
  }

  bytesLeft(): number {
    return this.buffer.byteLength - this.bufferPos;
  }

  isClosed(): boolean {
    return this.connectionClient?.isClosed() ?? true;
  }

  flush() {
    // Nothing in buffer to send
    if (this.bufferPos === 0) return;
    if (!this.connectionClient) return;
    if (this.isClosed()) return;

    const currentTime = Date.now();

    if (currentTime - this.lastMessageTime <= 10) return;

    const buffer = this.buffer.slice(0, this.bufferPos);
    console.log('--> Socket send', new Date().toISOString(), buffer.byteLength, 'bytes');
    this.connectionClient.send(buffer, error => error && console.log('Socket falure', error.message));
    this.bufferPos = 0;
    this.lastMessageTime = currentTime;
  }

  pushEntity(data: string) {
    this.pushBuffer(MessageType.Entity, this.encodeString(data));
  }

  pushTerrainChunk(data: ArrayBuffer) {
    this.pushBuffer(MessageType.Terrain, data);
  }

  pushAction(data: ArrayBuffer) {
    this.pushBuffer(MessageType.Action, data);
  }

  private pushBuffer(msgType: MessageType, bufferData: ArrayBuffer) {
    if (this.bufferPos + bufferData.byteLength + 2 * Uint16Array.BYTES_PER_ELEMENT > this.buffer.byteLength) {
      console.error('Buffer is too small!');
      return;
    }

    const view = new DataView(this.buffer);

    // Insert length
    view.setUint16(this.bufferPos, bufferData.byteLength);
    this.bufferPos += Uint16Array.BYTES_PER_ELEMENT;

    // Message type
    view.setUint16(this.bufferPos, msgType);
    this.bufferPos += Uint16Array.BYTES_PER_ELEMENT;

    // Copy data
    let bufferArray = new Uint8Array(bufferData);
    for (let i = 0; i < bufferData.byteLength; i++) {
      view.setUint8(this.bufferPos++, bufferArray[i]);
    }
  }

  private encodeString(data: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(data).buffer;
  }

  private onMessage(playerEntity: string, buffer: ArrayBuffer): void {
    console.log('<-- Socket receive', new Date().toISOString(), playerEntity, buffer.byteLength, 'byte');
    let pos = 0;
    let view = new DataView(buffer);
    let textDecoder = new TextDecoder();

    // Each message starts with its length, followed by that many bytes of content.
    // Length is always Uint16.
    while (pos < buffer.byteLength) {
      // Read length.
      let msgLength = view.getUint16(pos);
      pos += Uint16Array.BYTES_PER_ELEMENT;

      // Get message contents and decode JSON
      let msg = new Uint8Array(buffer.slice(pos, pos + msgLength));
      pos += msgLength;
      let text = textDecoder.decode(msg);
      let entityMessage: EntityMessage<ServerComponentMap> = JSON.parse(text);
      console.log('\tMessage', text);
      const usedComponentNames = componentNames.filter((name, id) => id in entityMessage.componentMap);
      console.log('\tComponents', usedComponentNames);

      // No one should be able to send data on behalf of others.
      // Really "obj" doesn't need an "entity" property, but might need it in the future.
      // Also, keeps interface between server and client in line.
      if (entityMessage.entity != playerEntity) continue;

      if (!this.eventEmitter) {
        throw new Error('No event emitter');
      }

      // Loop over all components received in packet, and emit events for them.
      // These events are used by the initializers to be processed further.
      for (let componentId in entityMessage.componentMap) {
        this.eventEmitter.emit(parseInt(componentId) as ComponentId, playerEntity, entityMessage.componentMap);
      }
    }
  }

  private onPlayerWsClose(playerEntity: string) {
    console.log('NWC Socket closed', playerEntity);
  }
}

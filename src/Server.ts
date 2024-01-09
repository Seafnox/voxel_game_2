import { ComponentEventEmitter } from '@block/shared/ComponentEventEmitter';
import { AbstractComponent } from '@block/shared/components/AbstractComponent';
import { ComponentId, componentNames } from '@block/shared/constants/ComponentId';
import { MessageType } from '@block/shared/constants/MessageType';
import { EntityMessage, ComponentMap } from '@block/shared/EntityMessage';
import { deserializeTerrainChunk } from '@block/shared/helpers/deserializeTerrainChunk';
import { ApplicationContext } from './ApplicationContext';
import { bufferToObject } from './utils/bufferToObject';

export class Server {
  url: string;
  ws: WebSocket;
  eventEmitter: ComponentEventEmitter<ComponentMap> = new ComponentEventEmitter();

  constructor(
    private context: ApplicationContext,
    server: string,
    connCallback: (this: WebSocket, ev: Event) => any
  ) {
    this.url = `ws://${server}`;

    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = connCallback;
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  close() {
    this.ws.close();
  }

  private onClose(evt: Event) {
    console.log('Socket close', evt);
  }

  private onMessage(evt: MessageEvent) {
    console.log('Socket receive', new Date().toISOString());
    if (!(evt.data instanceof ArrayBuffer)) {
      console.error('Not array buffer!', evt.data);
    }

    let buf = evt.data;
    let bufView = new DataView(buf);
    let bufPos = 0;

    while (bufPos < buf.byteLength) {
      let msgLength = bufView.getUint16(bufPos);
      bufPos += Uint16Array.BYTES_PER_ELEMENT;

      let msgType = bufView.getUint16(bufPos);
      bufPos += Uint16Array.BYTES_PER_ELEMENT;

      let msgData = buf.slice(bufPos, bufPos + msgLength);
      bufPos += msgLength;

      switch (msgType) {
        case MessageType.Entity:
          const entityMessage = bufferToObject(msgData) as EntityMessage;
          const usedComponentNames = componentNames.filter((name, id) => id in entityMessage.componentMap);
          console.log('\tEntity', msgLength, entityMessage.entity, entityMessage.componentMap);
          console.log('\tComponents', usedComponentNames);

          Object.keys(entityMessage.componentMap).forEach(componentId => {
            let key = parseInt(componentId);
            this.eventEmitter.emit(key as ComponentId, entityMessage.entity, entityMessage.componentMap);
          });
          break;

        case MessageType.Terrain:
          const [entity, component] = deserializeTerrainChunk(msgData);
          const {x, y, z} = component;
          console.log('\tTerrain', msgLength, entity, {x, y, z});
          console.log('\tComponents', ComponentId[ComponentId.TerrainChunk]);

          let componentsObj: Partial<Record<ComponentId, AbstractComponent<any>>> = {};
          componentsObj[ComponentId.TerrainChunk] = component;
          this.eventEmitter.emit(ComponentId.TerrainChunk, entity, componentsObj);
          break;

        case MessageType.Action:
          let actionId = new DataView(msgData).getUint16(0);
          let data = msgData.slice(Uint16Array.BYTES_PER_ELEMENT);
          const actionData = bufferToObject(data);
          console.log('\tAction', msgLength, actionId, actionData);

          // Queue action directly. No "event" to be emitted.
          this.context.world.actionManager.queueRawAction(actionId, actionData);
          break;

        default:
          console.warn('Unknown message type: ', msgType, msgData.byteLength);
      }
    }
  }

  private onError(evt: Event) {
    console.log('Socket error', evt);
  }
}

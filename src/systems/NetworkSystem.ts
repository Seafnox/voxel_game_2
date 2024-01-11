import { terrainChunkSize } from '@block/shared/constants/interaction.constants';
import { EntityManager } from '@block/shared/EntityManager';
import { System } from '@block/shared/System';
import { Server } from '../Server';

export class NetworkSystem extends System {
  bufferPos: number = 0;
  buffer: ArrayBuffer = new ArrayBuffer(Math.pow(terrainChunkSize, 3) * 100);

  constructor(
    em: EntityManager,
    private server: Server
  ) {
    super(em);
  }

  update(dt: number): void {
    if (this.bufferPos === 0) return; // Nothing queued for this tick.

    const buffer = this.buffer.slice(0, this.bufferPos);
    // Send data and reset buffer.
    console.log('--> Socket send', new Date().toISOString(), buffer.byteLength, 'bytes');
    this.server.send(buffer);
    this.bufferPos = 0;
  }

  pushBuffer(data: ArrayBuffer | string) {
    let bufferData: ArrayBuffer;
    if (typeof data === 'string') {
      let encoder = new TextEncoder();
      bufferData = encoder.encode(data).buffer;
    } else {
      bufferData = data;
    }

    let view = new DataView(this.buffer);

    // Insert length
    view.setUint16(this.bufferPos, bufferData.byteLength);
    this.bufferPos += Uint16Array.BYTES_PER_ELEMENT;

    // Copy data
    let bufferArray = new Uint8Array(bufferData);
    for (let i = 0; i < bufferData.byteLength; i++) {
      view.setUint8(this.bufferPos++, bufferArray[i]);
    }
  }
}

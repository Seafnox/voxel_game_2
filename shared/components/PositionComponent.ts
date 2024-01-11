import { TransferPosition } from '../constants/TransferPosition';
import { ComponentId } from '../constants/ComponentId';
import { globalToChunkPosition } from '../helpers/globalToChunkPosition';
import { Position } from '../Position';
import { SerializableComponent, SerializableComponentData } from './SerializableComponent';

export interface PositionComponentData extends SerializableComponentData, Position {}

export class PositionComponent extends SerializableComponent<PositionComponentData> implements PositionComponentData {
  static ID = ComponentId.Position;

  x: number = 0;
  y: number = 0;
  z: number = 0;

  toChunk(): TransferPosition {
    return [globalToChunkPosition(this.x), globalToChunkPosition(this.y), globalToChunkPosition(this.z)];
  }
}

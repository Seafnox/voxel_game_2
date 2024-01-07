import { TransferPosition } from 'shared/constants/TransferPosition';
import { ComponentId } from '../constants/ComponentId';
import { globalToChunkPosition } from 'shared/helpers/globalToChunkPosition';
import { Position } from '../Position';
import { SerializableComponent, SerializableComponentData } from 'shared/components/SerializableComponent';

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

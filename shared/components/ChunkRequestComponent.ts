import { ComponentId } from '../constants/ComponentId';
import { SerializableComponent, SerializableComponentData } from './SerializableComponent';

export interface ChunkRequestComponentData extends SerializableComponentData {
  chunks: string[];
}

export class ChunkRequestComponent extends SerializableComponent<ChunkRequestComponentData> implements ChunkRequestComponentData {
  static ID = ComponentId.ChunkRequest;

  chunks: string[] = [];
}

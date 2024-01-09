import { SerializableComponent, SerializableComponentData } from './SerializableComponent';
import { BlockId } from '../constants/BlockId';
import { ComponentId } from '../constants/ComponentId';

export interface BlockComponentData extends SerializableComponentData {
  kind: BlockId;
  count: number;
}

// Extended on client and server (client adds mesh). Therefore, not registered as shared component.
export class BlockComponent extends SerializableComponent<BlockComponentData> implements BlockComponentData {
  static ID = ComponentId.Block;

  kind = BlockId.Air;
  count = 1;
}

import { AbstractComponentData } from 'shared/components/AbstractComponent';
import { BlockComponentData } from 'shared/components/BlockComponent';
import { ChatMessageComponentData } from 'shared/components/ChatMessageComponent';
import { ChunkRequestComponentData } from 'shared/components/ChunkRequestComponent';
import { InputComponentData } from 'shared/components/InputComponent';
import { InventoryComponentData } from 'shared/components/InventoryComponent';
import { OnGroundComponentData } from 'shared/components/OnGroundComponent';
import { PhysicsComponentData } from 'shared/components/PhysicsComponent';
import { PlayerComponentData } from 'shared/components/PlayerComponent';
import { PositionComponentData } from 'shared/components/PositionComponent';
import { RotationComponentData } from 'shared/components/RotationComponent';
import { SerializableComponentData } from 'shared/components/SerializableComponent';
import { TerrainChunkComponentData } from 'shared/components/TerrainChunkComponent';
import { WallCollisionComponentData } from 'shared/components/WallCollisionComponent';
import { ComponentId } from './constants/ComponentId';

export interface EntityMessage<T extends Partial<ComponentMap> = Partial<ComponentMap>> {
  entity: string;
  componentMap: T;
}

export interface ComponentMap extends Record<ComponentId, AbstractComponentData> {
  [ComponentId.None]: AbstractComponentData;
  [ComponentId.Position]: PositionComponentData;
  [ComponentId.Rotation]: RotationComponentData;
  [ComponentId.Physics]: PhysicsComponentData;
  [ComponentId.OnGround]: OnGroundComponentData;
  [ComponentId.WallCollision]: WallCollisionComponentData;
  [ComponentId.Input]: InputComponentData;
  [ComponentId.CurrentPlayer]: SerializableComponentData;
  [ComponentId.TerrainChunk]: TerrainChunkComponentData;
  [ComponentId.Inventory]: InventoryComponentData;
  [ComponentId.Block]: BlockComponentData;
  [ComponentId.ChatMessage]: ChatMessageComponentData;
  [ComponentId.ChunkRequest]: ChunkRequestComponentData;
  [ComponentId.Player]: PlayerComponentData;
}

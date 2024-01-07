import { EntityManager } from '../EntityManager';
import { BlockComponent } from 'shared/components/BlockComponent';
import { ChatMessageComponent } from 'shared/components/ChatMessageComponent';
import { ChunkRequestComponent } from 'shared/components/ChunkRequestComponent';
import { CurrentPlayerComponent } from 'shared/components/CurrentPlayerComponent';
import { InputComponent } from 'shared/components/InputComponent';
import { InventoryComponent } from 'shared/components/InventoryComponent';
import { OnGroundComponent } from 'shared/components/OnGroundComponent';
import { PhysicsComponent } from 'shared/components/PhysicsComponent';
import { PlayerComponent } from 'shared/components/PlayerComponent';
import { PositionComponent } from 'shared/components/PositionComponent';
import { RotationComponent } from 'shared/components/RotationComponent';
import { TerrainChunkComponent } from 'shared/components/TerrainChunkComponent';
import { WallCollisionComponent } from 'shared/components/WallCollisionComponent';

export function registerSharedComponents(manager: EntityManager) {
  manager.registerComponentType(new PositionComponent());
  manager.registerComponentType(new RotationComponent());
  manager.registerComponentType(new PhysicsComponent());
  manager.registerComponentType(new OnGroundComponent());
  manager.registerComponentType(new InputComponent());
  manager.registerComponentType(new CurrentPlayerComponent());
  manager.registerComponentType(new WallCollisionComponent());
  manager.registerComponentType(new TerrainChunkComponent());
  manager.registerComponentType(new InventoryComponent());
  manager.registerComponentType(new BlockComponent());
  manager.registerComponentType(new ChatMessageComponent());
  manager.registerComponentType(new ChunkRequestComponent());
  manager.registerComponentType(new PlayerComponent());
}

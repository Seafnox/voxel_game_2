import { EntityManager } from '../EntityManager';
import { BlockComponent } from '../components/BlockComponent';
import { ChatMessageComponent } from '../components/ChatMessageComponent';
import { ChunkRequestComponent } from '../components/ChunkRequestComponent';
import { CurrentPlayerComponent } from '../components/CurrentPlayerComponent';
import { InputComponent } from '../components/InputComponent';
import { InventoryComponent } from '../components/InventoryComponent';
import { OnGroundComponent } from '../components/OnGroundComponent';
import { PhysicsComponent } from '../components/PhysicsComponent';
import { PlayerComponent } from '../components/PlayerComponent';
import { PositionComponent } from '../components/PositionComponent';
import { RotationComponent } from '../components/RotationComponent';
import { TerrainChunkComponent } from '../components/TerrainChunkComponent';
import { WallCollisionComponent } from '../components/WallCollisionComponent';

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

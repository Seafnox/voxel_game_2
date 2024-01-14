import { BlockComponent } from '@block/shared/components/blockComponent';
import { ChunkRequestComponent } from '@block/shared/components/chunkRequestComponent';
import { CurrentPlayerComponent } from '@block/shared/components/currentPlayerComponent';
import { InputComponent } from '@block/shared/components/inputComponent';
import { InventoryComponent } from '@block/shared/components/inventoryComponent';
import { PhysicsComponent } from '@block/shared/components/physicsComponent';
import { PlayerComponent } from '@block/shared/components/playerComponent';
import { PositionComponent } from '@block/shared/components/positionComponent';
import { RotationComponent } from '@block/shared/components/rotationComponent';
import { WallCollisionComponent } from '@block/shared/components/wallCollisionComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { Initializer } from '@block/shared/Initializer';
import { NetworkComponent } from '../components/NetworkComponent';
import { NewPlayerComponent } from '../components/NewPlayerComponent';
import { ServerComponentMap } from '../entityManager/serverEntityMessage';

export class PlayerInitializer extends Initializer<ServerComponentMap> {
  initialize(entity: string, componentMap: ServerComponentMap): void {
    // Only process further if name is set. We don't want players without names.
    let playerComponentData = componentMap[ComponentId.Player];
    if (!playerComponentData['name']) return;

    // Initialize the rest of the player (until now, there's been just a PlayerComponent waiting for a name to be set).
    console.log('Initializing new player with name ' + playerComponentData['name']);

    let em = this.entityManager;

    // Update name.
    let playerComponent = em.getComponent<PlayerComponent>(entity, ComponentId.Player);
    playerComponent.name = playerComponentData['name'];

    // Add new components
    let pos = new PositionComponent();
    pos.y = 24;
    pos.x = 8;
    pos.z = 8;
    em.addComponent(entity, pos); // Position tracking

    em.addComponent(entity, new PhysicsComponent());
    em.addComponent(entity, new RotationComponent());

    let netComponent = em.getComponent<NetworkComponent>(entity, ComponentId.Network);
    let inventory = new InventoryComponent();
    // This should be done elsewhere:
    for (let i = 0; i < 10; i++) {
      let blockEntity = em.createEntity('block');
      let block = new BlockComponent();
      block.kind = i + 1;
      block.count = 99;

      em.addComponent(blockEntity, block);
      let pos = new PositionComponent();
      pos.y = 0;
      pos.x = 0;
      pos.z = 0;
      em.addComponent(blockEntity, pos);

      inventory.slots[i] = block.kind;
      netComponent.pushEntity(em.serializeEntity(blockEntity));
    }
    em.addComponent(entity, inventory);

    em.addComponent(entity, new CurrentPlayerComponent()); // Treat as current player. A temporary way to signalize that this is the player to control.
    em.addComponent(entity, new WallCollisionComponent());
    em.addComponent(entity, new ChunkRequestComponent());
    em.addComponent(entity, new InputComponent()); // Keyboard input

    netComponent.pushEntity(em.serializeEntity(entity));

    // Deleted as soon as all players have been informed of this new player.
    // Not serializable, and not sent to client, so add it after the rest of the player entity has been serialized,
    // and pushed to netComponent.
    em.addComponent(entity, new NewPlayerComponent());
  }
}

import { BlockComponent } from '@block/shared/components/blockComponent';
import { InputComponent } from '@block/shared/components/inputComponent';
import { InventoryComponent } from '@block/shared/components/inventoryComponent';
import { OnGroundComponent } from '@block/shared/components/onGroundComponent';
import { PhysicsComponent } from '@block/shared/components/physicsComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { System } from '@block/shared/System';
import { AssetManager } from '../three/AssetManager';
import { Sound } from '../Sound';

export class SoundSystem extends System {
  walkSound: Sound;
  digSound: Sound;
  pickupSound: Sound;

  constructor(em: EntityManager, am: AssetManager) {
    super(em);

    this.walkSound = am.getSound('walk');
    this.digSound = am.getSound('dig');
    this.pickupSound = am.getSound('pickup');
  }

  update(dt: number): void {
    this.entityManager.getEntities(ComponentId.Player).forEach((component, entity) => {
      let physComponent = this.entityManager.getComponent<PhysicsComponent>(entity, ComponentId.Physics);
      if (!physComponent) return;

      // Walk
      let groundComponent = this.entityManager.getComponent<OnGroundComponent>(entity, ComponentId.OnGround);
      if (groundComponent && physComponent.isMovingHorizontally()) {
        this.walkSound.play();
      }

      // Dig
      let inputComponent = this.entityManager.getComponent<InputComponent>(entity, ComponentId.Input);
      if (inputComponent.primaryAction) {
        this.digSound.play();
      }
      /*
       else {
       this.digSound.stop(); // TODO: Enable if digging animation / delay is added
       }
       */
    });

    // Get current player and check their inventory, play "pick up" sound if changed..
    let [playerEntity, _] = this.entityManager.getFirstEntity(ComponentId.CurrentPlayer) || [];
    if (!playerEntity) return; // Player is in init state, not fully joined yet.

    let inventoryComponent = this.entityManager.getComponent<InventoryComponent>(playerEntity, ComponentId.Inventory);
    inventoryComponent.slots.forEach((blockEntity) => {
      let block = this.entityManager.getComponent<BlockComponent>(blockEntity.toString(), ComponentId.Block);
      if (block && block.isDirty()) this.pickupSound.play();
    });
  }
}

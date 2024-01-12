import { PickUpEntityAction } from '@block/shared/actions/PickUpEntityAction';
import { BlockComponent } from '@block/shared/components/blockComponent';
import { InventoryComponent } from '@block/shared/components/inventoryComponent';
import { PositionComponent } from '@block/shared/components/positionComponent';
import { ActionId } from '@block/shared/constants/ActionId';
import { BlockTypes, BlockId } from '@block/shared/constants/BlockId';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { System } from '@block/shared/System';
import { broadcastAction } from '../helpers/broadcastAction';

export class PickUpSystem extends System {
  update(dt: number) {
    let pickableEntities: Map<string, PositionComponent> = new Map<string, PositionComponent>();
    this.entityManager.getEntities(ComponentId.Pickable).forEach((component, entity) => {
      let posComponent = this.entityManager.getComponent<PositionComponent>(entity, ComponentId.Position);
      if (!posComponent) return;

      pickableEntities.set(entity, posComponent);
    });

    this.entityManager.getEntities(ComponentId.Player).forEach((component, entity) => {
      let posComponent = this.entityManager.getComponent<PositionComponent>(entity, ComponentId.Position);
      if (!posComponent) return;

      pickableEntities.forEach((blockPosComponent, pickableEntity) => {
        let diffX = Math.pow(posComponent.x - blockPosComponent.x, 2);
        let diffY = Math.pow((posComponent.y + 1.5) - blockPosComponent.y, 2);
        let diffZ = Math.pow(posComponent.z - blockPosComponent.z, 2);

        if (diffX + diffY + diffZ < 2) {
          let inventoryComponent = this.entityManager.getComponent<InventoryComponent>(entity, ComponentId.Inventory);

          // Check if player already has block of this type in inventory.
          // If so, increase count on block, and remove it.
          let block = this.entityManager.getComponent<BlockComponent>(pickableEntity, ComponentId.Block);
          let intoSlot = -1;
          inventoryComponent.slots.forEach((invEntity, invSlot) => {
            if (intoSlot !== -1) return;
            let existingBlock = this.entityManager.getComponent<BlockComponent>(invEntity.toString(), ComponentId.Block);
            if (existingBlock && existingBlock.kind === block.kind) {
              existingBlock.count++;
              intoSlot = invSlot;
              this.entityManager.removeEntity(pickableEntity);
            }
          });

          const blockType = BlockTypes.includes(+pickableEntity) ? +pickableEntity as BlockId : undefined;

          if (blockType === undefined) {
            console.error(`Could not find block type for entity ${pickableEntity}`);
            return;
          }

          // Otherwise, insert to inventory in next available slot.
          if (intoSlot === -1) intoSlot = inventoryComponent.setEntity(blockType);
          if (intoSlot !== -1) {
            pickableEntities.delete(pickableEntity);
            this.entityManager.removeComponentType(pickableEntity, ComponentId.Pickable);
            broadcastAction(
              this.entityManager, blockPosComponent.toChunk(),
              ActionId.PickUpEntity, new PickUpEntityAction(entity, intoSlot, blockType),
            );
          }
        }
      });
    });
  }
}

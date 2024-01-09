import { BlockId } from '../constants/BlockId';
import { ComponentId } from '../constants/ComponentId';
import { EntityManager } from '../EntityManager';
import { SerializableComponent, SerializableComponentData } from './SerializableComponent';

export interface InventoryComponentData extends SerializableComponentData {
  slots: BlockId[];
  activeSlot: number;
}

export class InventoryComponent extends SerializableComponent<InventoryComponentData> implements InventoryComponentData {
  static ID = ComponentId.Inventory;

  slots: BlockId[] = Array(10).fill(BlockId.Air);
  activeSlot: number = 0;

  setEntity(entity: BlockId, position?: number): number {
    // No position specified, so find first available.
    if (!position) position = this.slots.indexOf(BlockId.Air);
    if (position === -1) return -1; // inventory is full.

    this.slots[position] = entity;
    this.dirtyFields.add('slots'); // Force dirty because we're mutating an array.
    return position;
  }

  getEntity(slot: number): BlockId {
    return this.slots[slot];
  }

  dispose(entityManager: EntityManager): void {
    // When inventory is deleted, remove all its contents to avoid unused junk.
    // This will probably change when players' data is saved between play sessions.
    for (let i = 0; i < this.slots.length; i++) {
      let entity = this.slots[i].toString();
      if (entity !== null) {
        entityManager.removeEntity(entity);
      }
    }
  }
}

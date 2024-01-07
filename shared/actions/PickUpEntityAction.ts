import { EntityManager } from 'shared/EntityManager';
import { AbstractAction } from './AbstractAction';

export class PickUpEntityAction extends AbstractAction {
  constructor(
    public player: string, // entity
    public inventorySlot: number, // inventory slot to place entity in.
    public pickable: string // entity
  ) {
    super();
  }
  execute(entityManager: EntityManager) {}
}

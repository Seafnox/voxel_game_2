import { BlockId } from '../constants/BlockId';
import { EntityManager } from '../EntityManager';
import { AbstractAction } from './AbstractAction';

export class PickUpEntityAction extends AbstractAction {
  constructor(
    public player: string, // entity
    public inventorySlot: number, // inventory slot to place entity in.
    public pickable: BlockId // entity
  ) {
    super();
  }
  execute(entityManager: EntityManager) {}
}

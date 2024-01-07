import { EntityManager } from '../EntityManager';
import { AbstractAction } from './AbstractAction';

export class RemoveEntitiesAction extends AbstractAction {
  constructor(
    public entities: string[]
  ) {
    super();
  }

  execute(entityManager: EntityManager) {
    for (let entity of this.entities) {
      entityManager.removeEntity(entity);
    }
  }
}

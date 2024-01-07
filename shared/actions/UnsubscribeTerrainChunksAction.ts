import { EntityManager } from '../EntityManager';
import { AbstractAction } from './AbstractAction';

export class UnsubscribeTerrainChunksAction extends AbstractAction {
  constructor(
    public chunkKeys: string[]
  ) {
    super();
  }

  execute(entityManager: EntityManager) {
    for (let chunkKey of this.chunkKeys) {
      entityManager.removeEntity(chunkKey);
    }
  }
}

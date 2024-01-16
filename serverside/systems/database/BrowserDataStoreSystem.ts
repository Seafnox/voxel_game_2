import { AbstractDataStoreService } from '@block/server/systems/database/AbstractDataStoreService';
import { EntityManager } from '@block/shared/EntityManager';

export class BrowserDataStoreSystem extends AbstractDataStoreService {
  update(dt: number): void {
  }

  initDatabase(): void {
  }

  restore(entityManager: EntityManager, complete: Function): void {
  }

}

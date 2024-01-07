import { EntityManager } from './EntityManager';

// Base system which all other systems inherit from.
export class System {
  entityManager: EntityManager;

  constructor(em: EntityManager) {
    this.entityManager = em;
  }

  update(dt: number): void {
    this.entityManager.logger.warn('Please override update.');
  }
}

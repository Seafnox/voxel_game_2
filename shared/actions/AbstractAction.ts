import { EntityManager } from '../EntityManager';

export abstract class AbstractAction {
  serialize(): string {
    return JSON.stringify(this);
  }

  abstract execute(entityManager: EntityManager): void;
}

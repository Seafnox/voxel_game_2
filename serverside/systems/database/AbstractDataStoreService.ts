import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { EntityManagerEvent } from '@block/shared/EntityManagerEvent';

export abstract class AbstractDataStoreService {
  protected addedComponents: Array<[string, ComponentId]> = [];
  protected replacedComponents: Array<[string, ComponentId]> = [];
  protected removedComponents: Array<[string, ComponentId]> = [];

  constructor() {
    this.initDatabase();
  }

  abstract initDatabase(): void;

  abstract restore(entityManager: EntityManager, complete: Function): void;

  abstract update(dt: number, entityManager: EntityManager): void;

  // Event listeners on EntityManager
  registerEntityEvents(entityManager: EntityManager) {
    entityManager.addEventListener(EntityManagerEvent.ComponentAdded, this.onComponentAdded.bind(this));
    entityManager.addEventListener(EntityManagerEvent.ComponentReplaced, this.onComponentReplaced.bind(this));
    entityManager.addEventListener(EntityManagerEvent.ComponentRemoved, this.onComponentRemoved.bind(this));
  }


  private onComponentAdded(entity: string, componentId: ComponentId) {
    this.addedComponents.push([entity, componentId]);
  }

  private onComponentReplaced(entity: string, componentId: ComponentId) {
    this.replacedComponents.push([entity, componentId]);
  }

  private onComponentRemoved(entity: string, componentId: ComponentId) {
    this.removedComponents.push([entity, componentId]);
  }
}

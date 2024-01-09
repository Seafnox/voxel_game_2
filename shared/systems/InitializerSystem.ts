import { ComponentId } from '../constants/ComponentId';
import { System } from '../System';
import { Initializer } from '../Initializer';
import { EntityManager } from '../EntityManager';
import { EntityMessage, ComponentMap } from '../EntityMessage';
import { ComponentEventEmitter } from '../ComponentEventEmitter';

export class InitializerSystem<TComponentMap extends ComponentMap> extends System {
  private componentQueue = new Map<ComponentId, EntityMessage<Partial<TComponentMap>>[]>();
  private initializers = new Map<ComponentId, Initializer<TComponentMap>>();
  private eventEmitter: ComponentEventEmitter<TComponentMap>;

  constructor(em: EntityManager, eventEmitter: ComponentEventEmitter<TComponentMap>) {
    super(em);
    this.eventEmitter = eventEmitter;
  }

  update(dt: number) {
    this.componentQueue.forEach((messages: EntityMessage<Partial<TComponentMap>>[], componentType: ComponentId) => {
      let initializer = this.initializers.get(componentType);
      if (!initializer) {
        throw new Error(`Can't find Initializer for component type: ${componentType}`);
      }

      messages.forEach(entityMessage => {
        initializer!.initialize(entityMessage.entity, entityMessage.componentMap);
      });
    });

    this.componentQueue.clear();
  }

  addInitializer(componentId: ComponentId, initializer: Initializer<TComponentMap>) {
    this.initializers.set(componentId, initializer);

    this.eventEmitter.addEventListener(componentId, (entity: string, componentMap: Partial<TComponentMap>) => {
      let compQueue = this.componentQueue.get(componentId);
      if (!compQueue) {
        compQueue = [];
        this.componentQueue.set(componentId, compQueue);
      }

      compQueue.push({
        entity,
        componentMap,
      });
    });
  }
}

import { AbstractComponent, AbstractComponentData } from './components/AbstractComponent';
import { SerializableComponent } from './components/SerializableComponent';
import { entityManagerEventMap, EntityManagerEvent } from './EntityManagerEvent';
import { ComponentId, componentNames } from './constants/ComponentId';
import { EntityMessage, ComponentMap } from './EntityMessage';
import { Logger } from './Logger';
import { UtilsManager } from './UtilsManager';

let componentProxyHandler: ProxyHandler<AbstractComponent<any>> = {
  set: (obj: any, prop: keyof AbstractComponentData | 'dirtyFields', value: any) => {
    if (prop !== 'dirtyFields' && obj[prop] !== value) {
      (obj as AbstractComponent<AbstractComponentData>).dirtyFields.add(prop);
      obj[prop] = value;
    }
    return true;
  },
};

export class EntityManager {
  private components: Map<ComponentId, Map<string, AbstractComponent<any>>> =
    new Map<ComponentId, Map<string, AbstractComponent<any>>>();
  private componentConstructors: Map<ComponentId, Function> = new Map<ComponentId, Function>();
  private removedEntities: Set<string> = new Set<string>();
  private readonly utilsManager: UtilsManager;

  private eventHandlers: Function[][] = [];

  constructor(utilsManager: UtilsManager) {
    this.utilsManager = utilsManager;

    for (let i = 0; i < EntityManagerEvent.NumEvents; i++) {
      this.eventHandlers.push([]);
    }
  }

  get utils(): UtilsManager {
    return this.utilsManager;
  }

  get logger(): Logger {
    return this.utils.logger;
  }

  registerComponentType<T extends AbstractComponent<any>>(instance: T) {
    let type = instance.typeName();
    if (this.componentConstructors.has(type)) {
      this.logger.warn(`Component type "${type} already registered.`);
      return;
    }
    this.componentConstructors.set(type, instance.constructor);
    this.components.set(type, new Map<string, T>());
  }

  createEntity(pre: string = '') {
    let entity = `${pre}-${this.utils.uuid()}`;
    this.emit(EntityManagerEvent.EntityCreated, entity);
    return entity;
  }

  serializeEntity(entity: string, componentIds: ComponentId[] = []): string {
    // Each component needs to be serialized individually, then a JSON string is manually created.
    // Just using JSON.stringify would cause each component's serialized string to be escaped.

    if (!Array.isArray(componentIds) || componentIds.length === 0) componentIds = Array.from(this.componentConstructors.keys());

    const componentMap: Partial<ComponentMap> = {};
    componentIds.forEach(componentId => {
      let component = this.getEntities(componentId).get(entity);
      if (component instanceof SerializableComponent) {
        componentMap[componentId] = component.getJSON();
      } else if (component) {
        this.logger.warn(`Tried to serialize non-serializable component: "${component.typeName()}"`);
      }
    });

    const message: EntityMessage = {
      entity,
      componentMap,
    };

    return JSON.stringify(message);
  }

  // Only schedules for removal.
  // Entities (and their components) are fully removed once cleanComponents() is called.
  removeEntity(entity: string) {
    this.removedEntities.add(entity);
    this.emit(EntityManagerEvent.EntityRemoved, entity);
  }

  getEntities(componentType: ComponentId): Map<string, AbstractComponent<any>> {
    if (!this.components.has(componentType)) {
      this.logger.error(`Tried to GET non-registered component type: ${componentType}`)
    }
    return this.components.get(componentType)!;
  }

  getFirstEntity<T extends AbstractComponent<any>>(componentType: ComponentId): [string, T] | undefined {
    let ec = this.getEntities(componentType).entries().next();

    return !ec.done ? [ec.value[0], ec.value[1] as T] : undefined; // Double cast to make TS compiler understand.
  }

  hasComponent(entity: string, componentType: ComponentId): boolean {
    return this.getEntities(componentType).has(entity);
  }

  getComponent<T extends AbstractComponent<any>>(entity: string, componentType: ComponentId): T {
    return this.getEntities(componentType).get(entity) as T; // Have to double cast to force it to be T.
  }

  addComponent<T extends AbstractComponent<any>>(entity: string, component: T): typeof component {
    const event = this.getEntities(component.ID).has(entity)
      ? EntityManagerEvent.ComponentReplaced
      : EntityManagerEvent.ComponentAdded;

    this.getEntities(component.ID).set(entity, new Proxy(component, componentProxyHandler));

    this.emit(event, entity, component.ID);
    return component;
  }

  addComponentFromData<K extends AbstractComponentData, T extends AbstractComponent<any>>(entity: string, componentType: ComponentId, componentData: K): T | undefined {
    let componentConstructor = this.componentConstructors.get(componentType);
    if (!componentConstructor) {
      this.logger.error(`Tried to CREATE non-registered component type: ${componentType}`);
      return;
    }

    let component: T = new (componentConstructor as any)();
    component.update(componentData);

    return this.addComponent<T>(entity, component);
  }

  removeComponentType(entity: string, type: ComponentId) {
    let componentEntities = this.getEntities(type);
    let component = componentEntities.get(entity);
    if (component) {
      component.dispose(this); // Hook into component in case it needs to do some cleanup.
      componentEntities.delete(entity);
      this.emit(EntityManagerEvent.ComponentRemoved, entity, type);
    }
  }

  removeComponent(entity: string, component: AbstractComponent<any>) {
    this.removeComponentType(entity, component.typeName());
  }

  cleanComponents() {
    // Remove entities marked for removal.
    this.removedEntities.forEach(entity => {
      this.components.forEach((entities, type) => {
        if (entities.has(entity)) this.removeComponentType(entity, type);
      });
    });
    this.removedEntities.clear();

    // Reset dirty state for all components.
    this.components.forEach(entityComponent => {
      entityComponent.forEach((component) => {
        component.dirtyFields.clear();
      });
    });
  }

  // Event related
  addEventListener(eventType: EntityManagerEvent, callback: Function) {
    this.eventHandlers[eventType].push(callback);
  }

  private emit(eventType: EntityManagerEvent, entity: string, data?: ComponentId) {
    const handlers = this.eventHandlers[eventType];
    if (!!handlers.length) {
      this.utils.logger.log('EME', entityManagerEventMap[eventType], entity, data && componentNames[data], handlers.length);
    }
    handlers.forEach((callback) => callback(entity, data));
  }
}

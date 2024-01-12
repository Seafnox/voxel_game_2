import { ComponentId } from '@block/shared/constants/ComponentId';
import { ComponentMap } from '@block/shared/EntityMessage';
import { Initializer } from '@block/shared/Initializer';

export class InputInitializer extends Initializer<ComponentMap> {
  initialize(entity: string, components: ComponentMap) {
    Object.keys(components).forEach((componentTypeStr) => {
      let componentType = parseInt(componentTypeStr) as ComponentId;
      let componentData = components[componentType];
      this.entityManager.addComponentFromData(entity, componentType, componentData);
    });
  }
}

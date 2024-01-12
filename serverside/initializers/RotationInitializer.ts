import { RotationComponent } from '@block/shared/components/rotationComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { Initializer } from '@block/shared/Initializer';
import { ServerComponentMap } from '../entityManager/serverEntityMessage';

export class RotationInitializer extends Initializer<ServerComponentMap> {
  initialize(entity: string, componentMap: ServerComponentMap): void {
    let rot = componentMap[ComponentId.Rotation];
    let existingRot = this.entityManager.getComponent<RotationComponent>(entity, ComponentId.Rotation);
    existingRot.update(rot);
  }
}

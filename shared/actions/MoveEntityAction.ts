import { PositionComponent } from 'shared/components/PositionComponent';
import { TransferPosition } from 'shared/constants/TransferPosition';
import { ComponentId } from '../constants/ComponentId';
import { EntityManager } from '../EntityManager';
import { AbstractAction } from './AbstractAction';

export class MoveEntityAction extends AbstractAction {
  constructor(
    public entity: string,
    public position: TransferPosition
  ) {
    super();
  }

  execute(entityManager: EntityManager) {
    let posComponent = entityManager.getComponent<PositionComponent>(this.entity, ComponentId.Position);
    posComponent.x = this.position[0];
    posComponent.y = this.position[1];
    posComponent.z = this.position[2];
  }
}

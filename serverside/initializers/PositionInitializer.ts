import { MoveEntityAction } from '@block/shared/actions/MoveEntityAction';
import { PositionComponent } from '@block/shared/components/positionComponent';
import { ActionId } from '@block/shared/constants/ActionId';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { globalToChunkPosition } from '@block/shared/helpers/globalToChunkPosition';
import { Initializer } from '@block/shared/Initializer';
import { Position } from '@block/shared/Position';
import { ServerComponentMap } from '../entityManager/serverEntityMessage';
import { broadcastAction } from '../helpers/broadcastAction';
import { EntityManager } from '@block/shared/EntityManager';
import { ServerActionManager } from '../actions/ServerActionManager';

export class PositionInitializer extends Initializer<ServerComponentMap> {
  private actionManager: ServerActionManager;

  constructor(em: EntityManager, am: ServerActionManager) {
    super(em);
    this.actionManager = am;
  }

  initialize(entity: string, componentMap: ServerComponentMap): void {
    let position = componentMap[ComponentId.Position] as Position;
    let existingPosition = this.entityManager.getComponent<PositionComponent>(entity, ComponentId.Position);
    let expectedCoordinates: [number, number, number] = [existingPosition.x, existingPosition.y, existingPosition.z];
    let dist = Math.sqrt(Math.pow(position.x - existingPosition.x, 2) + Math.pow(position.y - existingPosition.y, 2) + Math.pow(position.z - existingPosition.z, 2));

    console.log('Position', entity, dist, position, existingPosition);
    if (dist < 2) {
      existingPosition.update(position);
    } else {
      console.log('Too big difference between client and server!', dist);
      let action = new MoveEntityAction(entity, expectedCoordinates);
      this.actionManager.queueAction(action); // Queue on server as well.

      // Broad cast so it's queued on clients.
      let [cx, cy, cz] = expectedCoordinates.map(globalToChunkPosition);
      broadcastAction(this.entityManager, [cx, cy, cz], ActionId.MoveEntity, action);
    }

  }
}

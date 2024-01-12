import { AbstractAction } from '@block/shared/actions/AbstractAction';
import { RemoveEntitiesAction } from '@block/shared/actions/RemoveEntitiesAction';
import { ActionId } from '@block/shared/constants/ActionId';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { NetworkComponent } from '../components/NetworkComponent';
import { VoxelGameServerSide } from '../VoxelGameServerSide';

export function broadcastAction(em: EntityManager, chunk: [number, number, number], actionId: ActionId, action: AbstractAction) {
  em.getEntities(ComponentId.Network).forEach((component, playerEntity) => {
    // If we are going to remove an entity, and this entity a networked entity (Player),
    // it means this player has disconnected, so no need to try sending on a closed socket.
    if (actionId === ActionId.RemoveEntities && (action as RemoveEntitiesAction).entities.indexOf(playerEntity) !== -1) return;

    let netComponent = component as NetworkComponent;
    VoxelGameServerSide.sendAction(netComponent, actionId, action);
  });
}

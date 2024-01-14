import { ComponentId } from '@block/shared/constants/ComponentId';
import { System } from '@block/shared/System';
import { NetworkComponent } from '../components/NetworkComponent';
import { VoxelGameServerSide } from '../VoxelGameServerSide';
import { EntityManager } from '@block/shared/EntityManager';

export class NetworkSystem extends System {
  server: VoxelGameServerSide;

  constructor(em: EntityManager, server: VoxelGameServerSide) {
    super(em);
    this.server = server;
  }

  update(dt: number): void {
    this.entityManager.getEntities(ComponentId.Network).forEach((component, entity) => {
      const netComponent = component as NetworkComponent;

      // Player has disconnected. Remove entity and do not attempt to send on socket.
      if (netComponent.isClosed()) {
        console.log('NWS Socket closed', entity);
        this.entityManager.removeEntity(entity);
        return;
      }

      netComponent.flush();
    });
  }
}

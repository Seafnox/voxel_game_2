import { AbstractConnectionClient } from '@block/server/connection/AbstractConnectionClient';
import { AbstractConnectionService } from '@block/server/connection/AbstractConnectionService';
import { ConnectionEventType } from '@block/server/connection/ConnectionEventType';
import { AbstractDataStoreService } from '@block/server/systems/database/AbstractDataStoreService';
import { AbstractAction } from '@block/shared/actions/AbstractAction';
import { PlayerComponent } from '@block/shared/components/playerComponent';
import { ActionId } from '@block/shared/constants/ActionId';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { NetworkComponent } from './components/NetworkComponent';
import { WorldServerSide } from './WorldServerSide';

export class VoxelGameServerSide {
  world: WorldServerSide;

  private accumulator = 0.0;
  private expectedDt = 1.0 / 30.0;

  constructor(
    private connectionService: AbstractConnectionService,
    private dataStoreService: AbstractDataStoreService,
  ) {
    this.world = new WorldServerSide();
    this.startGameTick();

    this.connectionService.on(ConnectionEventType.NewPlayer, this.addPlayer.bind(this));
    // Create DB system, restore world / entity manager, and then start listening for changes.
    this.dataStoreService.restore(this.world.entityManager, () => {
      console.log('Loaded entities from database.');
      this.dataStoreService.registerEntityEvents(this.world.entityManager);
    });

  }

  startGameTick(lastTime: number = performance.now()) {
    let newTime = performance.now();
    let frameTime = newTime - lastTime;

    this.accumulator += frameTime;

    while (this.accumulator >= this.expectedDt) {
      this.tick(this.expectedDt);
      this.accumulator -= this.expectedDt;
    }

    setTimeout(() => this.startGameTick(newTime), 1);
  }

  tick(dt: number) {
    this.world.tick(dt);
    this.dataStoreService.update(dt, this.world.entityManager);
  }

  static sendAction(netComponent: NetworkComponent, actionId: ActionId, action: AbstractAction) {
    const encoder = new TextEncoder();
    let actionString = action.serialize();
    let bytes = encoder.encode(actionString);

    // Give room for message type and action ID.
    const extraSpace = Uint16Array.BYTES_PER_ELEMENT;
    let packet = new ArrayBuffer(bytes.byteLength + extraSpace);
    let packetView = new DataView(packet);

    // Set header data
    packetView.setUint16(0, actionId);

    // Copy over message data.
    for (let i = 0; i < bytes.byteLength; i++) {
      packetView.setUint8(i + extraSpace, bytes[i]);
    }

    netComponent.pushAction(packet);
  }

  private addPlayer(connectionClient: AbstractConnectionClient) {
    console.log('Server addPlayer:', connectionClient.constructor.name);
    let playerEntity = this.world.entityManager.createEntity('player');

    let netComponent = new NetworkComponent();
    netComponent.addEventEmitter(this.world.eventEmitter);
    netComponent.addConnectionClient(connectionClient, playerEntity);
    this.world.entityManager.addComponent(playerEntity, netComponent);
    this.world.entityManager.addComponent(playerEntity, new PlayerComponent());
    netComponent.pushEntity(this.world.entityManager.serializeEntity(playerEntity, [ComponentId.Player]));
  }
}

import { AbstractConnectionClient } from '@block/server/connection/AbstractConnectionClient';
import { AbstractConnectionService } from '@block/server/connection/AbstractConnectionService';
import { ConnectionEventType } from '@block/server/connection/ConnectionEventType';
import { AbstractAction } from '@block/shared/actions/AbstractAction';
import { ComponentEventEmitter } from '@block/shared/ComponentEventEmitter';
import { PlayerComponent } from '@block/shared/components/playerComponent';
import { ActionId } from '@block/shared/constants/ActionId';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { NetworkComponent } from './components/NetworkComponent';
import { ServerComponentMap } from './entityManager/serverEntityMessage';
import { WorldServerSide } from './WorldServerSide';

export class VoxelGameServerSide {
  world: WorldServerSide;
  eventEmitter = new ComponentEventEmitter<ServerComponentMap>();

  private accumulator = 0.0;
  private expectedDt = 1.0 / 30.0;

  constructor(
    private connectionService: AbstractConnectionService,
  ) {
    this.world = new WorldServerSide(this);
    this.startGameTick();

    this.connectionService.on(ConnectionEventType.NewPlayer, this.addPlayer.bind(this));
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
    netComponent.addEventEmitter(this.eventEmitter);
    netComponent.addConnectionClient(connectionClient, playerEntity);
    this.world.entityManager.addComponent(playerEntity, netComponent);
    this.world.entityManager.addComponent(playerEntity, new PlayerComponent());
    netComponent.pushEntity(this.world.entityManager.serializeEntity(playerEntity, [ComponentId.Player]));
  }
}

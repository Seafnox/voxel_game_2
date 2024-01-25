import { WebSocketConnectionService } from '@block/server/connection/WebSocketConnectionService';
import { BrowserDataStoreSystem } from '@block/server/systems/database/BrowserDataStoreSystem';
import { VoxelGameServerSide } from "./VoxelGameServerSide";

new VoxelGameServerSide(
  new WebSocketConnectionService(),
  new BrowserDataStoreSystem(),
);

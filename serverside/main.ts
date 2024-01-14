import { WebSocketConnectionService } from '@block/server/connection/WebSocketConnectionService';
import { VoxelGameServerSide } from "./VoxelGameServerSide";

new VoxelGameServerSide(
  new WebSocketConnectionService(),
);

export const enum SystemOrder {
  ActionExecution = 1,
  Initializer,
  TerrainChunk,
  Block,
  InformNewPlayers,
  BroadcastPlayerInput,
  Chat,
  PlayerInput,
  Physics,
  TerrainCollision,
  Position,
  PlayerInputSync,
  Mesh,
  PlayerMesh,
  PlayerSelection,
  Chunk,
  ChunkRequest,
  PlayerAction,
  PickUp,
  BroadcastEntity,
  Sound,
  InventoryUI,
  DebugText,

  Network,
  // Do not put any systems after these.
  CleanComponents
}

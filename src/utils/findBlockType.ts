import { TerrainChunkComponent } from 'shared/components/TerrainChunkComponent';
import { ComponentId } from 'shared/constants/ComponentId';
import { terrainChunkSize } from 'shared/constants/interaction.constants';
import { EntityManager } from 'shared/EntityManager';
import { chunkKey } from 'shared/helpers/chunkKey';
import { globalToChunkPosition } from 'shared/helpers/globalToChunkPosition';
import { mod } from 'shared/helpers/mod';

export function findBlockType(em: EntityManager, x: number, y: number, z: number): number {
  let [cx, cy, cz] = [x, y, z].map(globalToChunkPosition);

  let key = chunkKey(cx, cy, cz);

  let chunkComponent = em.getComponent<TerrainChunkComponent>(key, ComponentId.TerrainChunk);
  if(!chunkComponent) return 0;

  let [lx, ly, lz] = [mod(x, terrainChunkSize), mod(y, terrainChunkSize), mod(z, terrainChunkSize)];
  return chunkComponent.getValue(lx, ly, lz);
}

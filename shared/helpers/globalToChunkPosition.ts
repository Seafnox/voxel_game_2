import { terrainChunkSize } from '../constants/interaction.constants';

export const globalToChunkPosition = (x: number) => {
  if (x < 0) return Math.ceil((x - terrainChunkSize + 1) / terrainChunkSize);
  else return Math.floor(x / terrainChunkSize);
};

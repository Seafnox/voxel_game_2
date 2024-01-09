import { AbstractComponent, AbstractComponentData } from '@block/shared/components/abstractComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { Position } from '@block/shared/Position';

// TODO edit any
export class PlayerChunkComponent extends AbstractComponent<Position & AbstractComponentData> {
    static ID = ComponentId.PlayerChunk;

    x: number = NaN;
    y: number = NaN;
    z: number = NaN;
}

import { ComponentId } from '@block/shared/constants/ComponentId';
import { ComponentMap } from '@block/shared/EntityMessage';
import { Initializer } from '@block/shared/Initializer';

export class TerrainChunkInitializer extends Initializer<ComponentMap> {
    initialize(entity: string, components: ComponentMap) {
        let component = components[ComponentId.TerrainChunk];
        let chunkComponent = this.entityManager.addComponentFromData(entity, ComponentId.TerrainChunk, component);
        chunkComponent?.dirtyFields.add('data');
    }
}

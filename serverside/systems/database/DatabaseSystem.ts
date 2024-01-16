import { AbstractDataStoreService } from '@block/server/systems/database/AbstractDataStoreService';
import { AbstractComponent } from '@block/shared/components/AbstractComponent';
import { SerializableComponent } from '@block/shared/components/SerializableComponent';
import { TerrainChunkComponent } from '@block/shared/components/TerrainChunkComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { deserializeTerrainChunk } from '@block/shared/helpers/deserializeTerrainChunk';
import { isString } from '@block/shared/helpers/isString';

export class DatabaseSystem extends AbstractDataStoreService {
  private db: Database = new Database('db.sqlite', this.onDbFailure.bind(this));
  private addedComponents: Array<[string, ComponentId]> = [];
  private replacedComponents: Array<[string, ComponentId]> = [];
  private removedComponents: Array<[string, ComponentId]> = [];

  onDbFailure(err: Error | null) {
    if (!err) return;
    console.warn('Db failure');
    console.error(err);
  }

  initDatabase() {
    this.db.run(`
        CREATE TABLE IF NOT EXISTS components (
            type INTEGER NOT NULL,
            entity STRING NOT NULL,
            data BLOB,
            PRIMARY KEY (type, entity)
        );`, this.onDbFailure.bind(this));
  }

  restore(entityManager: EntityManager, complete: Function) {
    this.db.each(`SELECT type, entity, data FROM components`, (err: Error | null, row: any) => {
      if (isString(row.data)) {
        entityManager.addComponentFromData(row.entity, row.type, JSON.parse(row.data));
      } else {
        // Chunk
        let [_, chunkComponent] = deserializeTerrainChunk(row.data.buffer);
        entityManager.addComponent(row.entity, chunkComponent);
      }

    }, complete);
  }

  update(dt: number, entityManager: EntityManager) {
    this.db.exec(`BEGIN`);
    let numInserts = 0;
    let numUpdates = 0;
    let numDeletes = 0;

    let insertedEntities = new Set<string>();
    this.addedComponents.forEach(arr => {
      let [entity, componentType] = arr;
      if (entityManager.getComponent(entity, ComponentId.Player)) {
        return;
      }
      let component = entityManager.getComponent<SerializableComponent>(entity, componentType);
      if (!component || !component.serialize) return;

      this.db.run(`INSERT INTO components (type, entity, data) VALUES (?, ?, ?)`, [componentType, entity, component.serialize()], this.onDbFailure.bind(this));
      insertedEntities.add(arr[0]);
      numInserts++;
    });
    this.addedComponents = [];

    this.replacedComponents.forEach(arr => {
      let [entity, componentType] = arr;
      let component = entityManager.getComponent<SerializableComponent>(entity, componentType);
      if (!component || !component.serialize) return;
      this.db.run(`UPDATE components SET data = ? WHERE type = ? AND entity = ?`, [component.serialize(), componentType, entity], this.onDbFailure.bind(this));
      numUpdates++;
    });
    this.replacedComponents = [];

    this.removedComponents.forEach(arr => {
      let [entity, componentType] = arr;
      this.db.run(`DELETE FROM components WHERE type = ? AND entity = ?`, [componentType, entity], this.onDbFailure.bind(this));
      numDeletes++;
    });
    this.removedComponents = [];

    // Save dirty chunks, but not if they were just inserted (included in insertedEntities).
    entityManager.getEntities(ComponentId.TerrainChunk).forEach((abstractComponent: AbstractComponent<any>, entity: string) => {
      const component = abstractComponent as TerrainChunkComponent;
      if (component.isDirty('data') && !insertedEntities.has(entity)) {
        this.db.run(`UPDATE components SET data = ? WHERE type = ? AND entity = ?`, [component.serialize(), ComponentId.TerrainChunk, entity], this.onDbFailure.bind(this));
        numUpdates++;
      }
    });

    if (numInserts || numUpdates || numDeletes) {
      console.log(`Inserts: ${numInserts} | Updates: ${numUpdates} | Deletes: ${numDeletes}`);
    }

    this.db.exec(`COMMIT`);
  }
}

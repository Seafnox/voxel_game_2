import { PositionComponent } from '@block/shared/components/positionComponent';
import { RotationComponent } from '@block/shared/components/rotationComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { Direction } from '@block/shared/constants/Direction';
import { EntityManager } from '@block/shared/EntityManager';
import { chunkKey } from '@block/shared/helpers/chunkKey';
import { globalToChunkPosition } from '@block/shared/helpers/globalToChunkPosition';
import { System } from '@block/shared/System';
import { Scene, Vector3, Raycaster, ShaderMaterial } from 'three';
import { MeshComponent } from '../components/MeshComponent';
import { PlayerSelectionComponent } from '../components/PlayerSelectionComponent';
import { findBlockType } from '../utils/findBlockType';

export class PlayerSelectionSystem extends System {
  scene: Scene;

  constructor(em: EntityManager, scene: Scene) {
    super(em);
    this.scene = scene;
  }

  update(dt: number) {
    // Directional vectors. These never change.
    let xRot = new Vector3(1, 0, 0);
    let yRot = new Vector3(0, 1, 0);

    this.entityManager.getEntities(ComponentId.PlayerSelection).forEach((component, entity) => {
      let positionComponent = this.entityManager.getComponent<PositionComponent>(entity, ComponentId.Position);
      let rotComponent = this.entityManager.getComponent<RotationComponent>(entity, ComponentId.Rotation);

      let selectionComponent = component as PlayerSelectionComponent;

      // Get player's eye position, which we use for ray caster / collision detection origin.
      let [x, y, z] = [positionComponent.x, positionComponent.y + 2.5, positionComponent.z];
      let pos = new Vector3(x, y, z);

      // Used for ray caster and chunk lookup.
      let rotVec = new Vector3(0, 0, -1).applyAxisAngle(xRot, rotComponent.x).applyAxisAngle(yRot, rotComponent.y);

      let chunkKeys = []; // use Array to retain order.
      for (let i = 0.01; i <= 5.01; i++) {
        let blockVec = rotVec.clone().setLength(i).add(pos);

        // Add both rounded, floored and ceiled version of target position so we avoid all edge cases
        // (when player is in one chunk, and digs in neighbor chunk)
        let block = blockVec.roundToZero();
        let key = chunkKey(globalToChunkPosition(block.x), globalToChunkPosition(block.y), globalToChunkPosition(block.z));
        if (chunkKeys.indexOf(key) === -1) chunkKeys.push(key);

        block = blockVec.floor();
        key = chunkKey(globalToChunkPosition(block.x), globalToChunkPosition(block.y), globalToChunkPosition(block.z));
        if (chunkKeys.indexOf(key) === -1) chunkKeys.push(key);

        block = blockVec.ceil();
        key = chunkKey(globalToChunkPosition(block.x), globalToChunkPosition(block.y), globalToChunkPosition(block.z));
        if (chunkKeys.indexOf(key) === -1) chunkKeys.push(key);
      }

      // Ray cast until we hit a block. First checks current chunk, then ones further away, if any.
      let ray = new Raycaster(pos, rotVec, 0.01, 5);
      let targetValid = false;
      for (let key of chunkKeys) {
        let meshComponent = this.entityManager.getComponent<MeshComponent>(key, ComponentId.Mesh);

        let hitSide: Direction;
        let hitPoint: Vector3 | undefined;
        if (meshComponent && meshComponent.mesh) {
          let hits = ray.intersectObject(meshComponent.mesh);
          if (hits.length) {
            let hit = hits[0];
            let point = hit.point;

            // Cube data is offset by half a unit vs raycaster hit point.
            // For negative values, subtract -0.5, for positive, add 0.5.
            let cubeOffset = new Vector3(
              Math.sign(point.x) / 2.0,
              Math.sign(point.y) / 2.0,
              Math.sign(point.z) / 2.0,
            );

            let normal = hit.face.normal;

            // Find which side of the cube the player has in focus.
            if (normal.x === 0 && normal.y === 1 && normal.z === 0) hitSide = Direction.Top;
            else if (normal.x === 0 && normal.y === 0 && normal.z === 1) hitSide = Direction.North;
            else if (normal.x === 1 && normal.y === 0 && normal.z === 0) hitSide = Direction.East;
            else if (normal.x === 0 && normal.y === 0 && normal.z === -1) hitSide = Direction.South;
            else if (normal.x === -1 && normal.y === 0 && normal.z === 0) hitSide = Direction.West;
            else if (normal.x === 0 && normal.y === -1 && normal.z === 0) hitSide = Direction.Bottom;

            // Also subtract half of normal value to reach center of cube. Top face has normal
            // of 1 pointing upwards, so subtracting half of that gets us precisely to the center of the
            // cube, making the selector work correctly.
            hitPoint = point.clone().add(cubeOffset).sub(
              normal.clone().divideScalar(2),
            ).roundToZero();
          }
        }

        // Did we hit the mesh during ray casting, and is there really a block there?
        if (hitPoint && findBlockType(this.entityManager, hitPoint.x, hitPoint.y, hitPoint.z) !== 0) {
          targetValid = true;
          selectionComponent.target = [hitPoint.x, hitPoint.y, hitPoint.z];
          selectionComponent.targetSide = hitSide!;

          if (!selectionComponent.mesh) break;

          // Lerp to new position.
          selectionComponent.mesh?.position.lerp(hitPoint, 0.75); // Lerp because it looks good. :-)

          // Update uniform so that selector deforms correctly to match terrain deformation.
          (selectionComponent.mesh?.material as ShaderMaterial).uniforms.globalPosition.value = hitPoint;

          break;
        }
      }

      // Hide if target is not valid.
      selectionComponent.targetValid = targetValid;
      if (!selectionComponent.mesh) return;

      selectionComponent.mesh.visible = targetValid;
      if (!selectionComponent.mesh.parent) this.scene.add(selectionComponent.mesh);
    });
  }
}

import { CurrentPlayerComponent } from '@block/shared/components/currentPlayerComponent';
import { PhysicsComponent } from '@block/shared/components/physicsComponent';
import { PositionComponent } from '@block/shared/components/positionComponent';
import { RotationComponent } from '@block/shared/components/rotationComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { System } from '@block/shared/System';
import { Scene } from 'three';
import { AnimatedMeshComponent } from '../components/MeshComponent';

export class PlayerMeshSystem extends System {
  scene: Scene;
  walkCounter: number = 0;

  constructor(em: EntityManager, scene: Scene) {
    super(em);
    this.scene = scene;
  }

  update(dt: number) {
    this.entityManager.getEntities(ComponentId.Player).forEach((component, entity) => {
      let animMeshComponent = this.entityManager.getComponent<AnimatedMeshComponent>(entity, ComponentId.AnimatedMesh);
      if (!animMeshComponent) return;

      let mesh = animMeshComponent.mesh;

      if (!mesh) {
        return;
      }

      if (!mesh.parent) {
        this.scene.add(mesh);
      }

      let position = this.entityManager.getComponent<PositionComponent>(entity, ComponentId.Position);
      mesh.position.x = position.x;
      mesh.position.y = position.y;
      mesh.position.z = position.z;

      let rot = this.entityManager.getComponent<RotationComponent>(entity, ComponentId.Rotation);
      mesh.rotation.y = rot.y;

      let physComponent = this.entityManager.getComponent<PhysicsComponent>(entity, ComponentId.Physics);
      if (this.entityManager.getComponent<CurrentPlayerComponent>(entity, ComponentId.CurrentPlayer)) {
        let camera = mesh.getObjectByName('camera');
        camera.rotation.x = rot.x;

        // Head / camera moving up and down when player is walking.
        if (physComponent.isMovingHorizontally()) {
          camera.position.y = 2.5 + Math.cos(this.walkCounter) / 7.5;
          this.walkCounter += dt * 12.5;
        } else {
          this.walkCounter = 0;
          camera.position.y = 2.5;
        }
      } else {
        // Animation is only relevant for other players, as current player has no mesh.
        if (Math.abs(physComponent.velX) > 0.01 || Math.abs(physComponent.velZ) > 0.01) {
          if (mesh.getCurrentAnimation() != 'walk') {
            mesh.playAnimation('walk');
          }
        } else {
          mesh.playAnimation('idle');
        }
        animMeshComponent.mesh?.mixer.update(dt);
      }

    });
  }
}

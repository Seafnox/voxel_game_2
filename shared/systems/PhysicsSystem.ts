import { InputComponent } from 'shared/components/InputComponent';
import { OnGroundComponent } from 'shared/components/OnGroundComponent';
import { PhysicsComponent } from 'shared/components/PhysicsComponent';
import { RotationComponent } from 'shared/components/RotationComponent';
import { WallCollisionComponent } from 'shared/components/WallCollisionComponent';
import { ComponentId } from '../constants/ComponentId';
import { TerminalVelocity, Gravity, PlayerJumpVelocity, PlayerSpeed } from '../constants/physics.constants';
import { System } from '../System';

export class PhysicsSystem extends System {
  update(dt: number): any {
    this.entityManager.getEntities(ComponentId.Physics).forEach((component, entity) => {
      // Update physics.
      let physComponent = component as PhysicsComponent;
      physComponent.velY -= Gravity * dt;
      if (physComponent.velY < -TerminalVelocity) physComponent.velY = -TerminalVelocity;

      // Maybe this should be in a "PlayerPhysicsSystem".
      if (this.entityManager.hasComponent(entity, ComponentId.Player)) {
        let input = this.entityManager.getComponent<InputComponent>(entity, ComponentId.Input);
        let rotation = this.entityManager.getComponent<RotationComponent>(entity, ComponentId.Rotation);

        let sinSpeed = Math.sin(rotation.y) * PlayerSpeed;
        let cosSpeed = Math.cos(rotation.y) * PlayerSpeed;

        physComponent.velX = 0;
        physComponent.velZ = 0;
        if (input.moveForward) {
          physComponent.velX -= sinSpeed;
          physComponent.velZ -= cosSpeed;
        }
        if (input.moveLeft) {
          physComponent.velX -= cosSpeed / 1.5;
          physComponent.velZ += sinSpeed / 1.5;
        }
        if (input.moveRight) {
          physComponent.velX += cosSpeed / 1.5;
          physComponent.velZ -= sinSpeed / 1.5;
        }
        if (input.moveBackward) {
          physComponent.velX += sinSpeed / 1.5;
          physComponent.velZ += cosSpeed / 1.5;
        }
        if (input.jump) {
          let onGround = this.entityManager.getComponent<OnGroundComponent>(entity, ComponentId.OnGround);
          if (onGround && onGround.canJump) {
            physComponent.velY = PlayerJumpVelocity;
            this.entityManager.removeComponentType(entity, ComponentId.OnGround);
          }
        }

        let blockCollision = this.entityManager.getComponent<WallCollisionComponent>(entity, ComponentId.WallCollision);
        if (blockCollision.px && physComponent.velX > 0) physComponent.velX = 0;
        if (blockCollision.nx && physComponent.velX < 0) physComponent.velX = 0;
        if (blockCollision.pz && physComponent.velZ > 0) physComponent.velZ = 0;
        if (blockCollision.nz && physComponent.velZ < 0) physComponent.velZ = 0;
      }
    });
  }
}

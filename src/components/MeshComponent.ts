import { AbstractComponent } from '@block/shared/components/AbstractComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { AnimatedMesh } from '../AnimatedMesh';
import { SkinnedMesh } from 'three';

// TODO edit any
export class MeshComponent extends AbstractComponent<any> {
  static ID = ComponentId.Mesh;

  mesh?: SkinnedMesh;

  dispose(entityManager: EntityManager): void {
    if (this.mesh && this.mesh.parent) {
      this.mesh.geometry.dispose();
      this.mesh.parent.remove(this.mesh);
    }
  }
}

export class AnimatedMeshComponent extends MeshComponent {
  static ID = ComponentId.AnimatedMesh;

  mesh?: AnimatedMesh;
}

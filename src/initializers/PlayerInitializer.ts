import { PlayerComponent } from '@block/shared/components/playerComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { ComponentMap } from '@block/shared/EntityMessage';
import { Initializer } from '@block/shared/Initializer';
import { AnimatedMesh } from 'AnimatedMesh';
import { AnimatedMeshComponent } from 'components/MeshComponent';
import { PlayerChunkComponent } from 'components/PlayerChunkComponent';
import { PlayerSelectionComponent } from 'components/PlayerSelectionComponent';
import {
  BoxBufferGeometry,
  ShaderMaterial,
  SkinnedMesh,
} from 'three';
import { NetworkSystem } from '../systems/NetworkSystem';
import { AssetManager } from '../three/AssetManager';

export class PlayerInitializer extends Initializer<ComponentMap> {
  constructor(
    em: EntityManager,
    private assetManager: AssetManager,
    private netSystem: NetworkSystem,
    private selectionMaterial: ShaderMaterial
  ) {
    super(em);
  }

  initialize(entity: string, components: ComponentMap) {
    // New player just joined. Set and send username.
    if (!components[ComponentId.Player]['name']) {
      let playerComponent = new PlayerComponent();
      const playerName = localStorage.getItem('playerName');

      if (!playerName) {
        throw new Error('No playerName in local storage');
      }

      playerComponent.name = playerName;
      this.entityManager.addComponent(entity, playerComponent);

      this.netSystem.pushBuffer(this.entityManager.serializeEntity(entity));
      return;
    }

    // Initialize joining player.
    Object.keys(components).forEach((componentTypeStr) => {
      let componentType = parseInt(componentTypeStr) as ComponentId;
      let componentData = components[componentType];
      this.entityManager.addComponentFromData(entity, componentType, componentData);
    });

    // Only current player needs a camera attached.
    if (ComponentId.CurrentPlayer in components) {
      throw new Error(`No current player component. Can't create current player mesh`);
    } else {
    }
    let mesh = this.assetManager.getMesh('player');
    let playerMesh = mesh.clone() as AnimatedMesh;

    let animMeshComponent = new AnimatedMeshComponent();
    animMeshComponent.mesh = playerMesh;
    this.entityManager.addComponent(entity, animMeshComponent);

    // Only show selection box for current player.
    if (ComponentId.CurrentPlayer in components) {
      console.log('Spawning current player');
      let selectionComponent = new PlayerSelectionComponent();

      // Need an underlying box for the Box helper to work.
      // Could also render this BoxGeometry in wireframe mode, but then we get diagonal lines,
      // as it renders triangles.
      let selectionGeom = new BoxBufferGeometry(1.0, 1.0, 1.0);

      // Update and add component.
      selectionComponent.mesh = new SkinnedMesh(selectionGeom, this.selectionMaterial);
      this.entityManager.addComponent(entity, selectionComponent);
    }

    this.entityManager.addComponent(entity, new PlayerChunkComponent());
  }
}

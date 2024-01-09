import { EntityManager } from '@block/shared/EntityManager';
import { ApplicationContext } from './ApplicationContext';
import {
  Scene,
  PerspectiveCamera,
  ShaderMaterial,
  VertexColors,
  Vector3,
} from 'three';
import { v4 } from 'uuid';
import { BaseWorld } from '@block/shared/BaseWorld';
import { PlayerChunkComponent } from './components/PlayerChunkComponent';
import { ClientActionManager } from './actions/actions';
import { UtilsManager } from '@block/shared/UtilsManager';
import { MeshComponent, AnimatedMeshComponent } from './components/MeshComponent';
import { PlayerSelectionComponent } from './components/PlayerSelectionComponent';
//import { ComponentId } from '@block/shared/constants/ComponentId';
//import { SystemOrder } from '@block/shared/constants/SystemOrder';
//import { ActionExecutionSystem } from '@block/shared/systems/ActionExecutionSystem';
//import { TerrainChunkSystem} from './systems/TerrainChunkSystem';
//import { PlayerInputSystem} from './systems/PlayerInputSystem';
//import { PlayerInputSyncSystem} from './systems/PlayerInputSyncSystem';
//import { MeshSystem } from './systems/MeshSystem';
//import { PlayerMeshSystem } from './systems/PlayerMeshSystem';
//import { PlayerSelectionSystem } from './systems/PlayerSelectionSystem';
//import { InventoryUISystem } from './systems/InventoryUISystem';
//import { BlockSystem } from './systems/BlockSystem';
//import { NetworkSystem } from './systems/NetworkSystem';
//import { ChatSystem } from './systems/ChatSystem';
//import { ChunkSystem } from './systems/ChunkSystem';
//import { SoundSystem } from './systems/SoundSystem';
//import { MouseManager } from './three/MouseManager';
//import { KeyboardManager } from './three/KeyboardManager';
//import { BlockInitializer} from './initializers/BlockInitializer';
//import { TerrainChunkInitializer} from './initializers/TerrainChunkInitializer';
//import { PlayerInitializer} from './initializers/PlayerInitializer';
//import { InputInitializer} from './initializers/InputInitializer';
//import { ChatMessageInitializer} from './initializers/ChatMessageInitializer';
//import { InitializerSystem } from '@block/shared/systems/InitializerSystem';
import terrainVertexShader from '../shaders/terrain_vert.glsl';
import terrainFragmentShader from '../shaders/terrain_frag.glsl';
import selectionVertexShader from '../shaders/selection_vert.glsl';
import selectionFragmentShader from '../shaders/selection_frag.glsl';
import blockVertexShader from '../shaders/block_vert.glsl';
import blockFragmentShader from '../shaders/block_frag.glsl';

export class World extends BaseWorld {
  scene: Scene;
  camera: PerspectiveCamera;
  terrainMaterial: ShaderMaterial;
  selectionMaterial: ShaderMaterial;
  blockMaterial: ShaderMaterial;
  actionManager = new ClientActionManager();

  constructor(
    private context: ApplicationContext,
    public guiNode: HTMLElement,
  ) {
    super(new UtilsManager(v4, () => performance.now(), console));

    this.registerComponents(this.entityManager);

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
    this.camera.name = 'camera'; // Used to look up camera from e.g. player's Object3D.

    console.log('add', {terrainVertexShader, terrainFragmentShader});
    this.terrainMaterial = new ShaderMaterial({
      uniforms: {
        texture: {
          value: this.context.assetManager.getTexture('terrain'),
        },
      },
      vertexShader: terrainVertexShader,
      fragmentShader: terrainFragmentShader,
      vertexColors: VertexColors,
    });

    console.log('add', {selectionVertexShader, selectionFragmentShader});
    this.selectionMaterial = new ShaderMaterial({
      uniforms: {
        globalPosition: {
          type: 'v3v',
          value: new Vector3(0, 0, 0),
        },
      },
      vertexShader: selectionVertexShader,
      fragmentShader: selectionFragmentShader,
    });

    console.log('add', {blockVertexShader, blockFragmentShader});
    this.blockMaterial = new ShaderMaterial({
      uniforms: {
        texture: {
          value: this.context.assetManager.getTexture('terrain'),
        },
      },
      vertexShader: blockVertexShader,
      fragmentShader: blockFragmentShader,
      vertexColors: VertexColors,
    });

//    // FIXME add Systems and components
//    this.addSystems(this.guiNode);
  }

//  addSystems(guiNode: HTMLElement) {
//    // FIXME add Systems and components
//    // FIXME NetworkManager should be injected into Server
//    let netSystem = new NetworkSystem(this.entityManager, this.context.server);
//    // TODO: Store system orders as constants in one place.
//    this.addSystem(new ActionExecutionSystem(this.entityManager, this.actionManager), SystemOrder.ActionExecution); // Always process first
//
//    let initializerSystem = new InitializerSystem(this.entityManager, this.context.server.eventEmitter);
//    initializerSystem.addInitializer(ComponentId.TerrainChunk, new TerrainChunkInitializer(this.entityManager));
//    initializerSystem.addInitializer(
//      ComponentId.Player,
//      new PlayerInitializer(
//        this.entityManager,
//        this.context.assetManager,
//        netSystem,
//        this.camera,
//        this.selectionMaterial,
//      ),
//    );
//    initializerSystem.addInitializer(ComponentId.Block, new BlockInitializer(this.entityManager, this.blockMaterial));
//    let inputInitializer = new InputInitializer(this.entityManager);
//    initializerSystem.addInitializer(ComponentId.Input, inputInitializer);
//    initializerSystem.addInitializer(ComponentId.Rotation, inputInitializer);
//    initializerSystem.addInitializer(ComponentId.ChatMessage, new ChatMessageInitializer(this.entityManager));
//    this.addSystem(initializerSystem, SystemOrder.Initializer);
//
//    this.addSystem(new TerrainChunkSystem(this.entityManager, this.scene, this.terrainMaterial), SystemOrder.TerrainChunk);
//    this.addSystem(new BlockSystem(this.entityManager), SystemOrder.Block);
//
//    let keyboardManager = new KeyboardManager(this.context.renderer.domElement);
//    let mouseManager = new MouseManager(this.context.renderer.domElement);
//    this.addSystem(new ChatSystem(this.entityManager, guiNode, keyboardManager, netSystem), SystemOrder.Chat);
//    this.addSystem(new PlayerInputSystem(this.entityManager, mouseManager, keyboardManager), SystemOrder.PlayerInput);
//
//    this.addSystem(new PlayerInputSyncSystem(this.entityManager, netSystem), SystemOrder.PlayerInputSync);
//    this.addSystem(new MeshSystem(this.entityManager, this.scene), SystemOrder.Mesh);
//    this.addSystem(new PlayerMeshSystem(this.entityManager, this.scene), SystemOrder.PlayerMesh);
//    this.addSystem(new PlayerSelectionSystem(this.entityManager, this.scene), SystemOrder.PlayerSelection);
//    this.addSystem(new ChunkSystem(this.entityManager, netSystem), SystemOrder.Chunk);
//
//    this.addSystem(new SoundSystem(this.entityManager, this.context.assetManager), SystemOrder.Sound);
//    this.addSystem(new InventoryUISystem(this.entityManager, guiNode), SystemOrder.InventoryUI);
//    // this.addSystem(new DebugTextSystem(this.entityManager, this.context.renderer), SystemOrder.DebugText);
//    this.addSystem(netSystem, SystemOrder.Network);
//  }

  // FIXME make overrided method
  protected registerComponents(entityManager: EntityManager) {
    entityManager.registerComponentType(new MeshComponent());
    entityManager.registerComponentType(new AnimatedMeshComponent());
    entityManager.registerComponentType(new PlayerSelectionComponent());
    entityManager.registerComponentType(new PlayerChunkComponent());
  }
}

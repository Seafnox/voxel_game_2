import { HTMLParser } from '../HTMLParser';
import { Page } from './Page';
import { playHtml } from './html/PlayHtml';
import { SettingsPage } from './SettingsPage';
import { MenuPage } from './MenuPage';

export class PlayPage extends Page {
  // TODO create GuiManager with controlling through state. remove Nodes from state
  private guiNode: HTMLElement;
  private stats: Stats;

  // world: World;
  // server: Server;

  private isRunning: boolean = false;

  constructor() {
    super();

    let parser = new HTMLParser();
    this.guiNode = parser.parse(playHtml);

    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.guiNode.querySelector('.btn-leave')?.addEventListener('click', () => {
      this.transitionTo(new MenuPage());
    });
    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.guiNode.querySelector('.btn-settings')?.addEventListener('click', () => {
      this.transitionTo(new SettingsPage());
    });

    // Debug performance. TODO: Should go in DebugTextSystem.
    this.stats = new Stats();
    this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.guiNode.appendChild(this.stats.dom);
  }

  get renderer() {
    if (!this.context) throw new Error(`Can't find context to get Renderer`);
    return this.context.renderer;
  }

  // TODO create server intialization manager with subscribe
  onEnter() {
    this.context?.startServer(this.guiNode!);
    this.registerCanvasEvents();
  }

  onExit() {
    // Remove DOM elements.
    document.body.removeChild(this.guiNode);
    document.body.removeChild(this.renderer.domElement);

    // TODO create server intialization manager with subscribe
    // Disconnect and clean up.
    // this.server.close();
  }

  tick(dt: number) {
    if (!this.isRunning) return;

    this.stats.begin();
    // TODO create server intialization manager with subscribe
    //this.world.tick(dt);

    // Render
    // TODO create server intialization manager with subscribe
    // this.renderer.render(this.world.scene, this.world.camera);
    this.stats.end();
  }

  // Events
  private registerCanvasEvents() {
    // Show darkened overlay when game is not in focus.
    // TODO encapsulate selector into HtmlParser instance with strict getter
    (this.guiNode.querySelector('.overlay-info') as HTMLDivElement).onclick = () => {
      let canvas = this.renderer.domElement;
      canvas.requestPointerLock = canvas.requestPointerLock || (canvas as any).mozRequestPointerLock;
      if (canvas.requestPointerLock) canvas.requestPointerLock();
    };
  }

  // Override event handlers on "State".
  onPointerLockChange(event: Event) {
    let overlay = this.guiNode.querySelector('#overlay') as HTMLDivElement;

    let canvas = this.renderer.domElement;
    if (document.pointerLockElement === canvas || (document as any).mozPointerLockElement === canvas) {
      overlay.style.display = 'none';
    } else {
      overlay.style.display = 'flex';
    }
  }

  onResize(event: Event) {
    let width = window.innerWidth;
    let height = window.innerHeight;

    // TODO create server intialization manager with subscribe
//    this.world.camera.aspect = width / height;
//    this.world.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, true);
  }
}

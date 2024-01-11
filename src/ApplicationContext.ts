import { Server } from './Server';
import { Settings } from './Settings';
import { PageManager } from './states/PageManager';
import { AssetManager } from './three/AssetManager';
import { World } from './World';
import { WebGLRenderer } from 'three';

const settingsProxyHandler = {
  set: (obj: any, prop: string, value: any) => {
    if (obj[prop] !== value) {
      obj[prop] = value;
      localStorage.setItem('settings', JSON.stringify(obj));
    }
    return true;
  },
};

export class ApplicationContext {
  audioContext = new AudioContext();
  gain = this.audioContext.createGain();
  settings: Settings = new Proxy(new Settings(this.audioContext, this.gain), settingsProxyHandler);
  renderer = new WebGLRenderer({
    antialias: this.settings.antialias,
  });
  pageManager: PageManager;
  assetManager = new AssetManager(this.audioContext, this.gain);
  private _world?: World;
  private _server?: Server;

  constructor() {
    // One audio context and gain node is passed to all sounds.
    this.gain.connect(this.audioContext.destination);

    this.pageManager = new PageManager(this);
  }

  get world(): World {
    if (!this._world) {
      throw new Error('World not initialized');
    }
    return this._world;
  }

  get server(): Server {
    if (!this._server) {
      throw new Error('Server not initialized');
    }
    return this._server;
  }

  startServer(guiNode: HTMLElement) {
    this._server = new Server(this, this.settings.serverAddress, () => {
      console.log('WS connect');
      this.initRenderer();
      this._world = new World(this, guiNode);
      this.settings.isRunning = true;

      document.body.appendChild(guiNode);
    });

  }

  // Init
  initRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xBFF0FF);

    document.body.appendChild(this.renderer.domElement);
  }
}

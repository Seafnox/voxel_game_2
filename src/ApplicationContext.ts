import { Settings } from 'src/Settings';
import { PageManager } from 'src/states/PageManager';
import { AssetManager } from 'src/three/AssetManager';
import { WebGLRenderer } from 'three';

const settingsProxyHandler = {
  set: (obj: any, prop: string, value: any) => {
    if (obj[prop] !== value) {
      obj[prop] = value;
      localStorage.setItem('settings', JSON.stringify(obj));
    }
    return true;
  }
};
export class ApplicationContext {
  audioContext = new AudioContext();
  gain = this.audioContext.createGain();
  settings: Settings = new Proxy(new Settings(this.audioContext, this.gain), settingsProxyHandler);
  renderer = new WebGLRenderer({
    antialias: this.settings.antialias
  });
  pageManager: PageManager;
  assetManager = new AssetManager(this.audioContext, this.gain);


  constructor() {
    // One audio context and gain node is passed to all sounds.
    this.gain.connect(this.audioContext.destination);

    this.pageManager = new PageManager(this);
  }


}

import { TextureLoader, JSONLoader, NearestFilter, Texture, MeshBasicMaterial, SkinnedMesh } from 'three';
import { AnimatedMesh } from 'src/AnimatedMesh';
import { Sound } from 'src/Sound';

type ProgressFn = (name: string, percent: number) => void;
type DoneFn = () => void;

export class AssetManager {
  private isLoaded = false;
  private filesDone = 0;
  private totalFiles = 0;

  // Type specific loaders
  private textureLoader: TextureLoader = new TextureLoader();
  private meshLoader: JSONLoader = new JSONLoader();

  // Where and how to direct sounds to
  private audioContext: AudioContext;
  private gain: GainNode;

  private queue: {
    textures: Array<[string, string]>,
    meshes: Array<[string, string]>,
    music: Array<[string, string]>,
    sounds: Array<[string, string]>
  };

  private assets: {
    textures: Map<string, Texture>,
    meshes: Map<string, SkinnedMesh | AnimatedMesh>,
    music: Map<string, HTMLAudioElement>,
    sounds: Map<string, Sound>
  };

  constructor(audioContext: AudioContext, gain: GainNode) {
    this.audioContext = audioContext;
    this.gain = gain;

    this.queue = {
      textures: [],
      meshes: [],
      music: [],
      sounds: [],
    };
    this.assets = {
      textures: new Map<string, Texture>(),
      meshes: new Map<string, SkinnedMesh | SkinnedMesh>(),
      music: new Map<string, HTMLAudioElement>(),
      sounds: new Map<string, Sound>(),
    };
  }

  addTexture(name: string, url: string) {
    console.log('addTexture', {name, url});
    this.queue.textures.push([name, url]);
  }

  addMesh(name: string, url: string) {
    console.log('addMesh', {name, url});
    this.queue.meshes.push([name, url]);
  }

  addMusic(name: string, url: string) {
    console.log('addMusic', {name, url});
    this.queue.music.push([name, url]);
  }

  addSound(name: string, url: string) {
    console.log('addSound', {name, url});
    this.queue.sounds.push([name, url]);
  }

  private getQueueLength() {
    return this.queue.textures.length + this.queue.meshes.length + this.queue.music.length + this.queue.sounds.length;
  }

  load(progress: ProgressFn, done: DoneFn) {
    if (this.isLoaded) return;

    this.filesDone = 0;
    this.totalFiles = this.getQueueLength() + 1;

    this.loadTextures(progress, () => {
      this.queue.textures = [];
      this.loadMeshes(progress, () => {
        this.queue.meshes = [];
        this.loadMusic(progress, () => {
          this.queue.music = [];
          this.loadSounds(progress, () => {
            this.queue.sounds = [];
            this.isLoaded = true;
            progress('complete', 1.0);
            done();
          });
        });
      });
    });
  }

  private loadTextures(progress: ProgressFn, done: DoneFn) {
    let filesDone = 0;

    this.queue.textures.forEach(pair => {
      let [name, url] = pair;
      this.textureLoader.load(url, texture => {
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
        this.assets.textures.set(name, texture);

        filesDone++;
        this.filesDone++;
        progress('textures', this.filesDone / this.totalFiles);

        if (filesDone == this.queue.textures.length) done();
      });
    });
  }

  private loadMeshes(progress: ProgressFn, done: DoneFn) {
    let filesDone = 0;

    this.queue.meshes.forEach(pair => {
      let [name, url] = pair;
      this.meshLoader.load(url, (geometry, materials) => {
        let material = new MeshBasicMaterial({
          map: this.getTexture(name),
        });
        if (geometry.animations) {
          material.skinning = true;
          material.morphTargets = true;
          this.assets.meshes.set(name, new AnimatedMesh(geometry, material));
        } else {
          this.assets.meshes.set(name, new SkinnedMesh(geometry, material));
        }

        filesDone++;
        this.filesDone++;
        progress('models', this.filesDone / this.totalFiles);

        if (filesDone == this.queue.meshes.length) done();
      });
    });
  }

  private loadMusic(progress: ProgressFn, done: DoneFn) {
    let filesDone = 0;

    this.queue.music.forEach(pair => {
      let [name, url] = pair;

      let el = document.createElement('audio');
      el.setAttribute('src', url);
      el.load();

      let canPlayThrough = () => {
        this.assets.music.set(name, el);

        filesDone++;
        this.filesDone++;
        progress('music', this.filesDone / this.totalFiles);
        el.removeEventListener('canplaythrough', canPlayThrough, false);

        if (filesDone == this.queue.music.length) done();
      };

      el.addEventListener('canplaythrough', canPlayThrough, false);
    });
  }

  private loadSounds(progress: ProgressFn, done: DoneFn) {
    let filesDone = 0;
    let audioCtx = new AudioContext();

    this.queue.sounds.forEach(pair => {
      let [name, url] = pair;
      let req = new XMLHttpRequest();
      req.responseType = 'arraybuffer';
      req.addEventListener('load', () => {
        let data = req.response;
        audioCtx.decodeAudioData(data, (buffer) => {
          this.assets.sounds.set(name, new Sound(this.audioContext, buffer, this.gain));

          filesDone++;
          this.filesDone++;
          progress('sounds', this.filesDone / this.totalFiles);

          if (filesDone == this.queue.sounds.length) done();
        });
      });
      req.open('GET', url);
      req.send();
    });
  }

  getTexture(name: string): Texture {
    if (!this.assets.textures.has(name)) throw new Error(`Can't find Texture with name: ${name}`);
    return this.assets.textures.get(name)!;
  }

  getMesh(name: string): SkinnedMesh {
    if (!this.assets.meshes.has(name)) throw new Error(`Can't find Model with name: ${name}`);
    return this.assets.meshes.get(name)!;
  }

  getMusic(name: string): HTMLAudioElement {
    if (!this.assets.music.has(name)) throw new Error(`Can't find Music with name: ${name}`);
    return this.assets.music.get(name)!;
  }

  getSound(name: string): Sound {
    if (!this.assets.sounds.has(name)) throw new Error(`Can't find Sound with name: ${name}`);
    return this.assets.sounds.get(name)!;
  }
}

import { State } from './State';
import { MenuState } from './MenuState';
import { HTMLParser } from 'src/HTMLParser';
import backgroundMusic from '../../assets/sound/music.ogg';
import walkSound from '../../assets/sound/walk.ogg';
import digSound from '../../assets/sound/dig.ogg';
import pickupSound from '../../assets/sound/pickup.ogg';

const html = `
    <div id="loader">
        <style></style>
        <progress value="0" max="1"></progress>
    </div>
`;

export class AssetLoadingState extends State {
  private progressDescription = '';
  private progress = 0;

  // TODO create GuiManager with controlling through state. remove Nodes from state
  private loaderNode: Element;
  // TODO create GuiManager with controlling through state. remove Nodes from state
  private styleNode!: HTMLStyleElement;
  // TODO create GuiManager with controlling through state. remove Nodes from state
  private progressNode!: HTMLProgressElement;

  constructor() {
    super();
    let parser = new HTMLParser();
    this.loaderNode = parser.parse(html);
  }

  onEnter() {
    this.loadAssets();

    document.body.appendChild(this.loaderNode);

    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.styleNode = this.loaderNode.querySelector('style') as HTMLStyleElement;
    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.progressNode = this.loaderNode.querySelector('progress') as HTMLProgressElement;
  }

  onExit() {
    document.body.removeChild(this.loaderNode);
  }

  tick(dt: number) {
    // Update progress bar.
    if (this.progress != this.progressNode.value) {
      this.progressNode.value = this.progress;

      let percent = (this.progress * 100.0) | 0;
      this.styleNode.innerHTML = `
            #loader progress:before {
                content: 'Loading ${this.progressDescription} (${percent}%)'
            }`;
    }
  }

  private loadAssets() {
    if (!this.assetManager) throw new Error(`Can't find AssetManager`);

    // Textures
    // FIXME this.assetManager.addTexture('terrain', terrainTexture);
    // FIXME this.assetManager.addTexture('player', playerTexture);

    // Meshes
    // FIXME this.assetManager.addMesh('player', playerModel);

    // Music
    this.assetManager.addMusic('music', backgroundMusic);

    // Sound effects
    this.assetManager.addSound('walk', walkSound);
    this.assetManager.addSound('dig', digSound);
    this.assetManager.addSound('pickup', pickupSound);

    this.assetManager.load((description: string, progress: number) => {
      this.progressDescription = description;
      this.progress = progress;

      if (this.progress >= 1.0) {
        this.transitionTo(new MenuState());
      }
    });
  }
}

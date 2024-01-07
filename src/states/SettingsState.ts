import { HTMLParser } from 'src/HTMLParser';
import { State } from './State';
import { MenuState } from './MenuState';
import '../../assets/stylesheets/settings.scss';

const html = `
    <div class="menu menu-settings">
        <div class="box animated bounceIn">
            <ul>
                <li>
                    <h3>Graphics settings</h3>
                </li>

                <li>
                    <label><input class="settings-antialias" type="checkbox"> Antialias</label> <br>
                    <small>Enabling / disabling antialiasing requires a page refresh to take effect.</small>
                </li>

                <li>
                    <h3>Audio settings</h3>
                </li>

                <li>
                    <span>Sound effect volume:</span>
                    <input class="settings-sound" type="range" min="0" max="1" step="0.05">
                </li>

                <li>
                    <span>Music volume:</span>
                    <input class="settings-music" type="range" min="0" max="1" step="0.05">
                </li>
            </ul>
            <button class="button btn-menu">Return to menu</button>
        </div>
    </div>
`;

export class SettingsState extends State {
  // TODO create GuiManager with controlling through state. remove Nodes from state
  private guiNode: Element;

  constructor() {
    super();

    let parser = new HTMLParser();
    this.guiNode = parser.parse(html);

    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.guiNode.querySelector('.btn-menu')?.addEventListener('click', () => {
      this.transitionTo(new MenuState());
    });

    this.registerEvents();
  }

  onEnter() {
    document.body.appendChild(this.guiNode);

    // TODO encapsulate selector into HtmlParser instance with strict getter
    (this.guiNode.querySelector('.settings-antialias') as HTMLInputElement).checked = !!this.settings?.antialias;
    // TODO encapsulate selector into HtmlParser instance with strict getter
    (this.guiNode.querySelector('.settings-sound') as HTMLInputElement).value = '' + this.settings?.soundVolume;
    // TODO encapsulate selector into HtmlParser instance with strict getter
    (this.guiNode.querySelector('.settings-music') as HTMLInputElement).value = '' + this.settings?.musicVolume;
  }

  onExit() {
    document.body.removeChild(this.guiNode);
  }

  tick(dt: number) {
  }

  private registerEvents() {
    // TODO encapsulate selector into HtmlParser instance with strict getter
    let antialiasNode = this.guiNode.querySelector('.settings-antialias') as HTMLInputElement;
    antialiasNode.addEventListener('change', (evt) => {
      // TODO when settings was strict
      if (this.settings) this.settings.antialias = antialiasNode.checked;
    });
    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.guiNode.querySelector('.settings-sound')?.addEventListener('change', (evt) => {
      // TODO when settings was strict
      if (this.settings) this.settings.soundVolume = parseFloat((evt.target as HTMLInputElement).value);
    });
    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.guiNode.querySelector('.settings-music')?.addEventListener('change', (evt) => {
      let musicVolume = parseFloat((evt.target as HTMLInputElement).value);
      // TODO when settings was strict
      if (this.settings) this.settings.musicVolume = musicVolume;
      // TODO when assetManager was strict
      if (this.assetManager) this.assetManager.getMusic('music').volume = musicVolume;
    });
  }
}

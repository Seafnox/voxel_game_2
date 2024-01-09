import { HTMLParser } from '../HTMLParser';
import { Page } from './Page';
import { settingsHtml } from './html/SettingsHtml';
import { MenuPage } from './MenuPage';
import '../../assets/stylesheets/settings.scss';

export class SettingsPage extends Page {
  // TODO create GuiManager with controlling through state. remove Nodes from state
  private guiNode: Element;

  constructor() {
    super();

    let parser = new HTMLParser();
    this.guiNode = parser.parse(settingsHtml);

    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.guiNode.querySelector('.btn-menu')?.addEventListener('click', () => {
      this.transitionTo(new MenuPage());
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

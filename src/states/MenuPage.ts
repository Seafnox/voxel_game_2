import { HTMLParser } from '../HTMLParser';
import { menuHtml } from './html/MenuHtml';
import { Page } from './Page';
import { PlayPage } from "./PlayPage";
import { SettingsPage } from './SettingsPage';
import '../../assets/stylesheets/menu.scss';

export class MenuPage extends Page {
  // TODO create GuiManager with controlling through state. remove Nodes from state
  private menuNode: Element;

  constructor() {
    super();

    let parser = new HTMLParser();
    this.menuNode = parser.parse(menuHtml);
  }

  onEnter() {
    if (!this.assetManager) throw new Error(`Can't find AssetManager`);
    if (!this.settings) throw new Error(`Can't find Settings`);

    this.checkBrowserSupport();

    document.body.appendChild(this.menuNode);

    // TODO encapsulate selector into HtmlParser instance with strict getter
    (this.menuNode.querySelector('#name') as HTMLInputElement).value = this.settings?.playerName;
    // TODO encapsulate selector into HtmlParser instance with strict getter
    (this.menuNode.querySelector('#server') as HTMLInputElement).value = this.settings?.serverAddress;

    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.menuNode.querySelector('.btn-join')?.addEventListener('click', this.join.bind(this));
    // TODO encapsulate selector into HtmlParser instance with strict getter
    this.menuNode.querySelector('.btn-settings')?.addEventListener('click', () => {
      this.transitionTo(new SettingsPage());
    });

    let audio = this.assetManager.getMusic('music');
    audio.loop = true;
    audio.volume = this.settings.musicVolume;
    audio.play().catch(() => {
      window.addEventListener('click', () => {
        audio.play();
      }, {
        once: true
      });
    });
  }

  onExit() {
    document.body.removeChild(this.menuNode);
  }

  private checkBrowserSupport() {
    // TODO add check to browser support in future
  }

  private join() {
    // TODO encapsulate selector into HtmlParser instance with strict getter
    let playerName = (this.menuNode.querySelector('#name') as HTMLInputElement).value;
    if (playerName.length === 0) return;
    if (this.settings) this.settings.playerName = playerName;

    // TODO encapsulate selector into HtmlParser instance with strict getter
    let serverAddress = (this.menuNode.querySelector('#server') as HTMLInputElement).value;
    if (serverAddress.length === 0) return;
    if (this.settings) this.settings.serverAddress = serverAddress;

    this.transitionTo(new PlayPage());
  }

  tick(dt: number): void {}
}

import { ApplicationContext } from 'src/ApplicationContext';
import { Settings } from 'src/Settings';
import { AssetManager } from 'src/three/AssetManager';
import { PageManager } from 'src/states/PageManager';

export abstract class Page {
  // TODO make strict through constructor
  pageManager: PageManager | undefined;
  // TODO make strict through constructor
  context: ApplicationContext | undefined;

  // TODO make strict getter
  get assetManager(): AssetManager | undefined {
    return this.context?.assetManager;
  }

  // TODO make strict getter
  get settings(): Settings | undefined {
    return this.context?.settings;
  }

  abstract tick(dt: number): void;

  abstract onEnter(): void

  abstract onExit(): void;

  transitionTo(nextState: Page) {
    this.pageManager?.set(nextState);
  }

  // Provide no-op implementations of events.
  // StateManager adds event listeners on document / window so
  // State's child classes get an easier job cleaning themselves up.
  // Avoids a lot of potential leaks.
  onResize(evt: Event) {}

  onPointerLockChange(evt: Event) {}
}

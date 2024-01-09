import { ApplicationContext } from 'src/ApplicationContext';
import { Page } from 'src/states/Page';

export class PageManager {
  private page: Page | undefined;
  private nextPage: Page | undefined;
  private currentTime = performance.now();

  constructor(
    protected context: ApplicationContext,
  ) {
    this.update();
    this.registerEvents();
  }

  set(nextPage: Page) {
    if (this.page) {
      this.page.onExit();
    }
    this.nextPage = nextPage;
    this.nextPage.pageManager = this;
    this.nextPage.context = this.context;
  }

  private update() {
    if (this.nextPage) {
      this.page = this.nextPage;
      this.page.onEnter();
      this.nextPage = undefined;
    }

    if (this.page) {
      let newTime = performance.now();
      let dt = (newTime - this.currentTime) / 1000;

      this.page.tick(dt);
      this.currentTime = newTime;
    }

    requestAnimationFrame(this.update.bind(this));
  }

  private registerEvents() {
    window.addEventListener('resize', evt => {
      this.page?.onResize(evt);
    }, false);

    document.addEventListener('pointerlockchange', evt => {
      this.page?.onPointerLockChange(evt);
    }, false);
  }
}



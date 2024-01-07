import { ApplicationContext } from 'src/ApplicationContext';
import { State } from './State';

export class StateManager {
  private state: State | undefined;
  private nextState: State | undefined;
  private currentTime = performance.now();

  constructor(
    protected context: ApplicationContext,
  ) {
    this.update();
    this.registerEvents();
  }

  setState(nextState: State) {
    if (this.state) {
      this.state.onExit();
    }
    this.nextState = nextState;
    this.nextState.stateManager = this;
    this.nextState.context = this.context;
  }

  private update() {
    if (this.nextState) {
      this.state = this.nextState;
      this.state.onEnter();
      this.nextState = undefined;
    }

    if (this.state) {
      let newTime = performance.now();
      let dt = (newTime - this.currentTime) / 1000;

      this.state.tick(dt);
      this.currentTime = newTime;
    }

    requestAnimationFrame(this.update.bind(this));
  }

  private registerEvents() {
    window.addEventListener('resize', evt => {
      this.state?.onResize(evt);
    }, false);

    document.addEventListener('pointerlockchange', evt => {
      this.state?.onPointerLockChange(evt);
    }, false);
  }
}



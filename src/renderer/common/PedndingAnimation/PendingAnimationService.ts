import IPendingAnimationComponent from './IPendingAnimation';

export class PendingAnimationService {

  public component?: IPendingAnimationComponent;

  public timestamps: number[] = [];

  constructor() { }

  public register(comp: IPendingAnimationComponent) {
    this.component = comp;
  }

  public unregister() {
    this.component = undefined;
  }

  show() {
    this.component!.show();
    const timestamp = +Date.now();
    this.timestamps.push(timestamp);
    return timestamp;
  }

  hide(timestamp: number) {
    const index = this.timestamps.indexOf(timestamp);
    if (index >= 0) {
      this.timestamps.splice(index, 1);
    }
    if (this.timestamps.length === 0) {
      this.component!.hide();
    }
  }
}

const pendingAnimationService = new PendingAnimationService();
export { pendingAnimationService }  
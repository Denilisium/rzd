import IPendingAnimationComponent from './IPendingAnimation';

export class PendingAnimationService {

  public component?: IPendingAnimationComponent;

  constructor() { }

  public register(comp: IPendingAnimationComponent) {
    this.component = comp;
  }

  public unregister() {
    this.component = undefined;
  }

  show() {
    if (this.component) {
      this.component.show();
    }
  }

  hide() {
    if (this.component) {
      this.component.hide();
    }
  }
}

const pendingAnimationService = new PendingAnimationService();
export { pendingAnimationService }  
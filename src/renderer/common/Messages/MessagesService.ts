import IMessagesComponent from './IMessages';
import Message from './Message';

export class MessagesService {

  public component?: IMessagesComponent;

  constructor() { }

  public register(comp: IMessagesComponent) {
    this.component = comp;
  }

  public unregister() {
    this.component = undefined;
  }

  show(content: string, level: number = 1) {
    const msg = new Message(content, level)
    if (this.component) {
      this.component.show(msg);
    }
  }
}

const messagesService = new MessagesService();
export { messagesService }  
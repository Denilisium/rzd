import * as React from 'react';

import './Prediction.css';
import { messagesService } from './MessagesService';
import IMessagesComponent from './IMessages';
import Message from './Message';

interface IState {
  messages: Message[];
}

class Messages extends React.Component<{}, IState> implements IMessagesComponent {
  public state: IState = {
    messages: [],
  }

  public service = messagesService;

  constructor(props: {}) {
    super(props);
  }

  public componentDidMount() {
    messagesService.register(this);
  }

  public componentWillUnmount() {
    messagesService.unregister();
  }

  public show(msg: Message) {
    this.setState((prevState) => ({
      messages: [...prevState.messages, msg]
    }));
  }

  public render() {
    return (
      this.state.messages.map((msg, index) => {
        <div className="message" key={index}>
          <div className={"message-content " + msg.level}>{msg.message}</div>
        </div>
      })
    )
  }

  private hideMessage(msg: Message) {
    setTimeout(() => {
      this.setState((prevState) => {
        const index = prevState.messages.findIndex((item) => item === msg);
        const messages = [...prevState.messages];
        messages.splice(index, 1);
        return {
          messages
        }
      });
    }, 3000);
  }
}

export default Messages;



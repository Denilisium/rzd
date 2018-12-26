import Message from './Message';

export default interface IMessagesComponent {
  show: (msg: Message) => void;
}
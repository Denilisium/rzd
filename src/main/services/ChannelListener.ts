import { ipcMain } from 'electron';
import Package from '../../common/Package';
import { answer_prefix } from '../../common/config.json';

export default class ChannelListener {
  public static subscribe(channel: string, fn: (args: any, send: (message: any) => {}) => any) {
    ipcMain.on(channel, ((_event: Electron.Event, _package: Package) => {
      console.info('Received packege [' + channel + ']: ' + _package.body);

      const answerChannel = channel + answer_prefix + _package.id;
      const sendFn = _event.sender.send.bind(_event.sender, answerChannel);
      fn(_package.body, sendFn);
    }));
  };

  public static unsibsribe(...channels: string[]) {
    channels.map((channel) => {
      ipcMain.removeAllListeners(channel);
    });
  }
}
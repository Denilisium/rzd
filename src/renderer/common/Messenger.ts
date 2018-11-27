import { ipcRenderer } from 'electron';
import Output from '../../common/Output';
import Package from '../../common/Package';
import { answer_prefix } from '../../common/config.json';

export default class Messenger {
  public static send(channel: string, body?: any): Promise<Output> {
    return new Promise((resolve, reject) => {
      const _package = new Package(body);
      ipcRenderer.once(`${channel}${answer_prefix}${_package.id}`, (event: Electron.Event, response: any) => {
        const output = new Output(response.code, response.body);
        output.isSuccess ? resolve(output) : reject(output.body);
      });
      ipcRenderer.send(channel, _package);
    });
  }
}
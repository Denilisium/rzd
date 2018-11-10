import { ipcMain, BrowserWindow } from 'electron';
import * as fs from 'fs';
import DatabaseHandler from './handler';
import Output from '../../common/Ouput';

export default class Mediator {
  private dbHandler: DatabaseHandler;

  constructor(private win: BrowserWindow) {
    this.dbHandler = DatabaseHandler.instance;
  }

  public listen() {
    ipcMain.on('db:exec', (event: Electron.Event, query: string) => {
      const result = this.dbHandler.exec(query);
      event.returnValue = result;
    });

    ipcMain.on('db:run', (event: Electron.Event, query: string) => {
      const result = this.dbHandler.run(query);
      event.returnValue = result;
    });

    ipcMain.on('db:last_row_id', (event: Electron.Event) => {
      const result = this.dbHandler.getLastRowId();
      event.returnValue = result;
    });

    ipcMain.on('db:open', (event: Electron.Event, path: string) => {
      fs.readFile(path, 'utf8', (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
          event.returnValue = Output.error(err.message);
        }
        const result = this.dbHandler.open(data);
        return result ? Output.success('') : Output.error('Can\'t open db');
      });
    });

    ipcMain.on('db:close', (event: Electron.Event) => {
      event.returnValue = this.dbHandler.close();
    });
  }

  public destroy() {
    const channels = ['db:exec', 'db:run', 'db:open'];
    channels.map((channel) => {
      ipcMain.removeAllListeners(channel);
    });
  }
} 
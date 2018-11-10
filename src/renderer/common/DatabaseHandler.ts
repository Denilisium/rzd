import { ipcRenderer } from 'electron';
import Ouput from '../../common/Ouput';
import Output from '../../common/Ouput';

class DatabaseHandler {
  public open(path: string): Ouput {
    return ipcRenderer.sendSync('db:open', path);
  }

  public close(): void {
    return ipcRenderer.sendSync('db:close');
  }

  public exec(query: string): any[] {
    const result = ipcRenderer.sendSync('db:exec', query) as Output;
    return result.body;
  }

  public run(query: string) {
    const result = ipcRenderer.sendSync('db:run', query) as Output;
    return result.body;
  }

  public getLastRowId(): number {
    const result = ipcRenderer.sendSync('db:last_row_id') as Output;
    return result.body;
  }
}

export default DatabaseHandler;


import HttpClient from './HttpClient';

class DatabaseHandler {
  public open(path: string): Promise<void> {
    return HttpClient.get('db/open', { path });
  }

  public close(): Promise<void> {
    return HttpClient.get('db/close');
  }

  public exec(query: string): Promise<any[]> {
    return HttpClient.get('db/exec', { query });
  }

  public run(query: string): Promise<void> {
    return HttpClient.get('db/run', { query });
  }

  public getLastRowId(): Promise<number> {
    return HttpClient.get('db/last_row_id');
  }
}

export default DatabaseHandler;


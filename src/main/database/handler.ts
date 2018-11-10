import * as SQL from 'sql.js';
import Output from '../../common/Ouput';
import messages from '../resources/messages';
class DatabaseHandler {
  private static member?: DatabaseHandler;

  public static get instance(): DatabaseHandler {
    if (DatabaseHandler.member === undefined) {
      DatabaseHandler.member = new DatabaseHandler();
    }
    return DatabaseHandler.member;
  }

  private db?: SQL.Database;

  private get dbInstance(): SQL.Database {
    if (this.db) {
      return this.db;
    }
    throw new Error('Can\'t connect to db');
  }

  public open(data: Uint8Array | Buffer): boolean {
    let success = true;
    try {
      this.db = new SQL.Database(data);
    } catch (error) {
      success = false;
    }
    return success;
  }

  public close(): Output {
    return this.safeRun(() => {
      if (this.db !== undefined) {
        this.db!.close();
        this.db = undefined;
      }
    });
  }

  public exec(query: string): Output {
    return this.safeRun(() => {
      const result = this.dbInstance.exec(query)[0];
      if (result === undefined) {
        return [];
      }
      return this.parseResult(result);
    });
  }

  public run(query: string): Output {
    return this.safeRun(() => {
      return this.dbInstance.run(query);
    });
  }

  public getLastRowId(): Output {
    return this.safeRun(() => {
      const query = 'SELECT last_insert_rowid()';
      const result = this.dbInstance.exec(query);
      return result[0].values[0][0] as number;
    });
  }

  private parseResult(queryResult: SQL.QueryResults) {
    const columns = queryResult.columns;

    return queryResult.values.map(values => {
      const res = {};
      columns.map((prop, index) => res[prop] = values[index]);
      return res;
    });
  }

  private safeRun(fn: () => any): Output {
    try {
      if (this.db === undefined) {
        throw new Error(messages.DB_EMPTY_ERROR);
      }
      let response = fn();
      return Output.success(response);
    } catch (error) {
      return Output.error(error);
    }
  }
}

export default DatabaseHandler;




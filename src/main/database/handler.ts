import * as SQL from 'sql.js';

import Output from '../../common/Output';
class DatabaseHandler {
  private _db?: SQL.Database;

  private get db(): SQL.Database {
    if (this._db) {
      return this._db;
    }
    throw new Error('Can\'t connect to db');
  }

  public open(data: Uint8Array | Buffer): boolean {
    let success = true;

    try {
      this._db = new SQL.Database(data);
    } catch (error) {
      success = false;
    }
    return success;
  }

  public close(): Output {
    return this.safeRun(() => {
      if (this._db !== undefined) {
        this._db!.close();
        this._db = undefined;
      }
    });
  }

  public exec(query: string): Output {
    return this.safeRun(() => {
      const result = this.db.exec(query)[0];
      if (result === undefined) {
        return [];
      }
      return this.parseResult(result);
    });
  }

  public run(query: string): Output {
    return this.safeRun(() => {
      return this.db.run(query);
    });
  }

  public getLastRowId(): Output {
    return this.safeRun(() => {
      const query = 'SELECT last_insert_rowid()';
      const result = this.db.exec(query);
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

  private safeRun(fn: () => any): any {
    return fn();
    // try {
    //   if (this._db === undefined) {
    //     throw new Error(messages.DB_EMPTY_ERROR);
    //   }
    //   let response = fn();
    //   return response;
    // } catch (error) {
    //   console.error(error);
    //   return error;
    // }
  }
}

const dbHandler = new DatabaseHandler();

export default dbHandler;




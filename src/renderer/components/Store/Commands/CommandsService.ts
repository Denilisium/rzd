import DatabaseHandler from '../../../common/DatabaseHandler';
import DataService from '../Interfaces/IDataService';
import Command from './CommandModel';
import IQuery from '../Interfaces/IQuery';

class CommmandsService implements DataService<Command>{
  private readonly databaseHandler = new DatabaseHandler();

  public get(id?: any): Promise<Command> {
    return Promise.resolve()
      .then(() => {
        let sqlQuery = 'select top 1 * from Commands';
        sqlQuery += ` where id=${id}`;
        return this.databaseHandler.exec(sqlQuery);
      })
      .then((response) => {
        const result = this.parseRaw(response);
        return result[0];
      });
  }

  public update(model: Command): Promise<Command> {
    const isNew = model.id === undefined;
    let sqlQuery: string = '';

    if (isNew) { // model exists in database
      sqlQuery = `update Commands
      set attr = '${model.attr}', description = '${model.description}'
      where id = ${model.id}`;
    } else { // create a new one
      sqlQuery = `insert into Commands(attr,name) values ('${model.attr}','${model.description}')`;
    }

    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery))
      .then(() => {
        if (isNew !== true) {
          return model;
        }
        return this.databaseHandler.getLastRowId()
          .then((id) => {
            model.id = id;
            return model;
          })
      });
  }

  public remove(id: any): Promise<void> {
    const sqlQuery: string = `delete from Commands where id = ${id}`;
    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery));
  }

  public getMany(query?: IQuery): Promise<{ data: Command[], count: number }> {
    return Promise.resolve()
      .then(() => {
        const distinct = (query && query.distinct) ? ' distinct ' : '';
        const sqlQuery = `select ${distinct} * from Commands`;
        return this.databaseHandler.exec(sqlQuery);
      })
      .then((res) => {
        const data = this.parseRaw(res);
        return {
          data,
          count: data.length,
        };
      });
  }

  private parseRaw(result: any[]) {
    return result.map((item) => new Command(item.attr, item.description, item.id));
  }


}

export default CommmandsService;

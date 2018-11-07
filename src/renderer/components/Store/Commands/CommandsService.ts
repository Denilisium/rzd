import DatabaseHandler from '../../../common/DatabaseHandler';
import DataService from '../Interfaces/IDataService';
import Command from './CommandModel';
import IQuery from '../Interfaces/IQuery';

class CommmandsService implements DataService<Command>{
  private readonly databaseHandler: DatabaseHandler;

  constructor() {
    this.databaseHandler = DatabaseHandler.instance;
  }

  public get(id?: any): Promise<Command> {
    return Promise.resolve()
      .then(() => {
        let sqlQuery = 'select top 1 * from Commands';
        sqlQuery += ` where id=${id}`;

        const result = this.parseRaw(this.databaseHandler.exec(sqlQuery));
        return result[0];
      });
  }

  public update(model: Command): Promise<Command> {
    let sqlQuery: string = '';

    if (model.id) { // model exists in database
      sqlQuery = `update Commands
      set attr = '${model.attr}', description = '${model.description}'
      where id = ${model.id}`;
    } else { // create a new one
      sqlQuery = `insert into Commands(attr,name) values ('${model.attr}','${model.description}')`;
      model.id = this.databaseHandler.getLastRowId();
    }

    return Promise.resolve()
      .then(() => {
        this.databaseHandler.run(sqlQuery);
        return model;
      });
  }

  public remove(id: any): Promise<void> {
    const sqlQuery: string = `delete from Commands where id = ${id}`;
    return Promise.resolve()
      .then(() => { this.databaseHandler.run(sqlQuery); });
  }

  public getMany(query?: IQuery): Promise<{ data: Command[], count: number }> {
    return Promise.resolve()
      .then(() => {
        const distinct = (query && query.distinct) ? ' distinct ' : '';
        const sqlQuery = `select ${distinct} * from Commands`;
        const data = this.parseRaw(this.databaseHandler.exec(sqlQuery));
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

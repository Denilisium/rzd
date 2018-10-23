import DatabaseHandler from '../../../common/DatabaseHandler';
import DataService from '../Interfaces/IDataService';
import IQuery from '../Interfaces/IQuery';
import Station from './Station';

class StationsService implements DataService<Station>{
  private readonly databaseHandler: DatabaseHandler;

  constructor() {
    this.databaseHandler = DatabaseHandler.instance;
  }

  public get(id?: any): Promise<Station> {
    return Promise.resolve()
      .then(() => {
        let sqlQuery = 'select top 1 * from Commands';
        sqlQuery += ` where id=${id}`;

        const result = this.parseRaw(this.databaseHandler.exec(sqlQuery));
        return result[0];
      });
  }

  public update(model: Station): Promise<Station> {
    let sqlQuery: string = '';

    if (model.id) { // model exists in database
      sqlQuery = `update Stations
      set name = '${model.name}'
      where id = ${model.id}`;
    } else { // create a new one
      sqlQuery = `insert into Stations(id,name) values ('${model.id}','${model.name}')`;
    }

    return Promise.resolve()
      .then(() => {
        this.databaseHandler.run(sqlQuery);
        return model;
      });
  }

  public remove(id: any): Promise<void> {
    const sqlQuery: string = `delete from Stations where id = ${id}`;
    return Promise.resolve()
      .then(() => { this.databaseHandler.run(sqlQuery); });
  }
  public getMany(query?: IQuery): Promise<{ data: Station[], count: number }> {
    return Promise.resolve()
      .then(() => {
        const sqlQuery = 'select * from Stations';
        const data = this.parseRaw(this.databaseHandler.exec(sqlQuery));
        return {
          data,
          count: data.length,
        };
      });
  }

  private parseRaw(result: any[]) {
    return result.map((item) => new Station(item.id, item.name));
  }
}

export default StationsService;

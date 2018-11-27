import DatabaseHandler from '../../../common/DatabaseHandler';
import DataService from '../Interfaces/IDataService';
import IQuery from '../Interfaces/IQuery';
import Station from './Station';

class StationsService implements DataService<Station>{
  private readonly databaseHandler = new DatabaseHandler();

  public get(id?: any): Promise<Station> {
    return Promise.resolve()
      .then(() => {
        let sqlQuery = 'select top 1 * from Stations';
        sqlQuery += ` where id=${id}`;
        return this.databaseHandler.exec(sqlQuery);
      })
      .then((response) => {
        const result = this.parseRaw(response);
        return result[0];
      });
  }

  public update(model: Station): Promise<Station> {
    const isNew = model.id === undefined;
    let sqlQuery: string = '';

    if (isNew) { // model exists in database
      sqlQuery = `update Stations
      set name = '${model.name}'
      where id = ${model.id}`;
    } else { // create a new one
      sqlQuery = `insert into Stations(id,name) values ('${model.id}','${model.name}')`;
    }

    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery))
      .then(() => model);
  }

  public remove(id: any): Promise<void> {
    const sqlQuery: string = `delete from Stations where id = ${id}`;
    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery));
  }
  public getMany(query?: IQuery): Promise<{ data: Station[], count: number }> {
    return Promise.resolve()
      .then(() => {
        const sqlQuery = 'select * from Stations';
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
    return result.map((item) => new Station(item.id, item.name));
  }
}

export default StationsService;

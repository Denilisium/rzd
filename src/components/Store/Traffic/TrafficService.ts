import DatabaseHandler from '../../../common/DatabaseHandler';
import IDataService from '../Interfaces/IDataService';
import TrafficModel from './TrafficModel';
import Query from '../Models/Query';

class TrafficService implements IDataService<TrafficModel>{
  private readonly databaseHandler: DatabaseHandler;

  constructor() {
    this.databaseHandler = DatabaseHandler.instance;
  }

  public get(id?: any): Promise<TrafficModel> {
    throw new Error('Not implement');
  }

  public update(model: TrafficModel): Promise<TrafficModel> {
    throw new Error('Not implement');
  }

  public remove(id: any): Promise<void> {
    throw new Error('Not implement');
  }

  public getMany(query: Query): Promise<{ data: TrafficModel[], count: number }> {
    return Promise.resolve()
      .then(() => {
        const sql = query.toSQL('Traffic');
        const rows = this.databaseHandler.exec(sql);

        const sqlCount = query.toSQLCount('Traffic');
        const count = this.databaseHandler.exec(sqlCount)[0].count;

        return {
          data: rows as TrafficModel[],
          count,
        };
      });
  }

  // private parseRaw(result: any[]) {
  //   return result.map((item) => new TrafficModel(item.id, item.trainNum, item.stationLoad,
  //     item.departureDeateTime, item.carsCount, item.trainId, item.cop, item.cop2,
  //     item.nop, item.fromStationId, item.stationId, item.stationName,
  //     item.actualDepartureDateTime));
  // }
}

export default TrafficService;

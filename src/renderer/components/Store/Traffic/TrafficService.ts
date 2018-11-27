import DatabaseHandler from '../../../common/DatabaseHandler';
import IDataService from '../Interfaces/IDataService';
import TrafficModel from './TrafficModel';
import Query from '../Models/Query';

// @TODO: refactoring data services: 
// - place all sql queries in model
// - service is inherited from common overrided service with specific model type
class TrafficService implements IDataService<TrafficModel>{
  private readonly databaseHandler = new DatabaseHandler();

  public get(id?: any): Promise<TrafficModel> {
    throw new Error('Not implement');
  }

  public update(model: TrafficModel): Promise<TrafficModel> {
    throw new Error('Not implement');
  }

  public remove(id: any): Promise<void> {
    throw new Error('Not implement');
  }

  // @TODO: common model for dataservice's output result
  public getMany(query: Query): Promise<{ data: TrafficModel[], count: number }> {
    return Promise.resolve()
      .then(() => {
        const sql = query.toSQL('Traffic');
        const sqlCount = query.toSQLCount('Traffic');

        console.time('getMany');
        return Promise.all([
          this.databaseHandler.exec(sql),
          this.databaseHandler.exec(sqlCount)
        ])
          .then(([resData, resCount]) => {
            console.timeEnd('getMany');
            return {
              data: resData as TrafficModel[],
              count: resCount[0].count,
            };
          })
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

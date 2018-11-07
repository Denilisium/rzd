import DatabaseHandler from '../../../common/DatabaseHandler';
import DataService from '../Interfaces/IDataService';
import IQuery from '../Interfaces/IQuery';
import Route from './Route';
import RouteItem from './RouteItem/RouteItem';
import Station from '../Stations/Station';
import Command from '../Commands/CommandModel';
import { orderByDesc } from '../../../common/utils';
import Time from '../../../common/Time';

class RoutesService implements DataService<Route>{
  private readonly databaseHandler: DatabaseHandler;
  private readonly sqlQuery = `
          select  
            t.routeId, 
            t.route as name,
            t.id, 
            t.timeShedule as time,
            [index],
            t.stationId, 
            s.name as stationName, 
            t.comId, 
            com.attr as comAttr, 
            com.description as comDescription
          from Timings t
          join Stations s on s.id = t.stationId
          join Commands com on com.id = t.comId
  `;

  constructor() {
    this.databaseHandler = DatabaseHandler.instance;
  }

  public get(id?: any): Promise<Route> {
    return Promise.resolve()
      .then(() => {
        let sqlQuery = this.sqlQuery;
        sqlQuery += ` where routeId=${id}`;

        const result = this.parseRaw(this.databaseHandler.exec(sqlQuery));
        return result[0];
      });
  }

  public update(model: Route): Promise<Route> {
    const isNew = model.id === undefined;
    let sqlQuery: string;

    if (isNew) { // model exists in database
      sqlQuery = model.insertQuery();
    } else { // create a new one
      sqlQuery = model.updateQuery();
    }

    return Promise.resolve()
      .then(() => {
        this.databaseHandler.run(sqlQuery);
        if (isNew) {
          model.id = this.databaseHandler.getLastRowId();
        }
        return model;
      });
  }

  public remove(id: any): Promise<void> {
    const sqlQuery: string = `delete from Timings where routeId = ${id} `;
    return Promise.resolve()
      .then(() => { this.databaseHandler.run(sqlQuery); });
  }

  public getMany(query?: IQuery): Promise<{ data: Route[], count: number }> {
    return Promise.resolve()
      .then(() => {
        const data = this.parseRaw(this.databaseHandler.exec(this.sqlQuery));
        return {
          count: data.length,
          data,
        };
      });
  }

  public updateRouteItem(item: RouteItem, index: number) {
    const sqlQuery = `update Timings
        set stationId = ${ item.station.id}, comId = ${item.command.id},
        [index] = ${ index}, time = ${item.time}
        where id = ${ item.id} `;

    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery));
  }

  private parseRaw(result: any[]): Route[] {
    const data = orderByDesc(result, 'index');
    const routes: Route[] = [];
    data.map((item) => {
      const match = routes.find((route) => route.id === item.routeId);
      const routeItem: RouteItem = {
        id: item.id,
        station: new Station(item.stationId, item.stationName),
        command: new Command(item.comAttr, item.comDescription, item.comId),
        time: new Time(item.time)
      };
      if (match) {
        match.items.push(routeItem);
      } else {
        routes.push(new Route([routeItem], item.name, item.routeId));
      }
    });
    return routes;
  }
}

export default RoutesService;

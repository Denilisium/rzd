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
  private readonly databaseHandler = new DatabaseHandler();
  private readonly sqlFullQuery = `
          select  
            t.route as name,
            t.timeShedule as time,
            t.id as id,
            t.stationId, 
            s.name as stationName, 
            t.comId, 
            com.attr as comAttr, 
            com.description as comDescription
          from Timings t
          join Stations s on s.id = t.stationId
          join Commands com on com.id = t.comId
  `;
  private readonly sqlQuery = `
          select
            distinct
            t.routeId as id,
            t.route as name
          from Timings t
  `;

  public get(name?: string): Promise<Route> {
    return Promise.resolve()
      .then(() => {
        let sqlQuery = this.sqlFullQuery;
        sqlQuery += ` where route='${name}'`;
        return this.databaseHandler.exec(sqlQuery);
      })
      .then((response) => {
        const result = this.parseRawFull(response);
        return result[0];
      });
  }

  public getUnique(): Promise<Route[]> {
    return Promise.resolve()
      .then(() => {
        let sqlQuery = this.sqlQuery;
        return this.databaseHandler.exec(sqlQuery);
      })
      .then((response: any[]) => {
        return response.map((item) => new Route([], item.name));
      });
  }

  public update(model: Route): Promise<Route> {
    let sqlQuery = model.insertQuery();

    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery))
      .then(() => model);
  }

  public remove(id: any): Promise<void> {
    const sqlQuery: string = `delete from Timings where routeId = ${id} `;
    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery));
  }

  public getMany(query?: IQuery): Promise<{ data: Route[], count: number }> {
    return Promise.resolve()
      .then(() => {
        return this.databaseHandler.exec(this.sqlFullQuery);
      })
      .then((res) => {
        const data = this.parseRawFull(res);
        return {
          data,
          count: data.length,
        };
      });
  }

  public updateRouteItem(item: RouteItem, index: number): Promise<void> {
    const sqlQuery = `update Timings
        set stationId = ${ item.station.id}, comId = ${item.command.id},
        [index] = ${ index}, time = ${item.time}
        where id = ${ item.id} `;

    return Promise.resolve()
      .then(() => this.databaseHandler.run(sqlQuery));
  }

  /**
   * Checks if 'name' is free for naming a new route or renaming existing one
   * @param name of route
   */
  public checkNameReservation(name: string) {
    const sqlQuery = `select count(*) as count from Timings where route='${name}'`;
    return this.databaseHandler.exec(sqlQuery)
      .then((items: any[]) => items[0].count > 0);
  }

  private parseRawFull(result: any[]): Route[] {
    const data = orderByDesc(result, 'index');
    const routes: Route[] = [];
    data.map((item) => {
      const match = routes.find((route) => route.name === item.name);
      const routeItem: RouteItem = {
        id: item.id,
        station: new Station(item.stationId, item.stationName),
        command: new Command(item.comAttr, item.comDescription, item.comId),
        time: new Time(item.time)
      };
      if (match) {
        match.items.push(routeItem);
      } else {
        routes.push(new Route([routeItem], item.name));
      }
    });

    return routes;
  }
}

export default RoutesService;

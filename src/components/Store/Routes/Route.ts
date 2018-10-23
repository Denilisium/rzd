import RouteItem from './RouteItem/RouteItem';

class Route {
  constructor(
    public items: RouteItem[],
    public name: string,
    public id?: number,
  ) { }

  public get from(): string {
    return this.items[0].station.name;
  }

  public get to(): string {
    const lastItemIndex = this.items.length - 1;
    return this.items[lastItemIndex].station.name;
  }

  public get duration(): string {
    const lastItemIndex = this.items.length - 1;
    return this.items[lastItemIndex].time.toString();
  }

  public insertQuery() {
    const sqlQuery = `insert into Timings(route, nop, fromStationId, 
      stationId, timeNorm, timeShedule, index, routeId, comId) values `;

    const firstItem = this.items[0];
    let previousStationId = firstItem.station.id;
    let previousTime = firstItem.time;

    const values: string[] = [];
    this.items.map((item, index) => {
      values.push(
        ` ('${this.name}', '${item.command.id}', '${previousStationId}',
        '${item.station.id}', ${item.time}', '${item.time.diff(previousTime)}', 
        '${index}', '${this.id}', '${item.command.id}')`
      );
      previousStationId = item.station.id;
      previousTime = item.time;
    });

    return sqlQuery + values.join(',');
  }

  public updateQuery() {
    return `update Timings
            set route = '${this.name}'
            where routeId = ${this.id}`;
  }
}

export default Route;
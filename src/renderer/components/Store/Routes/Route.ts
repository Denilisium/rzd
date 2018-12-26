import RouteItem from './RouteItem/RouteItem';
import Time from './../../../common/Time';

class Route {
  constructor(
    public items: RouteItem[],
    public name: string,
  ) { }

  public get from(): string {
    return this.items[0].station.name;
  }

  public get to(): string {
    const lastItemIndex = this.items.length - 1;
    return this.items[lastItemIndex].station.name;
  }

  public get duration(): string {
    const max = Math.max(...this.items.map((item) => item.time.totalMinutes));
    return Time.buildFromMinutes(max).toString();
  }

  public insertQuery() {
    const sqlQuery = `insert into Timings(route, [index], nop, fromStationId, 
      stationId, timeNorm, timeShedule, comId) values `;

    const firstItem = this.items[0];
    let previousStationId = firstItem.station.id;
    let previousTime = firstItem.time;

    const values: string[] = [];
    this.items.map((item, index) => {
      values.push(
        ` ('${this.name}', '${index + 1}', '${item.command.id}', '${previousStationId}',
        '${item.station.id}', '${item.time}', '${item.time.diff(previousTime)}', 
        '${item.command.id}')`
      );
      previousStationId = item.station.id;
      previousTime = item.time;
    });

    return sqlQuery + values.join(',');
  }
}

export default Route;
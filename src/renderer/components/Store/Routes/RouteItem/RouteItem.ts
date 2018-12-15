import Station from '../../Stations/Station';
import Command from '../../Commands/CommandModel';
import Time from '../../../../common/Time';

class RouteItem {
  public id?: number;
  public station: Station;
  public command: Command;
  public time: Time = new Time();

  // public removeSqlQuery() {
  //   return `delete from Timings where id=${this.id}`;
  // }

  // public updateSqlQuery(routeId, index) {
  //   if (this.id===undefined) {
  //     return `insert into Timings()`
  //   }
  //   return `update Timings
  //             set stationId=${this.station.id}, commandId=${this.command.id}
  //           where id=${this.id}`
  // }

  // public updateIndexSqlQuery(index: number) {
  //   return `update Timings
  //             set index=${index}
  //           where id=${this.id}`
  // }
}

export default RouteItem;

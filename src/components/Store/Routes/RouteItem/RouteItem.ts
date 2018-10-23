import Station from '../../Stations/Station';
import Command from '../../Commands/CommandModel';
import Time from '../../../../common/Time';

class RouteItem {
  public id?: number;
  public station: Station;
  public command: Command;
  public time: Time = new Time();
}

export default RouteItem;

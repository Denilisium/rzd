export default class Traffic {
  public static buildQuery(stationIds: number[]) {
    return `select stationId as cstation, 
                  fromStationId as fromStation,
                  trainNum as vagon,
                  strftime('%s', actualDepartureDateTime) as time_in_hour,
                  carsCount as countcars
     from Traffic
     where fromStationId <> stationId AND stationId in (${stationIds.join(',')})`;
  }

  public cstation: number;
  public fromStation: number;
  public time_in_hour: number;
  public norm_in_hour: number;
  public vagon: number;
  public countcars: number;
}
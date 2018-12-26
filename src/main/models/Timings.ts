export default class Timings {
  public static buildQuery(routeName: string) {
    return `select stationId, 
                  fromStationId, 
                  timestamp from Timings where route='${routeName}' AND fromStationId <> stationId`
  }

  public stationId: number;
  public fromStationId: number;
  public timestamp: number;
}
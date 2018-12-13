export default class Timings {
  public static buildQuery(routeId: number) {
    return `select stationId, 
                  fromStationId, 
                  timestamp from Timings where routeId=${routeId} AND fromStationId <> stationId`
  }

  public stationId: number;
  public fromStationId: number;
  public timestamp: number;
}
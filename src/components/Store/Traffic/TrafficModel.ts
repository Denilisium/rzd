class TrafficModel {
  constructor(
    public id: number,
    public trainNum: number,
    public stationLoad: number,
    public departureDeateTime: string,
    public carsCount: number,
    public trainId: string,
    public cop: string,
    public cop2: string,
    public nop: string,
    public fromStationId: number,
    public stationId: number,
    public stationName: string,
    public actualDepartureDateTime: string) { }
}



export default TrafficModel;

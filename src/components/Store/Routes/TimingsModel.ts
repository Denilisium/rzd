import Station from '../Stations/Station';

class TimingsModel {
  constructor(
    public stationFrom: Station,
    public stationTo: Station,
    public timeDelta: Date,
    public timeSchedule: Date,
  ) { }
}

export default TimingsModel;
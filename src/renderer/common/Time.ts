class Time {
  public static sum(...args: Time[]) {
    return args.reduce((prev: Time, curr) => {
      return prev.sum(curr);
    }, new Time());
  }

  public static buildFromMinutes(minutes: number) {
    const hours = Math.trunc(minutes / 60);
    const _minutes = Math.abs(minutes % 60);
    return new Time(hours, _minutes);
  }


  // tslint:disable-next-line:variable-name
  private _hours: number = 0;
  // tslint:disable-next-line:variable-name
  private _minutes: number = 0;

  constructor(...args: any[]) {
    if (args.length === 1 && typeof args[0] === 'string') {
      this.set(args[0]);
    }
    if (args.length === 2 && args.every((arg) => typeof arg === 'number')) {
      this.hours = args[0];
      this.minutes = args[1];
    }
  }

  public get hours() {
    return this._hours;
  }

  public set hours(value: number) {
    this._hours = value;
  }

  public get totalMinutes() {
    let value = this.minutes;
    if (this._hours > 0) {
      value += this._hours * 60;
    }

    return value;
  }

  public get minutes() {
    return this._minutes;
  }

  public set minutes(value: number) {
    if (value < 0 || value > 59) {
      throw new Error(`Minutes must be between 0 and 59. Value ${value} is incorrect`);
    }
    this._minutes = value;
  }

  public sum(time: Time): Time {
    return Time.buildFromMinutes(this.totalMinutes + time.totalMinutes);
  }

  public diff(time: Time): Time {
    return Time.buildFromMinutes(this.totalMinutes - time.totalMinutes);
  }

  public toString() {
    return `${this.f(this.hours)}:${this.f(this.minutes)}`;
  }


  /**
   * Converts number to 00 pattern
   */
  private f(value: number) {
    return Math.abs(value) < 10 ? '0' + value : value;
  }

  // private safeCreate(hours: number, minutes: number): Time {
  //   let sufeHours = hours;
  //   let safeMinutes = minutes;

  //   sufeHours += Math.trunc(safeMinutes / 60);
  //   safeMinutes = Math.abs(safeMinutes % 60);

  //   return new Time(sufeHours, safeMinutes);
  // }

  private set(value: string) {
    const matches = value.match(/[0-9]+/g);
    if (matches) {
      this.hours = Number.parseInt(matches[0], 10);
      this.minutes = Number.parseInt(matches[1], 10);
    }
  }
}

export default Time;
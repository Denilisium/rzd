export default class Output {
  public static success(body: any) {
    return new Output(200, body);
  }

  public static error(body: any, code: number = 400) {
    return new Output(code, body);
  }

  constructor(
    public code: number,
    public body: any) {

  }

  public get isSuccess() {
    return this.code === 200;
  }

  public get isFail() {
    return this.code === 400;
  }
}
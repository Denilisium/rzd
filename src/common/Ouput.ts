export default class Output {
  public static success(body: any) {
    return new Output(200, body);
  }

  public static error(body: any, code?: number = 400) {
    return new Output(body, code);
  }

  constructor(
    public code: number,
    public body: any) {

  }
}
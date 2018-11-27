export default class Package {
  public id: number;
  public channel: string;
  constructor(
    public body: any
  ) {
    this.id = Date.now();
  } 
}
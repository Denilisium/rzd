class Package {
  public id: string;
  constructor(
    public action: string,
    public payload?: any,
    public fail?: boolean,
  ) {
    this.id = '_' + Math.random().toString(36).substr(2, 9);
  };
}

export default Package;


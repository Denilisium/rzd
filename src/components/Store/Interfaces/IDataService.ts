import IQuery from './IQuery';

interface IDataService<T> {
  get(id?: any): Promise<T>;
  update(model: T): Promise<T>;
  remove(id: any): Promise<void>;

  getMany(query: IQuery): Promise<{ data: T[], count: number }>;
}

export default IDataService;

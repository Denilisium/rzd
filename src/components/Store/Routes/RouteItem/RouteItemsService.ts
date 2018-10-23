import IDataService from '../../Interfaces/IDataService';
import RouteItem from './RouteItem';
import IQuery from '../../Interfaces/IQuery';

class RouteItemsService implements IDataService<RouteItem> {
  public get(id?: any): Promise<RouteItem> {
    throw new Error('Method not implemented.');
  }

  public update(model: RouteItem): Promise<RouteItem> {
    throw new Error('Method not implemented.');
  }

  public remove(id: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public getMany(query: IQuery): Promise<{ data: RouteItem[], count: number }> {
    throw new Error('Method not implemented.');
  }
}

export default RouteItemsService;
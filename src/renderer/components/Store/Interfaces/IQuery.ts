import { IOrder } from './IOrder';
import IFilter from './IFilter';

interface IQuery {
  orders?: IOrder[];
  filters?: IFilter[];
  distinct?: boolean;
  skip?: number;
  take?: number;
}

export default IQuery;
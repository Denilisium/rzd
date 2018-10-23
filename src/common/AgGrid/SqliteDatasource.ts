import { IDatasource, IGetRowsParams } from 'ag-grid-community';
import IDataService from '../../components/Store/Interfaces/IDataService';
import Query from '../../components/Store/Models/Query';
import IFilter from 'src/components/Store/Interfaces/IFilter';
import { IOrder, OrderType } from 'src/components/Store/Interfaces/IOrder';

class SqliteDatasource<T> implements IDatasource {
  public rowCount?: number | undefined;

  constructor(
    private service: IDataService<T>
  ) {

  }

  public getRows(params: IGetRowsParams): void {
    const query = new Query();
    query.skip = params.startRow;
    query.take = params.endRow - params.startRow;
    if (params.filterModel) {
      query.filters = [];
      for (const key of params.filterModel) {
        query.filters.push({
          field: key,
          pattern: params.filterModel[key].filter,
        } as IFilter);
      }
    }
    if (params.sortModel && params.sortModel instanceof Array) {
      query.orders = params.sortModel.map((item) => {
        const sort: string = item.sort.toUpper();
        return {
          field: item.colId,
          pattern: OrderType[sort]
        } as IOrder;
      });
    }

    this.service.getMany(query).then((result) => {
      params.successCallback(result.data, result.count);
    });
  }
}

export default SqliteDatasource;
import { IDatasource, IGetRowsParams } from 'ag-grid-community';
import IDataService from '../../components/Store/Interfaces/IDataService';
import Query from '../../components/Store/Models/Query';
import IFilter from '../../components/Store/Interfaces/IFilter';
import { IOrder } from '../../components/Store/Interfaces/IOrder';

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
    query.filters = [];
    query.orders = [];
    if (params.filterModel) {
      Object.keys(params.filterModel).map((key) => {
        query.filters!.push({
          field: key,
          pattern: params.filterModel[key].filter,
        } as IFilter);
      });
    }
    if (params.sortModel && params.sortModel instanceof Array) {
      query.orders = params.sortModel.map((item) => {
        const pattern = item.sort.toUpperCase();
        return {
          field: item.colId,
          pattern,
        } as IOrder;
      });
    }

    this.service.getMany(query).then((result) => {
      params.successCallback(result.data, result.count);
    });
  }
}

export default SqliteDatasource;
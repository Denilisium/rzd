import IQuery from '../Interfaces/IQuery';
import { IOrder } from '../Interfaces/IOrder';
import IFilter from '../Interfaces/IFilter';

class Query implements IQuery {
  constructor(
    public orders?: IOrder[],
    public filters?: IFilter[],
    public distinct?: boolean,
    public skip?: number,
    public take?: number,
  ) { }

  public toSQL(table: string) {
    const distinct = this.distinct ? ' distinct ' : '';
    let sql = `select ${distinct} * from ${table}`;

    if (this.take !== undefined && this.skip !== undefined) {
      sql += this.implementRange();
    }

    if (this.filters && this.filters.length > 0) {
      sql += this.implementFilters();
    }

    if (this.orders && this.orders.length > 0) {
      sql += this.implementOrders();
    }

    return sql;
  }

  public toSQLCount(table: string) {
    const sql = this.toSQL(table);
    return sql.replace(' * from', 'count(*) as count from');
  }

  public implementFilters() {
    let sql = ' WHERE ';
    const filters = this.filters!.map((item) => `${item.field} LIKE *${item.pattern}*`);
    sql += filters.join(' AND ');
    return sql;
  }

  public implementOrders() {
    const order = this.orders![0];
    return ` ORDER BY ${order.field} ${order.pattern.toString()}`;
  }

  public implementRange() {
    return ` LIMIT ${this.take} OFFSET ${this.skip}`;
  }
}

export default Query;

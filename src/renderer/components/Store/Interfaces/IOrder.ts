interface IOrder {
  field: string;
  pattern: OrderType;
}

enum OrderType { ASC, DESC }

export { IOrder, OrderType };


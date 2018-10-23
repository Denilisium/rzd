import * as React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

interface IParams extends ICellRendererParams {
  edit: (params: any) => void;
  remove: (params: any) => void;
}


class EditCellRenderer extends React.Component<IParams, {}> {

  constructor(props: IParams) {
    super(props);

    this.edit = this.edit.bind(this);
    this.remove = this.remove.bind(this);
  }

  public refresh(params: any): boolean {
    return true;
  }

  public render() {
    return (
      <div>
        <span className="btn" onClick={this.edit} title="Изменить">
          <i className="fas fa-pen" />
        </span>
        {this.props.remove ? <span className="btn" onClick={this.remove} title="Удалить">
          <i className="fas fa-trash" />
        </span> : null}
      </div>
    );
  }

  private edit() {
    this.props.edit(this.props.node.data);
  }

  private remove() {
    this.props.remove(this.props.node.data);
  }
}

export default EditCellRenderer;

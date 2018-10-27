import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridOptions } from 'ag-grid-community';
import RoutesService from './RoutesService';
import Route from './Route';
import EditCellRenderer from 'src/common/AgGrid/EditCellRenderer';
import { History } from 'history';

import './Routes.css';

interface IProps {
  history: History;
}

class Routes extends React.Component<IProps, {}> {
  public gridOptions: GridOptions;

  private routesService: RoutesService = new RoutesService();

  private fileInput = React.createRef<HTMLInputElement>();

  constructor(props: IProps) {
    super(props);

    this.gridOptions = {
      columnDefs: [
        {
          headerName: 'Name',
          field: 'name',
        },
        {
          headerName: 'From',
          field: 'from',
        },
        {
          headerName: 'To',
          field: 'to',
        },
        {
          headerName: 'Duration',
          field: 'duration',
        },
        {
          headerName: 'Edit',
          cellRendererFramework: EditCellRenderer,
          cellRendererParams: {
            edit: this.edit.bind(this)
          }
        }
      ],
      onGridReady: (params) => {
        this.getItems()
          .then((items: any) => {
            params.api.setRowData(items.data);
            params.columnApi.autoSizeAllColumns();
          });
      }
    };

    this.import = this.import.bind(this);
    this.createNew = this.createNew.bind(this);
    this.edit = this.edit.bind(this);
    this.update = this.update.bind(this);
  }

  public getItems() {
    return this.routesService.getMany()
      .catch((err) => {
        window.console.log(err);
      });
  }

  public createNew() {
    this.props.history.push(`/store/routes/edit/`);
  }

  public update() {
    this.getItems()
      .then((items: any) => {
        this.gridOptions.api!.setRowData(items.data);
      });
  }

  public edit(route: Route) {
    this.props.history.push(`/store/routes/edit/${route.id}`);
  }

  public import() {
    this.fileInput.current!.click();
  }

  public render() {
    return (
      <React.Fragment>
        <div className="top-page-menu-container">
          <button type="button" className="btn" onClick={this.update} title="Обновить">
            <i className="fas fa-sync-alt" />
          </button>
          <button type="button" className="btn" onClick={this.createNew} title="Добавить новый">
            <i className="fas fa-plus" />
          </button>
          <button type="button" className="btn" onClick={this.import} title="Импортировать">
            <i className="fas fa-file-import" />
          </button>
        </div>
        <div className="page-grid-container ag-theme-material tile">
          <AgGridReact
            gridOptions={this.gridOptions} />
        </div>
        <input style={{ display: 'none' }} type="file" ref={this.fileInput} />
      </React.Fragment>
    );
  }
}

export default Routes;
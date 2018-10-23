import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridOptions } from 'ag-grid-community';

import StationsService from './StationsService';
import EditCellRenderer from '../../../common/AgGrid/EditCellRenderer';
import Station from './Station';
import EditStation from './EditStation';

// interface IProps {

// }

interface IState {
  openModal: boolean;
  current?: Station;
}

class Commands extends React.Component<{}, IState> {
  public state: IState = {
    openModal: false,
  };

  private gridOptions: GridOptions;

  private stationsService: StationsService;

  constructor(props: {}) {
    super(props);

    this.stationsService = new StationsService();

    this.gridOptions = {
      columnDefs: [
        {
          headerName: 'Id',
          field: 'id',
        }, {
          headerName: 'Code',
          field: 'name',
        }, {
          headerName: 'Edit',
          cellRendererFramework: EditCellRenderer,
          cellRendererParams: {
            edit: this.edit.bind(this),
            remove: this.remove.bind(this),
          }
        }
      ],
      onGridReady: (params) => {
        this.getItems()
          .then((items: any) => {
            params.api.setRowData(items.data);
            params.columnApi.autoSizeAllColumns();
          });
      },
      getRowNodeId: (node) => node.id,
      enableColResize: true,
      enableFilter: true,
      enableSorting: true,
    };

    this.modalReject = this.modalReject.bind(this);
    this.modalResolve = this.modalResolve.bind(this);
    this.update = this.update.bind(this);
    this.create = this.create.bind(this);
  }

  public get gridApi() {
    return this.gridOptions.api!;
  }

  public create() {
    const newModel: Station = {
      id: '',
      name: ''
    };
    this.setState({ current: newModel, openModal: true });
  }

  public edit(command: Station) {
    this.setState({
      openModal: true,
      current: command,
    });
  }

  public remove(command: Station) {
    this.stationsService.remove(command.id)
      .then(() => {
        this.removeRowNode(command);
      });
  }

  public modalResolve(entity: Station) {

    this.stationsService.update(entity)
      .then((persisted) => {
        this.setState({ openModal: false });
        this.updateRowNode(persisted, entity.id === undefined);
      })
      .catch((error) => {
        window.console.error(error);
      });
  }

  public modalReject() {
    this.setState({
      openModal: false,
      current: undefined
    });
  }

  // public componentDidMount() {

  // }

  // public componentWillUnmount() {
  // }

  public getItems() {
    return this.stationsService.getMany()
      .catch((err) => {
        window.console.log(err);
      });
  }

  public update() {
    this.getItems()
      .then((result: any) => {
        this.gridApi.setRowData(result.data);
      });
  }

  public render() {
    const showModal = this.state.openModal && this.state.current;

    return (
      <React.Fragment>
        <div className="top-page-menu-container">
          <button type="button" className="btn" onClick={this.update} title="Обновить">
            <i className="fas fa-sync-alt" />
          </button>
          <button type="button" className="btn" onClick={this.create} title="Добавить новый">
            <i className="fas fa-plus" />
          </button>
          <button type="button" className="btn" title="Импортировать">
            <i className="fas fa-file-import" />
          </button>
        </div>
        <div className="page-grid-container ag-theme-material">
          <AgGridReact
            gridOptions={this.gridOptions} />
        </div>
        {showModal &&
          <EditStation
            reject={this.modalReject}
            resolve={this.modalResolve}
            entity={this.state.current!} />}
      </React.Fragment>
    );
  }

  private updateRowNode(command: Station, isNew: boolean = false) {
    const action = isNew ? 'add' : 'update';
    this.gridApi.updateRowData({ [action]: [command] });
  }

  private removeRowNode(command: Station) {
    this.gridApi.updateRowData({ remove: [command] });
  }
}

export default Commands;



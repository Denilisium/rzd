import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridOptions } from 'ag-grid-community';

import CommmandsService from './CommandsService';
import EditCellRenderer from '../../../common/AgGrid/EditCellRenderer';
import Command from './CommandModel';
import EditCommand from './EditCommand';

// interface IProps {

// }

interface IState {
  openModal: boolean;
  current?: Command;
}

class Commands extends React.Component<{}, IState> {
  public state: IState = {
    openModal: false,
  };

  private gridOptions: GridOptions;

  private commandsService: CommmandsService;

  constructor(props: {}) {
    super(props);

    this.commandsService = new CommmandsService();

    this.gridOptions = {
      columnDefs: [
        {
          headerName: 'Id',
          field: 'id',
        }, {
          headerName: 'Attribute',
          field: 'attr',
        }, {
          headerName: 'Description',
          field: 'description'
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
          .then((result: any) => {
            this.gridApi.setRowData(result.data);
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

  public update() {
    this.getItems()
      .then((result: any) => {
        this.gridApi.setRowData(result.data);
      });
  }

  public create() {
    const newModel: Command = {
      attr: '',
      description: ''
    };
    this.setState({ current: newModel, openModal: true });
  }

  public edit(command: Command) {
    this.setState({
      openModal: true,
      current: command,
    });
  }

  public remove(command: Command) {
    this.commandsService.remove(command.id)
      .then(() => {
        this.removeRowNode(command);
      });
  }

  public modalResolve(entity: Command) {

    this.commandsService.update(entity)
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
    return this.commandsService.getMany()
      .catch((err) => {
        window.console.log(err);
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
          <EditCommand
            reject={this.modalReject}
            resolve={this.modalResolve}
            entity={this.state.current!} />}
      </React.Fragment>
    );
  }

  private updateRowNode(command: Command, isNew: boolean = false) {
    const action = isNew ? 'add' : 'update';
    this.gridApi.updateRowData({ [action]: [command] });
  }

  private removeRowNode(command: Command) {
    this.gridApi.updateRowData({ remove: [command] });
  }
}

export default Commands;



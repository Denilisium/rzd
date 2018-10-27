import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridOptions } from 'ag-grid-community';
import TrafficService from './TrafficService';
import Query from '../Models/Query';
import SqliteDatasource from 'src/common/AgGrid/SqliteDatasource';

// interface IProps {

// }

class Traffic extends React.Component<{}, {}> {
  private gridOptions: GridOptions;

  private fileInput = React.createRef<HTMLInputElement>();

  private trafficService: TrafficService;

  constructor(props: {}) {
    super(props);

    this.trafficService = new TrafficService();

    const datasource = new SqliteDatasource(this.trafficService);

    this.gridOptions = {
      rowModelType: 'infinite',
      datasource,
      columnDefs: [
        {
          headerName: 'Id',
          field: 'id',
        }, {
          headerName: 'Train Number',
          field: 'trainNum',
        }, {
          headerName: 'Station Load',
          field: 'stationLoad'
        }, {
          headerName: 'Departure DeateTime',
          field: 'departureDateTime',
        }, {
          headerName: 'Cars Count',
          field: 'carsCount',
        }, {
          headerName: 'TrainId',
          field: 'trainId',
        }, {
          headerName: 'COP',
          field: 'cop',
        }, {
          headerName: 'COP2',
          field: 'cop2',
        }, {
          headerName: 'NOP',
          field: 'nop',
        }, {
          headerName: 'From Station Id',
          field: 'fromStationId',
        }, {
          headerName: 'Station Id',
          field: 'stationId',
        }, {
          headerName: 'Station Name',
          field: 'stationName',
        }, {
          headerName: 'Actual Departure DateTime',
          field: 'actualDepartureDateTime',
        }
      ],
      onGridReady: (params) => {
        params.columnApi.autoSizeAllColumns();
      },
      getRowNodeId: (node) => node.id,
      enableColResize: true,
      enableFilter: true,
      enableServerSideFilter: true,
      enableServerSideSorting: true,
      enableSorting: true,
    };

    this.update = this.update.bind(this);
    this.import = this.import.bind(this);
  }

  public get gridApi() {
    return this.gridOptions.api!;
  }

  public getItems() {
    return this.trafficService.getMany(new Query())
      .catch((err) => {
        window.console.log(err);
      });
  }

  public update() {
      this.gridApi.setRowData([]);
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
          <button type="button" className="btn" title="Импортировать" onClick={this.import}>
            <i className="fas fa-file-import" />
          </button>
        </div>
        <div className="page-grid-container ag-theme-material">
          <AgGridReact
            gridOptions={this.gridOptions} />
        </div>
        <input style={{ display: 'none' }} type="file" ref={this.fileInput} />
      </React.Fragment>
    );
  }

}

export default Traffic;



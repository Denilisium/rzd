import * as React from 'react';
import { remote } from 'electron';
import PredictionService from './PredictionService';
import Route from '../Store/Routes/Route';
import RoutesService from '../Store/Routes/RoutesService';
import Select from 'react-select';

import './Prediction.css';

interface IState {
  canRun: boolean;
  routes: Route[];
  output: string;
}

class Prediction extends React.Component<{}, IState> {
  public state: IState = {
    canRun: false,
    routes: [],
    output: '',
  };

  private service: PredictionService;
  private routeService: RoutesService;

  private scriptPath: string;
  private sqlQuery: string;
  private selectedRoute: Route;

  constructor(props: {}) {
    super(props);
    this.service = new PredictionService();
    this.routeService = new RoutesService();
  }

  private setCanRun() {
    this.setState({ canRun: this.selectedRoute !== undefined && this.scriptPath !== '' });
  }

  public componentDidMount() {
    this.routeService.getUnique()
      .then((items) => this.setState({ routes: items }));
  }

  public onRouteChange = (selectedRoute: Route) => {
    this.selectedRoute = selectedRoute;
    this.setCanRun();
  }

  public run = () => {
    if (this.scriptPath && this.selectedRoute) {
      this.service.run(this.scriptPath, this.selectedRoute.id!, this.sqlQuery)
        .then((res) => {
          this.setState({ output: res });
        });
    }
  }

  public import = () => {
    const paths = remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Script', extensions: ['r'] }] });
    if (paths && paths.length > 0) {
      this.scriptPath = paths[0];
    } else {
      this.scriptPath = '';
    }
    this.setCanRun();
  }

  public render() {
    return (
      <div className="prediction-page">
        <div className="route">
          <Select
            onChange={this.onRouteChange}
            getOptionLabel={(item) => item.name}
            getOptionValue={(item) => item.id!.toString()}
            options={this.state.routes}
          ></Select>
        </div>
        <div className="sql-query">
          <textarea name="sql" id="sql" cols={30} rows={10} placeholder="Where ... (can be empty)"></textarea>
        </div>
        <div className="buttons">
          <button type="button" className="btn" onClick={this.import}>Load script</button>
          <button type="button" onClick={this.run} disabled={this.state.canRun !== true} className="btn">Run</button>
        </div>
        <div className="output">
          {this.state.output}
        </div>
      </div>
    );
  }


}

export default Prediction;



import * as React from 'react';
import { remote } from 'electron';
import PredictionService from './PredictionService';
import { Typeahead } from 'react-bootstrap-typeahead';
import Route from '../Store/Routes/Route';
import RoutesService from '../Store/Routes/RoutesService';

import './Prediction.css';

interface IState {
  canRun: boolean;
  selectedRoute?: number;
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

  constructor(props: {}) {
    super(props);
    this.service = new PredictionService();
    this.routeService = new RoutesService();
  }

  public componentDidMount() {
    this.routeService.getUnique()
      .then((items) => this.setState({ routes: items }));
  }

  public onRouteChange = (routers: Route[]) => {
    if (routers.length > 0) {

    }
  }

  public run = () => {
    if (this.scriptPath && this.state.selectedRoute) {
      this.service.run(this.scriptPath, this.state.selectedRoute, this.sqlQuery);
    }
  }

  public import = () => {
    const paths = remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Script', extensions: ['r'] }] });
    if (paths && paths.length > 0) {
      this.scriptPath = paths[0];
      this.setState({ canRun: true });
    } else {
      this.scriptPath = '';
      this.setState({ canRun: false });
    }
  }

  public render() {
    // const options = this.state.routes.map((item) => {
    //   id: item.id;
    //   label: item.name;
    // });
    return (
      <div className="prediction-page">
        <div className="route">
          <Typeahead
            onChange={this.onRouteChange}
            options={[]}
          ></Typeahead>
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



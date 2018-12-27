import * as React from 'react';
import { remote } from 'electron';
import PredictionService from './PredictionService';
import Route from '../Store/Routes/Route';
import RoutesService from '../Store/Routes/RoutesService';
import Select from 'react-select';


import './Prediction.css';
import * as classNames from 'classnames';
import { pendingAnimationService } from '../../common/PedndingAnimation/PendingAnimationService';

interface IState {
  folder: string;
  script: string;
  routes: Route[];
  output: string;
  selectedRoute?: Route;
  pdfPath: string;
}

class Prediction extends React.Component<{}, IState> {
  public state: IState = {
    folder: '',
    script: '',
    routes: [],
    output: '',
    pdfPath: '',
  }

  private service: PredictionService;
  private routeService: RoutesService;

  private sqlQuery: string = '';

  constructor(props: {}) {
    super(props);
    this.service = new PredictionService();
    this.routeService = new RoutesService();
  }

  public componentDidMount() {
    this.routeService.getUnique()
      .then((items) => this.setState({ routes: items }));
  }

  public onRouteChange = (selectedRoute: Route) => {
    this.setState({ selectedRoute });
  }

  public changeSql = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.sqlQuery = value;
  }

  public run = () => {
    this.setState({
      pdfPath: '',
      output: '',
    });
    const animStamp = pendingAnimationService.show();
    this.service.run(this.state.script, this.state.folder, this.state.selectedRoute!.name, this.sqlQuery)
      .then((res) => {
        pendingAnimationService.hide(animStamp);
        this.setState({
          pdfPath: res.pdfPath,
          output: res.info
        });
      });
  }

  public showFolder = () => {
    this.service.openFolder(this.state.folder);
  }

  public selectScript = () => {
    let scriptPath = '';
    const paths = remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Script', extensions: ['r'] }] });
    if (paths && paths.length > 0) {
      scriptPath = paths[0];
    }

    this.setState({ script: scriptPath });
  }

  public selectFolder = () => {
    let path = '';
    const paths = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (paths && paths.length > 0) {
      path = paths[0];
    }

    this.setState({ folder: path });
  }

  public render() {
    const canRun = this.state.selectedRoute && this.state.script !== '' && this.state.folder !== '';

    const scriptBtn = classNames({
      btn: true,
      'btn-success': this.state.script !== '',
    });

    const folderBtn = classNames({
      btn: true,
      'btn-success': this.state.folder !== '',
    });

    return (
      <div className="prediction-page">
        <div className="route">
          <Select
            onChange={this.onRouteChange}
            getOptionLabel={(item) => item.name}
            getOptionValue={(item) => item.name}
            options={this.state.routes}
          ></Select>
        </div>
        <div className="sql-query">
          <textarea onChange={this.changeSql}
            className="form-control" name="sql" id="sql" cols={30} rows={3}
            placeholder="Where ... (can be empty)"></textarea>
        </div>
        <div className="paths">

          <div className="path">
            <button type="button" className={folderBtn} onClick={this.selectFolder}>Work folder</button>
            {this.state.folder}
          </div>
          <div className="path">
            <button type="button" className={scriptBtn} onClick={this.selectScript}>R script</button>
            {this.state.script}
          </div>
        </div>
        <div className="buttons">
          <button type="button" onClick={this.run} disabled={canRun !== true} className="btn btn-primary">Process</button>
          <button type="button" onClick={this.showFolder} disabled={!this.state.folder} className="btn btn-success">Show folder</button>
        </div>
        <div className="output">
          {this.state.output}
        </div>
        {this.state.pdfPath ?
          <div className="output-files">
            <iframe src={this.state.pdfPath} width="900px" height="400px" />
          </div> : null}
      </div>
    );
  }


}

export default Prediction;



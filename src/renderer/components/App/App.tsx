import * as React from 'react';
import { Route, Switch, RouteProps, Redirect } from 'react-router-dom';
import './App.css';

import Home from '../Home/Home';
import NavbarLeft from '../Navbar/NavbarLeft';
import Page from '../Page/Page';
import Database from '../Settings/Database';
import Commands from '../Store/Commands/Commands';
import Stations from '../Store/Stations/Stations';
import Routes from '../Store/Routes/Routes';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Traffic from '../Store/Traffic/Traffic';
import EditRoute from '../Store/Routes/EditRoute';
import Prediction from '../Prediction/Prediction';

interface IState {
  database: { connected: boolean };
}

class App extends React.Component<{}, IState> {

  public state: IState = {
    database: {
      connected: false
    }
  };

  constructor(props: {}, state: IState) {
    super(props);

    this.handleDatabaseConnection = this.handleDatabaseConnection.bind(this);
  }

  public handleDatabaseConnection(connected: boolean) {
    this.setState({
      database: {
        connected
      }
    });
  }

  public database() {
    return (
      (props: RouteProps) => <Database connected={this.state.database.connected}
        onConnected={this.handleDatabaseConnection} />
    );
  }

  public routeEdit() {
    return (
      (props: RouteProps) => (<EditRoute {...props} onMessage={this.showMessage} onPending={this.swithLoadingAnimation} />)
    );
  }

  public showMessage(message: string, level: number) {
    window.console.log(message, level);
  }

  public swithLoadingAnimation(value: boolean) {
    window.console.info(value);
  }

  public render() {
    return (
      <div className="app">
        <header>
          <h1>Railways</h1>
          <div className="status">
            {this.state.database.connected ? <i className="fas fa-plug" /> : null}
          </div>
        </header>
        <aside>
          <NavbarLeft connected={this.state.database.connected} />
        </aside>
        <main>
          <Page>
            <Switch>
              <Route path="/home" exact={true} component={Home} />
              <Route path="/database" exact={true}
                render={this.database()} />
              <Route path="/store/commands" exact={true}
                component={Commands} />
              <Route path="/store/traffic" exact={true}
                component={Traffic} />
              <Route path="/store/stations" exact={true}
                component={Stations} />
              <Route path="/store/routes" exact={true}
                component={Routes} />
              <Route path="/store/routes/edit/:name?" exact={true}
                render={this.routeEdit()} />
              <Route path="/store/prediction" exact={true}
                component={Prediction} />
              <Redirect to="/database" />
            </Switch>
          </Page>
        </main>
      </div>
    );
  }
}

export default App;

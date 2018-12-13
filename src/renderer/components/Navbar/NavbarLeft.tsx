import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

// interface IProps {

// }

interface IProps {
  connected: boolean;
}

class NavbarLeft extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  // public componentDidMount() {
  // }

  // public componentWillUnmount() {
  // }

  public render() {
    const links = <React.Fragment>
      <NavLink to="/store/commands"><i className="fas fa-code" /> Commands</NavLink>
      <NavLink to="/store/stations"><i className="fas fa-map-marker-alt" /> Stations</NavLink>
      <NavLink to="/store/traffic"><i className="fas fa-traffic-light" /> Traffic</NavLink>
      <NavLink to="/store/routes"><i className="fas fa-route" /> Routes</NavLink>
      <NavLink to="/store/prediction"><i className="fas fa-clock" /> Prediction</NavLink>
    </React.Fragment>;

    return (
      <div className="navbar navbar-left">
        <NavLink to="/database"><i className="fas fa-sliders-h" />  Settings</NavLink>
        {/* <div color="red"><i className="fas fa-database" /> Data</div> */}
        {this.props.connected ? links : null}
      </div>
    );
  }
}

export default NavbarLeft;



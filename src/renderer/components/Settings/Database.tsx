import * as React from 'react';
import DatabaseHandler from '../../common/DatabaseHandler';
import { remote } from 'electron';
import './Database.css';

interface IProps {
  onConnected: (val: boolean) => void;
  connected: boolean;
}

class Database extends React.Component<IProps> {
  private database: DatabaseHandler = new DatabaseHandler();

  constructor(props: IProps) {
    super(props);

    this.import = this.import.bind(this);
  }

  public import() {
    const paths = remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Database', extensions: ['db'] }] });
    if (paths && paths.length > 0) {
      this.database.open(paths[0])
      .then(() => { 
        this.props.onConnected(true);
      });
    }
  }

  public render() {
    return (
      <div className="database-page">
        {/* <div className="database-header"> */}
        <div className="buttons">
          <button type="button" className="btn" onClick={this.import}>Import</button>
          <button type="button" disabled={this.props.connected !== true} className="btn">Save</button>
        </div>
        {/* </div>
        <div className="database-body">
          <div className="alert">Database is {this.props.connected ? 'connected' : 'disconected'}</div>
          
        </div> */}
      </div>
    );
  }
}

export default Database;



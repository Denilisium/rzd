import * as React from 'react';
import DatabaseHandler from '../../common/DatabaseHandler';

import './Database.css';

interface IProps {
  onConnected: (val: boolean) => void;
  connected: boolean;
}

class Database extends React.Component<IProps> {
  private database: DatabaseHandler = new DatabaseHandler();

  private fileInput = React.createRef<HTMLInputElement>();

  constructor(props: IProps) {
    super(props);

    this.import = this.import.bind(this);

    this.fileUploaded = this.fileUploaded.bind(this);
  }

  public componentDidMount() {
    this.fileInput.current!.addEventListener('change', this.fileUploaded);
  }

  public componentWillUnmount() {
    this.fileInput.current!.removeEventListener('change', this.fileUploaded);
  }

  public import() {
    this.fileInput.current!.click();
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

  private fileUploaded(e: Event) {
    const files = (e.currentTarget as HTMLInputElement).files;
    this.openDatabase(files)
      .then((connected) => {
        this.props.onConnected(connected);
      });
  }

  private openDatabase(files: FileList | null): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (files && files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {

          const arrayBuffer = reader.result! as ArrayBuffer;
          const array = new Uint8Array(arrayBuffer);
          this.database.open(array);
          resolve(true);
        };
        reader.readAsArrayBuffer(file);
      } else {
        resolve(false);
      }
    });
  }
}

export default Database;



import * as React from 'react';
import Modal from '../../../common/Modal/ Modal';
import Station from './Station';

interface IState {
  id: string;
  name: string;
  [name: string]: any;
}

interface IProps {
  entity: Station;
  resolve: (entity: Station) => void;
  reject: (reason?: any) => void;
}

class EditStation extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { ...this.props.entity };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  public render() {
    const header = this.state.id ? `Row #${this.state.id}` : 'New station';
    return (
      <Modal header={header}
        content={this.modalContent()}
        footer={this.modalFooter()} />
    );
  }

  private modalContent() {
    return (
      <div className="form">
        <div className="form-group">
          <label htmlFor="entityId">Id</label>
          <input required={true}
            id="entityId"
            maxLength={100}
            name="id"
            value={this.state.id}
            onChange={this.handleInputChange}
            className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label htmlFor="name">Code</label>
          <input required={true}
            maxLength={100}
            id="name"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            className="form-control" type="text" />
        </div>
      </div>
    );
  }

  private handleInputChange(event: React.SyntheticEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  private modalFooter() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-success" onClick={this.resolve}>Ok</button>
        <button type="button" className="btn" onClick={this.reject}>Cancel</button>
      </React.Fragment>
    );
  }

  private resolve() {
    if (this.state.id && this.state.name) {
      this.props.resolve({ ...this.state } as Station);
    }
  }

  private reject() {
    this.props.reject();
  }
}

export default EditStation;

import * as React from 'react';
import Command from './CommandModel';
import Modal from '../../../common/Modal/ Modal';

interface IState {
  id?: number;
  attr: string;
  description: string;
  [name: string]: any;
}

interface IProps {
  entity: Command;
  resolve: (entity: Command) => void;
  reject: (reason?: any) => void;
}

class EditCommand extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { ...this.props.entity };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  public render() {
    const header = this.state.id ? `Row #${this.state.id}` : 'New command';
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
          <label htmlFor="attr">Attribute</label>
          <input required={true}
            id="attr"
            name="attr"
            value={this.state.attr}
            onChange={this.handleInputChange}
            className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input required={true}
            id="description"
            name="description"
            value={this.state.description}
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
    if (this.state.attr && this.state.description) {
      this.props.resolve({ ...this.state } as Command);
    }
  }

  private reject() {
    this.props.reject();
  }
}

export default EditCommand;

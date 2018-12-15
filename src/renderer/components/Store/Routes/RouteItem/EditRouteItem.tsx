import * as React from 'react';
import Station from '../../Stations/Station';
import RouteItem from './RouteItem';
import classNames from 'classnames';

// import { Typeahead } from 'react-bootstrap-typeahead';
import Time from '../../../../common/Time';
import Command from '../../Commands/CommandModel';
// import { Typeahead } from 'react-bootstrap-typeahead';

import Select from 'react-select';

interface IProps {
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  readonly: boolean;
  item: RouteItem;
  stations: Station[];
  commands: Command[];
  update: (index: number, model: RouteItem) => void;
  up: (index: number) => void;
  down: (index: number) => void;
  delete: (index: number) => void;
}

class EditRouteItem extends React.Component<IProps, RouteItem> {
  // public static defaultProps: IProps = {
  //   readonly: true,
  //   stations: [],
  //   canMoveDown: false,
  //   canMoveUp: false,
  //   index: 0,
  // };

  constructor(props: IProps) {
    super(props);

    this.state = { ...this.props.item };

    this.changeCommand = this.changeCommand.bind(this);
    this.changeStation = this.changeStation.bind(this);
    this.remove = this.remove.bind(this);
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
  }

  public changeStation(station: Station) {
    if (station) {
      this.setState({ station });
    }
    this.props.update(this.props.index, this.state);
  }

  public changeCommand(command: Command) {
    if (command) {
      this.setState({ command });
    }
    this.props.update(this.props.index, this.state);
  }

  public changeTime = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.setState({ time: new Time(value) });
    this.props.update(this.props.index, this.state);
  }

  public remove(event: React.SyntheticEvent) {
    this.props.delete(this.props.index);
  }

  public up(event: React.SyntheticEvent) {
    this.props.up(this.props.index);
  }

  public down(event: React.SyntheticEvent) {
    this.props.down(this.props.index);
  }

  public render() {
    // const station = this.state.station ? this.state.station.name : '';
    const command = this.state.command;
    const station = this.state.station;

    const timelineClass = classNames({
      timeline: true,
      start: this.props.index === 0,
      // end: this.props.canMoveUp === false,
    });

    return (
      <div className="route-item-container">
        <div className={timelineClass}>
          <div className="timeline-circle" />
        </div>

        <div className="inputs-panel">
          <input type="time" name="time" id="time"
            onChange={this.changeTime}
            className="form-control"
            value={this.state.time.toString()} required={true} />
          {/* <input type="text" name="station" id="station"
            className="form-control"
            value={station} required={true} />
          <input type="text" name="command" id="command"
            className="form-control"
            value={command} required={true} /> */}
          <Select
            className="select-control"
            onChange={this.changeStation}
            getOptionLabel={(item) => item.name}
            getOptionValue={(item) => item.id!.toString()}
            options={this.props.stations}
            value={station}
          />
          <Select
            className="select-control"
            onChange={this.changeCommand}
            getOptionLabel={(item) => item.attr}
            getOptionValue={(item) => item.id!.toString()}
            options={this.props.commands}
            value={command}
          />
        </div>
        <div className="buttons-panel">
          <button type="button" className="btn"
            disabled={!this.props.canMoveUp || this.props.readonly}
            onClick={this.down}
            title="Переместить вверх">
            <i className="fas fa-angle-up" />
          </button>
          <button type="button" className="btn"
            disabled={!this.props.canMoveDown || this.props.readonly}
            onClick={this.up}>
            <i className="fas fa-angle-down" />
          </button>
          <button type="button" className="btn btn-danger"
            disabled={this.props.readonly}
            onClick={this.remove}>
            <i className="fas fa-trash" />
          </button>
        </div>
      </div >
    );
  }
}

export default EditRouteItem;

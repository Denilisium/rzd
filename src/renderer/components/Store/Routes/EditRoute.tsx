import * as React from 'react';
import Route from './Route';
import Station from '../Stations/Station';
import RouteItem from './RouteItem/RouteItem';
import EditRouteItem from './RouteItem/EditRouteItem';
import StationsService from '../Stations/StationsService';
import RoutesService from './RoutesService';
import CommmandsService from '../Commands/CommandsService';
import Command from '../Commands/CommandModel';
import { History } from 'history';
import { match } from 'react-router';

import './RouteItem/EditRouteItem.css';

interface IProps {
  history?: History;
  match?: match;
  onPending: (value: boolean) => void;
  onMessage: (message: string, level: number) => void;
}

interface IState {
  stations: Station[];
  commands: Command[];
  items: RouteItem[];
  name: string;
  id?: number;
}

class EditRoute extends React.Component<IProps, IState> {
  private stationsService = new StationsService();
  private commandsService = new CommmandsService();
  private routesService = new RoutesService();

  constructor(props: IProps) {
    super(props);

    let id = (this.props.match!.params as any).id;
    if (id !== undefined) {
      id = +id;
    }

    this.state = {
      name: '',
      stations: [],
      commands: [],
      items: [] as RouteItem[],
      // ...{
      //   items: [new RouteItem()]
      // } as Route,
      id
    };

    this.putItemDown = this.putItemDown.bind(this);
    this.putItemUp = this.putItemUp.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.updateItem = this.updateItem.bind(this);

    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.back = this.back.bind(this);
  }

  public back() {
    this.props.history!.push(`/store/routes`);
  }

  public componentWillMount() {
    this.stationsService.getMany()
      .then((items) => {
        this.setState({
          stations: items.data
        });
      });

    this.commandsService.getMany({ distinct: true })
      .then((items) => {
        this.setState({
          commands: items.data
        });
      });

    if (this.state.id !== undefined) {
      this.routesService.get(this.state.id)
        .then((route) => {
          this.setState({
            ...route
          });
        });
    }
  }

  public save() {
    const isNew = this.state.id === undefined;
    const route = new Route(this.state.items, this.state.name, this.state.id);
    this.props.onPending(true);
    this.routesService.update(route)
      .then((model) => {
        this.props.onPending(false);
        if (isNew) {
          this.props.onMessage('Создан новый маршрут', 0);
          this.props.history!.push(`/store/routes/`);
        }
      });
  }

  public remove() {
    this.props.onPending(true);
    this.routesService.remove(this.state.id)
      .then((model) => {
        this.props.onPending(false);
        this.props.onMessage('Маршрут успешно удален', 0);
        this.props.history!.push(`/store/routes/`);
      });
  }

  public changeName(event: React.SyntheticEvent) {
    const name = (event.target as HTMLInputElement).value;
    this.setState({
      name,
    });
  }

  public putItemUp(index: number) {
    this.setState((prevState) => {
      const newIndex = index + 1;
      const item = { ...prevState.items[index] };
      if (item && index < prevState.items.length - 1) {
        const items = prevState.items.slice();
        items.splice(newIndex, 0, item);
        items.splice(index, 1);
        return {
          ...prevState,
          items,
        };
      }
      return prevState;
    });
  }

  public putItemDown(index: number) {
    this.setState((prevState) => {
      const newIndex = index - 1;
      const item = { ...prevState.items[index] };
      if (item && index > 0) {
        const items = prevState.items.slice();
        items.splice(index, 1);
        items.splice(newIndex, 0, item);
        return {
          ...prevState,
          items,
        };
      }
      return prevState;
    });
  }

  public deleteItem(index: number) {
    this.setState((prevState) => ({
      ...prevState,
      items: [...prevState.items].splice(index, 1)
    }));
  }

  public addNewItem() {
    this.setState((prevState) => ({
      ...prevState,
      items: [...prevState.items, new RouteItem()]
    }));
  }

  public updateItem(index: number, model: RouteItem) {
    this.setState((prevState) => {
      const items = prevState.items.slice();
      items[index] = { ...model };
      return {
        items,
      };
    });
  }

  public itemKey(item: RouteItem) {
    return item.id;
  }

  public render() {
    const items = this.state.items;
    const isNew = this.state.id === undefined;

    return (
      <React.Fragment>
        <div className="top-page-menu-container">
          <button type="button" className="btn" onClick={this.back} title="Ко всем маршрутам">
            <i className="fas fa-arrow-alt-circle-left" />
          </button>
          <button type="button"
            className="btn"
            onClick={this.save} title="Сохранить">
            <i className="fas fa-save" />
          </button>
          {isNew ? <button type="button"
            className="btn btn-danger"
            title="Удалить"
            onClick={this.remove}>
            <i className="fas fa-trash" /></button> : null}
        </div>
        <div className="route-container tile">
          <div className="name-wrapper">
            <label htmlFor="name">Название: </label>
            <input type="text" value={this.state.name}
              className="form-control"
              name="name" id="name" required={true}
              onChange={this.changeName} />
          </div>
          <div className="items-container">
            {items.map((item, index) => <EditRouteItem
              key={index}
              index={index}
              item={item}
              readonly={false}
              stations={this.state.stations}
              commands={this.state.commands}
              canMoveDown={index < items.length - 1}
              canMoveUp={index > 0}
              update={this.updateItem}
              up={this.putItemUp}
              down={this.putItemDown}
              delete={this.deleteItem}
            />)}
            <div className="route-item-container">
              <div className="timeline optional">
                <div className="timeline-circle" onClick={this.addNewItem}>
                  <i className="fas fa-plus"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditRoute;

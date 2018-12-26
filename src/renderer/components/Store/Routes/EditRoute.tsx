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

  private oldRouteName: string;

  private isNew: boolean = false;

  constructor(props: IProps) {
    super(props);

    let name = (this.props.match!.params as any).name;
    if (name === undefined) {
      this.isNew = true;
    }

    this.oldRouteName = name;

    this.state = {
      name: name || '',
      stations: [],
      commands: [],
      items: [] as RouteItem[],
      // ...{
      //   items: [new RouteItem()]
      // } as Route,
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

    if (this.state.name !== undefined) {
      this.routesService.get(this.state.name)
        .then((route) => {
          this.setState({
            ...route
          });
        });
    }
  }

  public save() {
    const route = new Route(this.state.items, this.state.name);
    this.props.onPending(true);

    return Promise.resolve()
      .then(() => {
        // validation
        if (!this.state.name) {
          throw new Error('Имя маршрута не должно быть пустым');
        }

        if (this.state.items.some((item) => !item.station || !item.command || !item.time)) {
          throw new Error('Проверьте правильность введеных данных');
        }

      })
      .then(() => {
        return this.checkNameNotReserved(route.name)
          .then((res: boolean) => {
            if (res === false) {
              throw new Error(`Маршрут с именем ${route.name} уже зарегестрирован в базе`)
            };
          })
      })
      .then(() => this.isNew !== true ?
        this.routesService.remove(this.state.name) : undefined
      )
      .then(() => this.routesService.update(route))
      .then(() => {
        if (this.isNew) {
          this.props.onMessage('Создан новый маршрут', 0);
          this.props.history!.push(`/store/routes/`);
          return;
        }
        return this.routesService.get(this.state.name)
          .then((route) => {
            this.props.onMessage(`Маршрут ${this.state.name} обновлен`, 0);
            this.props.onPending(false);
            this.setState({
              ...route
            });
          });
      })
      .catch((err: Error) => {
        this.props.onPending(false);
        this.props.onMessage(err.message, 4);
      });
  }

  public remove() {
    this.props.onPending(true);
    this.routesService.remove(this.state.name)
      .then((model) => {
        this.props.onPending(false);
        this.props.onMessage('Маршрут успешно удален', 0);
        this.props.history!.push(`/store/routes/`);
      });
  }

  public changeName = (event: React.SyntheticEvent) => {
    const name = (event.target as HTMLInputElement).value;
    this.setState({
      name,
    });
  }

  public putItemUp(index: number) {
    this.setState((prevState) => {
      const item = prevState.items[index];
      if (item && index < prevState.items.length - 1) {
        const items = prevState.items.slice();
        items.splice(index, 2, prevState.items[index + 1], prevState.items[index]);
        items.map((item, index) => item.id = index + 1);
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
      const item = { ...prevState.items[index] };
      if (item && index > 0) {
        const items = prevState.items.slice();
        items.splice(index - 1, 2, prevState.items[index], prevState.items[index - 1]);
        items.map((item, index) => item.id = index + 1);
        return {
          ...prevState,
          items,
        };
      }
      return prevState;
    });
  }

  public deleteItem(index: number) {
    this.setState((prevState) => {
      const items = prevState.items.slice();
      items.splice(index, 1);
      items.map((item, index) => item.id = index + 1);
      return {
        ...prevState,
        items
      };
    })
  }

  public addNewItem() {
    this.setState((prevState) => {
      const newItem = new RouteItem();
      newItem.id = prevState.items.length + 1;

      return {
        ...prevState,
        items: [...prevState.items, newItem]
      };
    });
  }

  public checkNameNotReserved(name: string): Promise<Boolean> {
    if (this.oldRouteName && name === this.oldRouteName) {
      return Promise.resolve(true);
    }

    return this.routesService.checkNameReservation(name);
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
    const items = this.state.items.sort((a, b) => a.id! - b.id!);
    const isNew = this.state.id === undefined;

    return (
      <React.Fragment >
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
            <label htmlFor="name">Name: </label>
            <input type="text" value={this.state.name}
              className="form-control"
              name="name" id="name" required={true}
              onChange={this.changeName} />
          </div>
          <div className="items-container">
            {items.map((item, index) => <EditRouteItem
              key={item.id}
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
                  <i className="fas fa-plus" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment >
    );
  }
}

export default EditRoute;

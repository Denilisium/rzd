import * as React from 'react';
import IPendingAnimationComponent from './IPendingAnimation';

import './PendingAnimation.css';
import { pendingAnimationService } from './PendingAnimationService';

interface IState {
  show: boolean;
}

class PendingAnimation extends React.Component<{}, IState> implements IPendingAnimationComponent {
  public state: IState = {
    show: true,
  }

  public service = pendingAnimationService;

  constructor(props: {}) {
    super(props);
  }

  public componentDidMount() {
    pendingAnimationService.register(this);
  }

  public componentWillUnmount() {
    pendingAnimationService.unregister();
  }

  public show() {
    this.setState({
      show: true
    });
  }

  public hide() {
    this.setState({
      show: false
    });
  }

  public render() {
    if (this.state.show) {
      return (
        <div className="pending-animation">
          <div className="loader">
            <svg className="circular-loader" viewBox="25 25 50 50" >
              <circle className="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" stroke-width="2" />
            </svg>
          </div>
        </div>
      )
    }

    return null;
  }
}

export default PendingAnimation;



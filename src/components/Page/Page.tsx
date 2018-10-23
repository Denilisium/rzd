import * as React from 'react';

import './Page.css';

class Page extends React.Component<{}> {


  constructor(props: {}) {
    super(props);
  }

  // public componentDidMount() {
  // }

  // public componentWillUnmount() {
  // }

  public render() {
    return (
      <div className="page">
        {this.props.children}
      </div>
    );
  }
}

export default Page;



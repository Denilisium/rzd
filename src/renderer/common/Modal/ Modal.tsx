import * as React from 'react';
import './Modal.css';
import * as ReactDOM from 'react-dom';

interface IProps {
  header: string;
  content?: any;
  footer?: any;
}

const modalRoot = document.querySelector('body')!;

class Modal extends React.Component<IProps> {
  public static defaultProp: IProps = {
    header: 'Title'
  };

  private backRef = React.createRef<HTMLDivElement>();
  private modalRef = React.createRef<HTMLDivElement>();

  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    window.setTimeout(() => {
      this.backRef.current!.classList.add('in');
      this.modalRef.current!.classList.add('in');
    }, 0);
  }

  // public componentWillUnmount() {
  // }

  public render() {
    const modal = (
      <div role="dialog">
        <div className="modal-backdrop" ref={this.backRef} />
        <div className="modal-container">
          <div className="modal" ref={this.modalRef}>
            <div className="modal-header">{this.props.header}</div>
            <div className="modal-content">
              {this.props.content}
            </div>
            <div className="modal-footer">
              {this.props.footer}
            </div>
          </div>
        </div>
      </div>
    );


    return ReactDOM.createPortal(modal, modalRoot);
  }
}

export default Modal;



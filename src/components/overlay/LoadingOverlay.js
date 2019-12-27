import React from 'react';
import ReactDOM from 'react-dom';
import { Spinner } from 'reactstrap';

export default class LoadingOverlay extends React.Component {
    constructor(props) {
      super(props);
      this.el = document.createElement('div');
    }
  
    componentDidMount() {
      const overlayRoot = document.getElementById('overlay-root');
      overlayRoot.appendChild(this.el);
    }
  
    componentWillUnmount() {
        const overlayRoot = document.getElementById('overlay-root');
        overlayRoot.removeChild(this.el);
    }
  
    render() {
      return ReactDOM.createPortal(
        <>
          { 
            this.props.isLoading ? 
            <div className="overlay">
              <Spinner color="primary" />
            </div>
            : null 
            }
        </>,
        this.el,
      );
    }
  }
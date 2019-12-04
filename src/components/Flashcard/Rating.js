import React from 'react';

export default class Rating extends React.Component {
    constructor(props){
      super(props);
    }
  
    render() {
      return (
        <div onClick={this.props.onClick} >
          <span id="star-1" className="fa fa-star"></span>
          <span id="star-2" className="fa fa-star"></span>
          <span id="star-3" className="fa fa-star"></span>
          <span id="star-4" className="fa fa-star"></span>
          <span id="star-5" className="fa fa-star"></span>
        </div>
      );
    }
  }
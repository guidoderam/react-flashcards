import React from 'react';

export default class Rating extends React.Component {
    constructor(props){
      super(props);
    }
  
    render() {
      return (
        <div className="rating" onClick={this.props.onClick} >
          <hr/>
          {/* Order reversed because unicode-bidi direction rtl */}
          <span id="star-5" className="fa fa-star"></span>
          <span id="star-4" className="fa fa-star"></span>
          <span id="star-3" className="fa fa-star"></span>
          <span id="star-2" className="fa fa-star"></span>
          <span id="star-1" className="fa fa-star"></span>
        </div>
      );
    }
  }
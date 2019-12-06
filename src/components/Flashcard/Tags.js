import React from 'react';

export default class Tags extends React.Component {
    render() {
      return (
        <div className="tags">
          {this.props.tags}
        </div>
      );
    }
  }
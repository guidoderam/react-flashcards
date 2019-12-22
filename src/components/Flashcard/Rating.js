import React from 'react';
import { Col, Row } from 'reactstrap';

export default class Rating extends React.Component {
    constructor(props){
      super(props);
    }
  
    render() {
      return (
        <Row className="rating" onClick={this.props.onClick} >
          <Col className="bg-danger">
            <span id="star-1" className="fa fa-frown-o"></span>
          </Col>
          <Col className="bg-warning">
            <span id="star-2" className="fa fa-meh-o"></span>
          </Col>
          <Col className="bg-success">
            <span id="star-3" className="fa fa-smile-o"></span>
          </Col>
        </Row>
      );
    }
  }
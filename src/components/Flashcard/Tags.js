import React from "react";
import { Row, Col, Button } from "reactstrap";

const Tags = props => {
  const tags = props.tags.map(tag => (
    <Col key={tag.id}>
      <Button
        color={props.selected.includes(tag.id) ? "success" : "secondary"}
        onClick={() => props.onClick(tag.id)}
        id={tag.id}
        name={tag.name}
      >
        {tag.name}
      </Button>
    </Col>
  ));

  return <Row className="tags">{tags}</Row>;
};

export default Tags;

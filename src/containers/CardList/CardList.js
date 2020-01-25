import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Table } from "reactstrap";
import truncate from "truncate-html";
import * as ROUTES from "../../constants/routes";

const CardList = props => {
  const { cards } = props;

  let { deckId } = useParams();

  return (
    <>
      {cards && cards.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Front</th>
              <th>Back</th>
              <th style={{ width: "1px" }}>Edit</th>
              <th style={{ width: "1px" }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id}>
                <td>{truncate(card.front, 70, { stripTags: true })}</td>
                <td>{truncate(card.back, 70, { stripTags: true })}</td>
                <td>
                  <Link
                    to={ROUTES.CARD_EDIT.replace(":deckId", deckId).replace(
                      ":cardId",
                      card.id
                    )}
                  >
                    <Button color="secondary">Edit</Button>
                  </Link>
                </td>
                <td>
                  <Button
                    color="danger"
                    data-card={card.id}
                    onClick={props.onDeleteClick}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No cards.</p>
      )}
    </>
  );
};

export default CardList;

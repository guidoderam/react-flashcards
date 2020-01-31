import React from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import truncate from "truncate-html";

const DeckListTable = props => {
  const { decks, onDeleteClick } = props;

  return (
    <>
      {!decks ? (
        <p>Loading...</p>
      ) : decks.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: "1px" }}>Cards</th>
              <th style={{ width: "1px" }}></th>
            </tr>
          </thead>
          <tbody>
            {decks.map(deck => {
              return (
                <tr key={deck.id}>
                  <td>{deck.name}</td>
                  <td>{truncate(deck.description, 50, { stripTags: true })}</td>
                  <td>{deck.cards ? Object.values(deck.cards).length : 0}</td>
                  <td>
                    <Link to={`/decks/edit/${deck.id}`}>
                      <Button color="secondary">Edit</Button>
                    </Link>
                  </td>
                  <td>
                    <Button
                      color="danger"
                      data-deck={deck.id}
                      onClick={onDeleteClick}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p>You haven't created any decks yet.</p>
      )}
    </>
  );
};

export default DeckListTable;

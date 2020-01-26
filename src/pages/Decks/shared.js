import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "reactstrap";
import truncate from "truncate-html";
import { FirebaseContext } from "../../components/Firebase";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import * as ROUTES from "../../constants/routes";

const SharedDecks = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);

  const [decks, setDecks] = useState([]);

  const history = useHistory();

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const handleDeckImport = async deckId => {
    setLoading(true);

    const newDeckId = await firebase.importDeck(deckId);
    setLoading(false);

    const deckRoute = ROUTES.DECK_EDIT.replace(":deckId", newDeckId);
    history.push(deckRoute);
  };

  useEffect(() => {
    const getDecks = async () => {
      setLoading(true);

      const decks = await firebase.getSharedDecks();
      setDecks(decks);
      setLoading(false);
    };

    if (authUser) {
      getDecks();
    }
  }, [authUser, firebase, setLoading]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Shared Decks</h1>
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
              {decks
                ? decks.map(deck => {
                    return (
                      <tr key={deck.id}>
                        <td>{deck.name}</td>
                        <td>
                          {truncate(deck.description, 50, { stripTags: true })}
                        </td>
                        <td>
                          {deck.cards ? Object.values(deck.cards).length : 0}
                        </td>
                        <td>
                          <Button
                            onClick={() => {
                              handleDeckImport(deck.id);
                            }}
                            color="primary"
                          >
                            Import
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthorization()(SharedDecks);

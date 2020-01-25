import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "reactstrap";
import * as ROUTES from "../../constants/routes";
import { FirebaseContext } from "../../components/Firebase";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";

const Train = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);

  const [decks, setDecks] = useState(null);

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const history = useHistory();

  const handleStartBtnClick = e => {
    const deckId = e.target.dataset.deck;
    const startRoute = ROUTES.TRAIN_START.replace(":deckId?", deckId);
    history.push(startRoute);
  };

  useEffect(() => {
    const getDecks = async () => {
      setLoading(true);

      const decks = await firebase.getDecks();
      const decksWithCardDueNew = decks.map(deck => {
        let newCards = 0;
        let dueCards = 0;

        if (deck.cards) {
          const today = new Date();

          newCards = Object.values(deck.cards).reduce((acc, val) => {
            return acc + (val.dueDate === null ? 1 : 0);
          }, 0);
          dueCards = Object.values(deck.cards).reduce((acc, val) => {
            return acc + (val.dueDate < today ? 1 : 0);
          }, 0);
        }

        return { ...deck, newCards, dueCards };
      });

      setDecks(decksWithCardDueNew);

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
          <h2>Welcome</h2>
          {decks == null ? (
            <p>Loading...</p>
          ) : decks.length > 0 ? (
            <p>You have cards due for these decks.</p>
          ) : (
            <p>You have finished all decks for now.</p>
          )}
        </Col>
      </Row>
      {decks ? (
        <Table>
          <thead>
            <tr>
              <th>Deck</th>
              <th style={{ width: "1px" }}>Due</th>
              <th style={{ width: "1px" }}>New</th>
              <th style={{ width: "1px" }}></th>
            </tr>
          </thead>
          <tbody>
            {decks.map(deck => {
              return (
                <tr key={deck.id}>
                  <td>{deck.name}</td>
                  <td>{deck.dueCards}</td>
                  <td>{deck.newCards}</td>
                  <td>
                    <Button
                      color="primary"
                      data-deck={deck.id}
                      disabled={deck.dueCards === 0 && deck.newCards === 0}
                      onClick={handleStartBtnClick}
                    >
                      Start
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : null}
    </Container>
  );
};

export default withAuthorization()(Train);

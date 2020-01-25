import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import EditCardFormContainer from "../../containers/EditCardFormContainer";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";

const Edit = props => {
  const { setLoading } = React.useContext(LoadingOverlayContext);

  const [card, setCard] = useState(null);

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const { deckId, cardId } = useParams();

  const handleSubmit = async formValues => {
    setLoading(true);

    const updateCard = {
      front: formValues.front,
      back: formValues.back,
      readmore: formValues.readmore,
      updated: new Date()
    };

    await firebase.updateCard(deckId, cardId, updateCard);

    setLoading(false);
    props.history.goBack();
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const card = await firebase.getCard(deckId, cardId);

      setCard(card);
      console.log(card);

      setLoading(false);
    };

    if (authUser) {
      getData();
    }
  }, [authUser, firebase, deckId, cardId, setLoading]);

  return (
    <Container>
      <Row>
        <Col>
          <h2>Edit</h2>
          {card ? (
            <EditCardFormContainer card={card} onSubmit={handleSubmit} />
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthorization()(Edit);

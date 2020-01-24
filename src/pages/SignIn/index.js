import React, { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";

const SignIn = () => {
  const firebase = React.useContext(FirebaseContext);

  useEffect(() => {
    firebase.ui.start("#firebaseui-auth-container", firebase.uiConfig);
  }, [firebase]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Sign in</h1>
          <div id="firebaseui-auth-container"></div>
          <div id="loader">Loading...</div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;

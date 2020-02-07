import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { AuthUserContext } from "../../components/Session";
import * as ROUTES from "../../constants/routes";

const Landing = () => {
  const authUser = React.useContext(AuthUserContext);
  const history = useHistory();

  useEffect(() => {
    if (authUser && !authUser.isAnonymous) {
      history.push(ROUTES.TRAIN);
    }
  }, [authUser, history]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to React Flashcards</h1>
          <p>
            React Flashcards is an{" "}
            <a
              href="https://github.com/guidoderam/react-flashcards"
              target="_blank"
              rel="noopener noreferrer"
            >
              open source
            </a>{" "}
            flashcard app offering an easy way to create flashcards and review
            them on a daily basis.
          </p>
          <p>
            By combining flashcards with the power of spaced repetition you will
            be able to remember things FOREVER (or as long as you keep using the
            app daily)!
          </p>
          <p>
            You don't have to create an account to get started, simply sign-in
            whenever you are ready and your cards will be automatically moved to
            your new account.
          </p>
          <p>Key features:</p>
          <ul>
            <li>Easy to use</li>
            <li>
              Works on every device (
              <abbr title="Progressive Web App">PWA</abbr> powered!)
            </li>
            <li>Share decks</li>
            <li>Off-line support</li>
            <li>
              <a
                href="https://www.supermemo.com/en/archives1990-2015/english/ol/sm2"
                target="_blank"
                rel="noopener noreferrer"
              >
                SM-2
              </a>{" "}
              spaced repetition algorithm
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;

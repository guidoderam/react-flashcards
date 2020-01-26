import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import { withLoadingOverlay } from "./components/LoadingOverlay";
import Navigation from "./components/Navigation";
import { withAuthentication } from "./components/Session";
import * as ROUTES from "./constants/routes";
import CreateCard from "./pages/Cards/create";
import EditCard from "./pages/Cards/edit";
import CreateDeck from "./pages/Decks/create";
import Decks from "./pages/Decks/decks";
import EditDeck from "./pages/Decks/edit";
import SharedDecks from "./pages/Decks/shared";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound/notFound";
import SignIn from "./pages/SignIn";
import Train from "./pages/Training";
import Start from "./pages/Training/start";

const App = () => {
  return (
    <Router>
      <Navigation />
      <main role="main">
        <Switch>
          <Route
            exact
            path={ROUTES.HOME}
            render={props => <Home {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.SIGN_IN}
            render={props => <SignIn {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.DECK_CREATE}
            render={props => <CreateDeck {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.DECK_EDIT}
            render={props => <EditDeck {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.CARD_EDIT}
            render={props => <EditCard {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.DECKS_SHARED}
            render={props => <SharedDecks {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.CARD_CREATE}
            render={props => <CreateCard {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.DECKS}
            render={props => <Decks {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.TRAIN}
            render={props => <Train {...props} />}
          ></Route>
          <Route
            exact
            path={ROUTES.TRAIN_START}
            render={props => <Start {...props} />}
          ></Route>
          <Route
            exact
            path="*"
            render={props => <NotFound {...props} />}
          ></Route>
        </Switch>
      </main>
    </Router>
  );
};

export default withLoadingOverlay(withAuthentication(App));

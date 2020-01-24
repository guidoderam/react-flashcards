import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import Navigation from "./components/Navigation";
import LoadingOverlay from "./components/overlay/LoadingOverlay";
import * as ROUTES from "./constants/routes";
import CreateCard from "./pages/Cards/create";
import EditCard from "./pages/Cards/edit";
import CreateDeck from "./pages/Decks/create";
import EditDeck from "./pages/Decks/edit";
import Decks from "./pages/Decks/decks";
import SharedDecks from "./pages/Decks/shared";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Train from "./pages/Training";
import Start from "./pages/Training/start";
import { withAuthentication } from "./components/Session";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  handleLoading = isLoading => {
    this.setState({ isLoading });
  };

  render() {
    return (
      <>
        <LoadingOverlay isLoading={this.state.isLoading} />
        <Router>
          <Navigation />
          <main role="main">
            <Switch>
              <Route exact path={ROUTES.HOME} Component={Home}></Route>
              <Route
                exact
                path={ROUTES.SIGN_IN}
                render={props => (
                  <SignIn {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.DECK_CREATE}
                render={props => (
                  <CreateDeck {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.DECK_EDIT}
                render={props => (
                  <EditDeck {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.CARD_EDIT}
                render={props => (
                  <EditCard {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.DECKS_SHARED}
                render={props => (
                  <SharedDecks {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.CARD_CREATE}
                render={props => (
                  <CreateCard {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.DECKS}
                render={props => (
                  <Decks {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.TRAIN}
                render={props => (
                  <Train {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path={ROUTES.TRAIN_START}
                render={props => (
                  <Start {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
            </Switch>
          </main>
        </Router>
      </>
    );
  }
}

export default withAuthentication(App);

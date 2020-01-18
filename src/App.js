import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import MyNavbar from "./components/Navbar";
import LoadingOverlay from "./components/overlay/LoadingOverlay";
import Decks from "./pages/Decks/list";
import SharedDecks from "./pages/Decks/shared";
import CreateDeck from "./pages/Decks/create";
import EditDeck from "./pages/Decks/edit";
import CreateCard from "./pages/Cards/create";
import EditCard from "./pages/Cards/edit";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Train from "./pages/Training";
import Start from "./pages/Training/start";
import ViewDeck from "./pages/Decks/view";

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
          <MyNavbar />
          <main role="main">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/signin">
                <SignIn />
              </Route>
              <Route
                exact
                path="/decks/create"
                render={props => (
                  <CreateDeck {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/decks/edit/:id"
                render={props => (
                  <EditDeck {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/decks/:deck/:card"
                render={props => (
                  <EditCard {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/decks/shared"
                render={props => (
                  <SharedDecks {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/decks/:deck"
                render={props => (
                  <ViewDeck {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/cards/create/"
                render={props => (
                  <CreateCard {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/decks"
                render={props => (
                  <Decks {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/training"
                render={props => (
                  <Train {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/training/start/:deck?"
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

export default App;

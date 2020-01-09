import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import MyNavbar from "./components/Navbar";
import LoadingOverlay from "./components/overlay/LoadingOverlay";
import Home from "./containers/Home";
import Cards from "./containers/Cards/";
import Create from "./containers/Cards/Create";
import Edit from "./containers/Cards/Edit";
import Train from "./containers/Training";
import Start from "./containers/Training/start";
import { auth, provider } from "./firebase.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isLoading: false
    };

    this.signIn = () => {
      auth.signInWithPopup(provider);
    };
    this.signOut = () => {
      auth.signOut();
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      this.setState({ user });
    });
  }

  handleOnUserAvatarClick = () => {
    if (this.state.user) {
      this.signOut();
    } else {
      this.signIn();
    }
  };

  handleLoading = isLoading => {
    this.setState({ isLoading });
  };

  render() {
    return (
      <>
        <LoadingOverlay isLoading={this.state.isLoading} />
        <Router>
          <header>
            <MyNavbar
              user={this.state.user}
              onUserAvatarClick={this.handleOnUserAvatarClick}
            />
          </header>
          <main role="main">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/cards">
                <Cards onLoading={this.handleLoading} />
              </Route>
              <Route
                exact
                path="/cards/edit/:id"
                render={props => (
                  <Edit {...props} onLoading={this.handleLoading} />
                )}
              />
              <Route
                exact
                path="/cards/create/"
                render={props => (
                  <Create {...props} onLoading={this.handleLoading} />
                )}
              />
              <Route
                exact
                path="/training"
                render={props => (
                  <Train {...props} onLoading={this.handleLoading} />
                )}
              ></Route>
              <Route
                exact
                path="/training/start/:category?"
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

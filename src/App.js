import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Container } from 'reactstrap';
import MyNavbar from './components/Navbar'
import { auth, provider } from './firebase.js'
import FlashcardContainer from './components/Flashcard/FlashcardContainer';
import List from './components/Flashcard/List';
import Create from './components/Flashcard/Create';
import Edit from './components/Flashcard/Edit';
import LoadingOverlay from './components/overlay/LoadingOverlay';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isLoading: false
    };

    this.signIn = () => { auth.signInWithPopup(provider) };
    this.signOut = () => { auth.signOut()};
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => { 
      this.setState({user})
    });
  }

  handleOnUserAvatarClick = () => {
    if (this.state.user) {
      this.signOut();
    } else {
      this.signIn();
    }
  }

  handleLoading = (isLoading) => {
    this.setState({isLoading});
  }

  render() {
    return (
      <>
        <LoadingOverlay isLoading={this.state.isLoading} />
        <Router>
          <header>
            <MyNavbar user={this.state.user} onUserAvatarClick={this.handleOnUserAvatarClick}/>
          </header>
          <main role="main">
            <Switch>
              <Route path="/list">
                <List user={this.state.user} onLoading={this.handleLoading} />
              </Route>
              <Route path="/edit/:id"
                render={(props) => <Edit {...props} user={this.state.user} onLoading={this.handleLoading} />}
              />
              <Route path="/create/"
                render={(props) => <Create {...props} user={this.state.user} onLoading={this.handleLoading} />}
              />
              <Route path="/">
                <FlashcardContainer user={this.state.user} onLoading={this.handleLoading} />
              </Route>
            </Switch>
          </main>
        </Router>
      </>
    );
  }
}

export default App;
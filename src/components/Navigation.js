import React, { useState } from "react";
import { NavLink as RRNavLink, useHistory } from "react-router-dom";
import {
  Collapse,
  Container,
  Nav,
  Navbar as RSNavbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import { AuthUserContext } from "../components/Session";
import * as ROUTES from "../constants/routes";
import { FirebaseContext } from "../components/Firebase/";

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(true);

  const history = useHistory();

  const toggleNavbar = () => setCollapsed(!collapsed);

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const signOut = () => {
    firebase.doSignOut().then(() => {
      history.push("/");
    });
  };

  return (
    <RSNavbar
      color="secondary"
      dark
      expand="md"
      className="pt-3 pb-3 text-uppercase"
    >
      <Container>
        <NavbarBrand tag={RRNavLink} to={ROUTES.HOME}>
          React-Flashcards
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar className="ml-auto align-items-center">
            {authUser ? (
              <>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to={ROUTES.TRAIN}
                    active={window.location.href.indexOf(ROUTES.TRAIN) !== -1}
                    activeClassName="active"
                  >
                    Train
                  </NavLink>
                </NavItem>
                <NavItem className="pl-2 pr-2 d-none d-md-block">|</NavItem>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to={ROUTES.CARD_CREATE}
                    activeClassName="active"
                  >
                    Add Card
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to={ROUTES.DECKS}
                    active={window.location.href.indexOf(ROUTES.DECKS) !== -1}
                    activeClassName="active"
                  >
                    My Decks
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to={ROUTES.DECKS_SHARED}
                    activeClassName="active"
                  >
                    Shared Decks
                  </NavLink>
                </NavItem>
              </>
            ) : null}
            <NavItem>
              {!authUser || (authUser && authUser.isAnonymous) ? (
                <NavLink tag={RRNavLink} to={ROUTES.SIGN_IN}>
                  Sign In
                </NavLink>
              ) : (
                <NavLink tag={RRNavLink} to={ROUTES.SIGN_OUT} onClick={signOut}>
                  Sign Out
                </NavLink>
              )}
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </RSNavbar>
  );
};

export default Navigation;

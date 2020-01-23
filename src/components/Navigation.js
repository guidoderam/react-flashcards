import React, { useState, useEffect } from "react";
import { useHistory, NavLink as RRNavLink } from "react-router-dom";
import {
  Container,
  Collapse,
  Navbar as RSNavbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { auth } from "../firebase";
import * as ROUTES from "../constants/routes";

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(true);

  const [isSignedIn, setIsSignedIn] = useState(false);

  const history = useHistory();

  const toggleNavbar = () => setCollapsed(!collapsed);

  const signOut = () => {
    auth.signOut().then(() => {
      history.push("/");
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  });

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
          <Nav navbar className="ml-auto">
            {isSignedIn ? (
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
                <NavItem>|</NavItem>
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
              {isSignedIn ? (
                <NavLink tag={RRNavLink} to={ROUTES.SIGN_OUT} onClick={signOut}>
                  Sign Out
                </NavLink>
              ) : (
                <NavLink tag={RRNavLink} to={ROUTES.SIGN_IN}>
                  Sign In
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

import React, { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import { firebase, ui } from "../../firebase";

const SignIn = () => {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById("loader").style.display = "none";
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: "/training",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: "/",
    // Privacy policy url.
    privacyPolicyUrl: "/"
  };

  useEffect(() => {
    ui.start("#firebaseui-auth-container", uiConfig);
  });

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

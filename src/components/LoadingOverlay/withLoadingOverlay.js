import React from "react";
import LoadingOverlayContext from "./loadingOverlayContext";
import LoadingOverlay from "./LoadingOverlay";

const withLoadingOverlay = Component => {
  class WithLoadingOverlay extends React.Component {
    constructor(props) {
      super(props);

      this.setLoading = loading => {
        this.setState({ loading });
      };

      this.state = {
        loading: false,
        setLoading: this.setLoading
      };
    }

    render() {
      return (
        <LoadingOverlayContext.Provider value={this.state}>
          <>
            <LoadingOverlay />
            <Component {...this.props} />
          </>
        </LoadingOverlayContext.Provider>
      );
    }
  }
  return WithLoadingOverlay;
};
export default withLoadingOverlay;

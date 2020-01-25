import React from "react";

const LoadingOverlayContext = React.createContext({
  isLoading: false,
  setLoading: () => {}
});

export default LoadingOverlayContext;

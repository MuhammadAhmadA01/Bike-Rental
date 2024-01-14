import React, { useReducer, createContext, useContext } from "react";
import reducer, { initialState } from "./reducer";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => (
  <AppContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </AppContext.Provider>
);

export const withAppState = (Component) => {
  return function WrapperComponent(props) {
    const [appState] = useAppState();
    return <Component {...props} appState={appState} />;
  };
};

export const useAppState = () => useContext(AppContext);

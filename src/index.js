import React from "react";
import { CssBaseline } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { UserContextProvider } from './context/UserContext'

ReactDOM.render(
  <HashRouter>
    <CssBaseline />
    <UserContextProvider>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </UserContextProvider>
  </HashRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
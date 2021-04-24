import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import "./App.css";

import Home from "./views/home";
import { AppBar,Button, IconButton, Typography, Toolbar, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  botonLogin: {
    marginLeft: "85%"
  }
}));

class App extends Component {
  render() {
    return (
      <div>
      <div className={useStyles.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={useStyles.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={useStyles.title}>
              Team Manager
            </Typography>
            <MenuItem>
              <Button color="inherit">Login</Button>
            </MenuItem>
          </Toolbar>
        </AppBar>
      </div>
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/"]} component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;

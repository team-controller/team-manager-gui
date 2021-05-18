import React, { Component } from "react"
import { Switch, Route, Link } from "react-router-dom"
import "./App.css"

import Home from "./views/home"
import BottomBar from './components/bottom-bar'
import { makeStyles, createMuiTheme} from "@material-ui/core/styles"
import Login from "./views/Login"
import Signup from "./views/Signup/signup"
import Header from "./components/navBar"
import CreateTeam from "./views/Team/createTeam"
import UpdateTeam from "./views/Team/updateTeam"
import Team from "./views/Team/team"
import NotFoundPage from "./hooks/pageError"
import Player from "./views/Player/players"
import CreatePlayer from "./views/Player/createPlayer"
import Matches from "./views/Partidos/partidos"
import CreateMatches from "./views/Partidos/createMatch"

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: '1',
    overflowY: 'auto',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    color: 'white',
    backgroundImage: 'linear-gradient(46deg, #003e85 30%, #008ca0 90%)'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    flexGrow: 1,
  },
  colorBar: {
    backgroundColor: 'white',
  },
}))

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#006e85',
    },
    secondary: {
      main: '#00cca0',
    },
  },
});

export default function App() {  
  const classes = useStyles()  
  return (
      <div>
      <div className={useStyles.root}>
        <Header classes={classes}/>
      </div>
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/"]} component={Home} />
            <Route exact path={'/pageNotFound/'} component={NotFoundPage} />
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/signup'} component={Signup} />
            <Route exact path={'/createTeam/'} component={CreateTeam} />
            <Route exact path={'/team/'} component={Team} />
            <Route exact path={'/team/edit'} component={UpdateTeam} />
            <Route exact path={`/team/:idTeam/players`} component={Player} />
            <Route exact path={`/team/:idTeam/player/create`} component={CreatePlayer} />
            <Route exact path={`/matches/`} component={Matches} />
            <Route exact path={`/matches/create`} component={CreateMatches} />
          </Switch>
        </div>
        <div className={classes.colorBar}>
          <BottomBar />
        </div>
      </div>
    );
  }


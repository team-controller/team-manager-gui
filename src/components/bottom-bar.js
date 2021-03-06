import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import ListIcon from '@material-ui/icons/List';
import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import Drawer from '@material-ui/core/Drawer';
import { useHistory } from 'react-router';

const useStyles = makeStyles({
  root: {
    width: '100%',
    textAlign: 'center',
    margin: 'auto',
  },
});

export default function SimpleBottomNavigation(props) {
  const classes2 = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const {isLogged} = useUser();
  return (
    <Drawer variant="persistent" anchor="bottom" open={isLogged}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes2.root}
      >
        <BottomNavigationAction
          xs={3}
          label="Tu equipo"
          icon={<SportsSoccerIcon />}
          component={Link}
          to="/team"
        />
          <BottomNavigationAction
            xs={3}
            label="Tus Partidos"
            icon={<ListIcon />}
            onClick={() => history.push(`/matches/`)}
          />
      </BottomNavigation>
    </Drawer>
  );
}

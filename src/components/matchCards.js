import React, { useState } from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography'
import {ButtonBase, Button, ButtonGroup, Grid, Snackbar, useMediaQuery} from '@material-ui/core'
import MatchesService from '../services/matches.service'
import { useHistory } from "react-router"

const useStyles = makeStyles({
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  occupied: {
    backgroundColor: '#00cca0',
  },
  free: {
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#dddddd',
  },
  cardAction: {
    width: '100%',
  },
  buttonEditar: {
    backgroundColor: '#006e85'
  },
  buttonBorrar: {
    backgroundColor: '#3ef386'
  },
  buttonDeshabilitar: {
    backgroundColor: '#e2e02c'
  },
  snak: {
    marginBottom: '20px',
  }
})

export function MatchCard(props) {
  const classes = useStyles()
  const {id,date, status,visitorTeam} = props
  const history = useHistory()
  const [openRemoveCorrect, setOpenRemoveCorrect] = useState(false)
  const [openRemoveInCorrect24h, setOpenRemoveInCorrect24h] = useState(false)
  const [openDetailsIncorrect, setOpenDetailsIncorrect] = useState(false)
  const theme = useTheme();
  const phoneScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const routeRedirect = () => {
      let path = `/match/details/${id}`;
      history.push(path);
  }
  const isCoach = props.isCoach;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenRemoveCorrect(false)
    setOpenRemoveInCorrect24h(false)
    setOpenDetailsIncorrect(false)

  };
  const removeMatch = () => {
    MatchesService.deleteMatch(id).then(res => {
      if(res.status === 200){
        history.go(0);
        setOpenRemoveCorrect(true)
      }else{
        setOpenRemoveInCorrect24h(true)
      }
    })
  }
  return (
    <div>
      <Card variant="outlined">
        <ButtonBase
          className={classes.cardAction}
          onClick={routeRedirect}>
          <CardContent>
            <Typography className={classes.title} gutterBottom>
              Partido
          </Typography>
            <Typography variant="h5" component="h2">
              Fecha: {date}
            </Typography>
            <Typography variant="h5" component="h2">
              Rival: {visitorTeam}
            </Typography>
            <Typography variant="body2" component="p">
              {status}
            </Typography>
          </CardContent>
        </ButtonBase>
      </Card>
      {isCoach &&
        <Grid item container xs={12}>
          <ButtonGroup fullWidth={true} aria-label="outlined primary button group"
                       orientation={phoneScreen? "vertical" : "horizontal"}>
            <Button className={classes.buttonEditar} href={`/#/matches/edit/${id}`}>Editar Partido</Button>
            <Button className={classes.buttonBorrar} onClick={() => removeMatch()}>Eliminar Partido</Button>
          </ButtonGroup>
        </Grid>
      }
      <Snackbar open={openRemoveCorrect} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Has borrado correctamente el Partido
         </Alert>
      </Snackbar>
      <Snackbar open={openRemoveInCorrect24h} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          No puedes borrar una partido a menos de 24Horas
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MatchCard

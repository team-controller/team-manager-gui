import React, { useEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, CssBaseline, Grid, makeStyles, Typography,TableBody, TableHead, TableRow, TableCell, Table } from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import useUser from "../../hooks/useUser";
import TeamService from "../../services/team.service";
import MatchService from "../../services/matches.service";
import PlayerService from "../../services/player.service";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '5rem',
        marginBottom:"20%"
    },
    rootPhone: {
        marginBottom:"20%"
    },
}))
const stylesComponent = {
  buttonCrear: {
      backgroundColor: '#006e85',
      textTransform: 'none',
      letterSpacing: 'normal',
      fontSize: '15px',
      fontWeight: '600',
      textAlign: 'center',
      margin: 'auto',
      display: 'block',
      marginTop: '5px'
  },
  snak: {
      marginBottom: '20px',
  }
}


export default function MatchDetails(props){
    const history =  useHistory();
    const {auth, isLogged} = useUser();
    const {id} = useParams();
    const [match,setMatch] = useState({});
    const [playersConvocated, setPlayersConvocated] = useState([])
    const [ableToDeConvocate, setAbleToDeconvocate] = useState(true);
    const isCoach = auth.role === "ROLE_COACH"
    useEffect(() => {
        if (!isLogged) {
            history.push('/signup')
        }
    }, [isLogged, history])

    useEffect(() => {
      if(isCoach){
        TeamService.haveTeam().then(res => {
            if(res.data !== true){
                history.push('/createTeam')
            }
        }).catch(e => { 
            history.push('/pageNotFound')
        })
      }
     }, [history,isCoach])

     useEffect(() => {
         MatchService.getOneMatch(id).then(res => {
            setMatch(res.data);
            if(moment(res.data.date).isBefore(moment().subtract(1,"days"))){
              setAbleToDeconvocate(false);
            }
         })
     }, [history,id])

     useEffect(() => {
       MatchService.getPlayersConvocated(id).then(res => {
         setPlayersConvocated(res.data);
       })
     },[history,id])
     const desConvocatePlayer = (idMatch, usernamePlayer) => { 
      PlayerService.desConvocatePlayer(idMatch, usernamePlayer).then((response) => {
          if(response.status === 200){
              history.go(0);
          }
      })
      }

    
    return (
        <div style={{ maxWidth: 1400, margin: '90px auto' }}>
        <CssBaseline /> 
            <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                <span >Partido de la fecha: {match && match.date} </span>
            </Typography>      
            <Grid container justify="center">
                  <Grid item component={Card} xs={3}>
                    <CardContent>
                      <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                        <span >Tu Equipo</span>
                      </Typography>
                      <Typography align="center" variant="h5" className={useStyles.title}>
                      <span >{match && match.localTeam} </span>
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} xs={3}>
                    <CardContent>
                      <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                        <span >Resultado </span>
                      </Typography>
                      {match.goalsLocal ? (
                        <h1 style={{float:"left", margin: "0px 30px"}}>{match.goalsLocal}</h1>
                      ):(
                        <h1 style={{float:"left", margin: "0px 30px"}}>--</h1>
                      )
                      }
                      {match.goalsVisitor ? (
                        <h1 style={{float:"right", margin: "0px 30px 0px 0px"}}>{match.goalsVisitor}</h1>
                      ) : (
                        <h1 style={{float:"right", margin: "0px 30px 0px 0px"}}>--</h1>
                      )
                      }
                    </CardContent>
                    <CardActions align="center">
                      {ableToDeConvocate && isCoach && (
                        <Button style={{backgroundImage: 'linear-gradient(46deg, #003e85 30%, #008ca0 70%)'}} type="submit"
                            variant="contained"
                            color="primary"
                            onClick={() => history.push(`/convocate/${id}`)}
                            > Realizar Convocatoria
                        </Button>
                        )} 
                        {!ableToDeConvocate && isCoach && (
                          <Button style={{backgroundImage: 'linear-gradient(46deg, #003e85 30%, #008ca0 70%)'}} type="submit"
                          variant="contained"
                          color="primary"
                          onClick={() => history.push(`/convocate/${id}`)}
                          disabled> Realizar Convocatoria
                      </Button>
                        )}
                        
                    </CardActions>
                  </Grid>
                  <Grid item component={Card} xs={3}>
                    <CardContent>
                      <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                        <span >Equipo Rival</span>
                      </Typography>
                      <Typography align="center" variant="h5" className={useStyles.title}>
                      <span >{match &&  match.visitorTeam} </span>
                      </Typography>
                    </CardContent>
                  </Grid>
            </Grid>
            <Grid style={{margin:"15px 0px 0px 0px"}} container justify="center">
              <Grid item component={Card} xs={9}>
                <CardContent>
                  <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                    <span >Jugadores Convocados</span>
                  </Typography>
                  <Table>
                      <TableHead >
                      <TableRow>
                        <TableCell align="center">
                          <Typography className={useStyles.title}>
                            <span>Nombre</span>
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography className={useStyles.title}>
                            <span>Posicion</span>
                          </Typography>
                        </TableCell>
                        {isCoach && (
                        <TableCell align="center">
                          <Typography className={useStyles.title}>
                            <span>Acciones</span>
                          </Typography>
                        </TableCell>
                        )}
                      </TableRow>
                      </TableHead>
                      <TableBody>
                          {playersConvocated && playersConvocated.map((row,index) => (
                              <TableRow key={index}>
                                  <TableCell align="center"component="th" scope="row">
                                          {row.firstName}
                                  </TableCell>
                                  <TableCell align="center"component="th" scope="row">
                                          {row.position}
                                  </TableCell>
                                {ableToDeConvocate && isCoach && (
                                  <TableCell align="center" component="th" scope="row">
                                    <Button variant="contained"
                                      color="primary"
                                      style={{ ...stylesComponent.buttonCrear }}
                                      onClick={() => desConvocatePlayer(id,row.username)}> Desconvocar
                                    </Button>
                                  </TableCell>
                                )}
                                {!ableToDeConvocate && isCoach &&(
                                  <TableCell align="center" component="th" scope="row">
                                    <Button variant="contained"
                                      color="primary"
                                      style={{ ...stylesComponent.buttonCrear }}
                                      onClick={() => desConvocatePlayer(id,row.username)}
                                      disabled> Desconvocar
                                    </Button>
                                  </TableCell>
                                  )}
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                </CardContent>
              </Grid>
            </Grid>
            {!ableToDeConvocate && isCoach && 
            <Typography align="center" variant="h6" className={useStyles.title} gutterBottom>
                <span>La fecha ha pasado por tanto no puede modificar convocatorias</span>
            </Typography>
            
            }
        </div>
    )
}
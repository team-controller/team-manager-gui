import { Button, Card, CardContent, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useUser from "../../hooks/useUser";
import MatchesService from "../../services/matches.service";
import PlayerService from "../../services/player.service";
import TeamService from "../../services/team.service";
import moment from "moment";
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
const useStyles = makeStyles((theme) => ({
    root: {
        padding: '5rem',
        marginBottom:"20%"
    },
    rootPhone: {
        marginBottom:"20%"
    },
}))

export default function ConvocatePlayers(props) {
    const history = useHistory();
    const [players, setPlayers] = useState([])
    const [playersConvocates, setPlayersConvocated] = useState([])
    const [playersAvaliable, setPlayersAvaliable] = useState([])
    const idMatch = props.match.params.id
    const {isLogged} = useUser();


    useEffect(() => {
        if (!isLogged) {
            history.push('/signup')
        }
    }, [isLogged, history])
    
    useEffect(() => {
        TeamService.haveTeam().then(res => {
            if(res.data !== true){
                history.push('/createTeam')
            }
        }).catch(e => { 
            history.push('/pageNotFound')
        })
     }, [history])

    useEffect(() => {
        MatchesService.getOneMatch(idMatch).then(res => {
            if(moment(res.data.date).isBefore(moment().subtract(1,"days"))){
                history.goBack();
            }
        })
    }, [history]) 
    useEffect(() => {
        MatchesService.getPlayersToConvocate(idMatch).then(res => {
           
            if(res.status === 200){
                setPlayers(res.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [history])

    const convocatePlayer = (idMatch,usernamePlayer) => {
        PlayerService.convocatePlayer(idMatch, usernamePlayer).then((response) => {
            if(response.status === 200){
                history.go(0);
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }



    return (
        <div style={{marginBottom:"100px"}}>
            <Typography variant="h3" align="center" style={{paddingTop: '75px' }}>
                Lista de Jugadores
            </Typography>
            <Card style={{ margin: 'auto', maxWidth: 900}}>
            <CardContent>
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
                      <TableCell align="center">
                        <Typography className={useStyles.title}>
                          <span>Acciones</span>
                        </Typography>
                      </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {players && players.map((row,index) => (
                            <TableRow key={index}>
                                <TableCell align="center"component="th" scope="row">
                                        {row.firstName}
                                </TableCell>
                                <TableCell align="center"component="th" scope="row">
                                        {row.position}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    <Button variant="contained"
                                        color="primary"
                                        style={{ ...stylesComponent.buttonCrear }}
                                        onClick={() => convocatePlayer(idMatch,row.username)}> Convocar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            </Card>
            {players.length === 0 && (
                <Typography align="center" variant="h6" className={useStyles.title} gutterBottom>
                        <span >No tienes más jugadores para añadir a la convocatoria.</span>
                      </Typography>
            )
            }
            <Button
                variant="contained"
                color="primary"
                style={{ ...stylesComponent.buttonCrear }}
                onClick={() => history.goBack()}>
                Volver
            </Button>
        </div>
    )
}
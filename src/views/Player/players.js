import React, {useEffect, useState} from "react"
import {useHistory} from 'react-router'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PlayerService from "../../services/player.service"
import {Card, CardContent, Table, Typography, TableHead, TableRow, TableCell, TableBody} from'@material-ui/core'
import TeamService from "../../services/team.service"
import useUser from "../../hooks/useUser"

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: '16%',
    },
    block: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: 'auto',
    },
    bottomDivider: {
        borderBottom: '0.1em solid darkgray',
        lineHeight: '90%',
    },
    topBottomDivider: {
        borderTop: '0.1em solid darkgray',
        borderBottom: '0.1em solid darkgray',
        lineHeight: '85%',
    },
    barHeader: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: 'auto',
        marginBottom: '10px',
    },
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex',
    },
    buttons: {
        alignItems: 'stretch',
    },
    overflowHidden: {
        overflow: 'hidden',
    },
    hrColor: {
        borderTop: '1px solid darkgray',
    },
    snak: {
        marginBottom: '20px',
    },
    colorBar: {
        backgroundColor: 'white',
    },
}));

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
        marginTop: '30px'
    },
    snak: {
        marginBottom: '20px',
    }
}

export default function Players(props) {
    const history = useHistory();
    const [players, setPlayers] = useState([])
    const idTeam = props.match.params.idTeam
    const {currentTeam,auth, isLogged} = useUser();

    useEffect(() => {
        if(!currentTeam){
            history.push('/createTeam')
        }
     }, [isLogged, history, currentTeam])

    useEffect(() => {
        PlayerService.getAllPlayers(idTeam).then(res => { 
            setPlayers(res.data);
        }).catch(err => {
            console.log(err)
        })
    }, [history, players])



    return(
        <div>
            <Typography variant="h3" align="center" style={{paddingTop: '75px' }}>
                Lista de Jugadores
            </Typography>
            <div style={{paddingBottom: '20px' }}>
                <Button type="submit"
                    variant="contained"
                    color="primary"
                    style={{ ...stylesComponent.buttonCrear }} onClick={() => history.push(`/team/${idTeam}/player/create`)}> Crear Jugador </Button> 
            </div>
            <Card style={{ margin: 'auto', maxWidth: 700 }}>
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
                          <span>Goles</span>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={useStyles.title}>
                          <span>Minutos</span>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={useStyles.title}>
                          <span>Tarj. Amarillas</span>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={useStyles.title}>
                          <span>Tarj. Rojas</span>
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
                        {players.map((row) => {
                            <TableRow key={row.id}>
                                <TableCell align="center"component="th" scope="row">
                                        {row.firstName}
                                </TableCell>
                                <TableCell align="center"component="th" scope="row">
                                        {row.position}
                                </TableCell>
                                <TableCell align="center"component="th" scope="row">
                                        {row.totalGoals}
                                </TableCell>
                                <TableCell align="center"component="th" scope="row">
                                        {row.totalMinutes}
                                </TableCell>
                                <TableCell align="center"component="th" scope="row">
                                        {row.totalYellows}
                                </TableCell>
                                <TableCell align="center"component="th" scope="row">
                                        {row.totalReds}
                                </TableCell>
                                <TableCell align="center"component="th" scope="row">
                                    <Button variant="contained"
                                        color="primary"
                                        style={{ ...stylesComponent.buttonBack }}
                                        onClick={() => history.push(`/team/${idTeam}/player/` + row.username + "/edit")}> Editar Jugador
                                    </Button>
                                    <Button variant="contained"
                                        color="primary"
                                        style={{ ...stylesComponent.buttonBack }}
                                        onClick={() => history.push(`/team/${idTeam}/player/` + row.username + "/editMatch")}> Añadir info
                                    </Button>
                                    <Button variant="contained"
                                        color="primary"
                                        style={{ ...stylesComponent.buttonBack }}
                                        onClick={() => history.push(`/team/${idTeam}/player/` + row.username + "/delete")}> Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>
    )
}

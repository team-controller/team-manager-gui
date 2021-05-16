import React, {useEffect, useState} from "react"
import {useHistory} from 'react-router'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PlayerService from "../../services/player.service"
import {Card, CardContent, Table, Typography, TableHead, TableRow, TableCell, TableBody, Container, CssBaseline} from'@material-ui/core'
import TeamService from "../../services/team.service"
import useUser from "../../hooks/useUser"



export default function Games(props) {
    const history = useHistory();
    const [players, setPlayers] = useState([])
    const idTeam = props.match.params.idTeam
    const {currentTeam,auth, isLogged} = useUser();
    useEffect(() => {
        if(!auth){
            history.push('/')
        }
     }, [isLogged, history, currentTeam])

    
    useEffect(() => {
        if(!currentTeam){
            history.push('/createTeam')
        }
     }, [isLogged, history, currentTeam])

     return <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br></br>
        <div style = {{'marginTop':'70px'}}>
            <h4>VISTA DE TUS PARTIDOS</h4>
            {auth &&(
                <h3>Bienvenido {auth.firstName}</h3> 
            )
            }
        </div>
        
    </Container>
}
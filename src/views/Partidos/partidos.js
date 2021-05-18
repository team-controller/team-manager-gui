import React, {useEffect, useState} from "react"
import {useHistory} from 'react-router'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import {Card, CardContent, Table, Typography, TableHead, TableRow, TableCell, TableBody, Container, CssBaseline, useMediaQuery, Grid, ButtonGroup} from'@material-ui/core'
import MatchesService from "../../services/matches.service"
import useUser from "../../hooks/useUser"
import { MatchCard } from "../../components/matchCards"
import teamService from "../../services/team.service"

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

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '5rem',
        marginBottom:"20%"
    },
    rootPhone: {
        marginBottom:"20%"
    },
}))

export default function Games(props) {
    const history = useHistory();
    const classes = useStyles();
    const [matches, setMatches] = useState([])
    const theme = useTheme();
    const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {auth, isLogged} = useUser();
    const isCoach = auth.role ==="ROLE_COACH";
    useEffect(() => {
        if(!auth){
            history.push('/')
        }
     }, [isLogged, history])

    
    useEffect(() => {
        teamService.haveTeam().then(res => {
            if(res.data !== true){
                history.push('/createTeam')
            }
        }).catch(e => { 
            history.push('/pageNotFound')
        })
     }, [])

     useEffect(() => {
         if(auth) {
            MatchesService.getAllMatchesByCoach().then(res => {
                var newData = parseData(res.data);    
                setMatches(newData);
            }).catch((e) => {
                console.log(e);
            })
         }
     }, [auth])
     function parseData(data) {
        var newData = []; 
        data.map((match) => {
             var parseDate = match.date.substring(0,10);
             var parsedCallTime = match.callTime.substring(11,19)
             var parsedStartTime = match.startTime.substring(11,19)
             var parsedEndTime = match.endTime.substring(11,19)
             match.date = parseDate;
             match.callTime = parsedCallTime;
             match.startTime = parsedStartTime;
             match.endTime = parsedEndTime;
             newData.push(match);
         })
         return newData;
     }

     return (
        <div style={{marginBottom:"30px"}}>
            <Container className={phoneScreen? classes.rootPhone : classes.root} maxWidth={"lg"}>
                <h1>Partidos</h1>
                <h2>Bienvenido {auth.firstName}</h2> 
                <Grid container spacing={3}>
                    {matches && matches.map((match) => (
                        <Grid item xs={12} sm={6} md={6} key={match.id}>
                            <MatchCard {...match} isCoach={isCoach}/>
                        </Grid>
                    ))}
                    {isCoach &&
                        <Grid item container xs={12}>
                            <ButtonGroup
                                fullWidth={true}
                                color="primary"
                                aria-label="outlined primary button group"
                                className={classes.buttons}
                            >
                                <Button href={`/#/matches/create`}>Crear Partido</Button>
                                <Button href={`/#/`}>Volver</Button>
                            </ButtonGroup>
                        </Grid>
                    }
                </Grid>
            </Container>
        </div>
     )
}
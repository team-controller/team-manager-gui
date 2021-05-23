import React, {useEffect, useState} from "react"
import {useHistory} from 'react-router'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import {Container, useMediaQuery, Grid, ButtonGroup} from'@material-ui/core'
import MatchesService from "../../services/matches.service"
import useUser from "../../hooks/useUser"
import { MatchCard } from "../../components/matchCards"
import teamService from "../../services/team.service"
import moment from "moment"

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
     }, [auth,isLogged, history])

    
    useEffect(() => {
        if(isCoach) {
        teamService.haveTeam().then(res => {
            if(res.data !== true){
                history.push('/createTeam')
            }
        }).catch(e => { 
            history.push('/pageNotFound')
        })
        }
     }, [isCoach, history])

     useEffect(() => {
         if(auth) {
            MatchesService.getAllMatchesByCoach(auth.team.id).then(res => {
                setMatches(parseData(res.data));
            }).catch((e) => {
                console.log(e);
            })
         }
     }, [auth])
     function parseData(data) {
        var newData = []; 
        data.forEach((match) => {
             match.date = moment(match.date).format("DD/MM/yyyy");
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
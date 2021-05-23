import React, {useEffect, useState} from "react"
import {useHistory} from 'react-router'
import Button from '@material-ui/core/Button'
import TeamService from "../../services/team.service"
import useUser from "../../hooks/useUser"
import { Grid,Container, CardContent, Typography, Card, CardActions, useMediaQuery, useTheme, ButtonGroup } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import MatchesService from "../../services/matches.service"
import moment from "moment"
import { MatchCard } from "../../components/matchCards"


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
    buttonEditar: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        display: 'block',
        marginTop: '30px',
        margin: '30px 30px 0px 0px'
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

export default function Team(props) {
    const history = useHistory();
    const classes = useStyles();
    const [team,setTeam] = useState({});
    const {auth,isLogged} = useUser();
    const [matches, setMatches] = useState([]);
    const theme = useTheme();
    const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isCoach = auth.role === "ROLE_COACH";
    useEffect(() => {
        if (!isLogged) {
            history.push('/signup')
        }
    }, [isLogged, history])
    
    useEffect(() => {
        TeamService.getTeam().then(teamRes => { 
            setTeam(teamRes.data[0]);
        }).catch((e) => {
            history.push('/createTeam')
        });
    }, [history])
    useEffect(() => {
        if(auth) {
           MatchesService.getThreeNextMatchesByCoach(auth.team.id).then(res => {
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

    const deleteTeam = () => {
        TeamService.deleteTeam().then((response) => {
            if(response.status=== 200) {
                history.push({ pathname: '/createTeam/' , state: { data: true } });
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }


    return (
        <div>
            <div key={team.id} style={{marginTop: "90px"}}>
                <Grid container justify="center">
                    <Grid item component={Card} xs={6}>
                        <CardContent>
                          <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                            <span >Bienvenido a la vista de tu equipo {auth.firstName}</span>
                          </Typography>
                          <Typography align="center" variant="h5" className={useStyles.title}>
                          <span >Nombre: {team.name} </span>
                          </Typography>
                          <Typography align="center" variant="h5" className={useStyles.title}>
                          <span >Ciudad: {team.city} </span>
                          </Typography>
                          <Typography align="center" variant="h5" className={useStyles.title}>
                          <span >Estadio: {team.stadiumName} </span>
                          </Typography>
                        </CardContent>
                        <CardActions>
                        {isCoach && (
                        <ButtonGroup align="center" style={{margin:'0 auto'}}>
                            <Button type="submit"
                                variant="contained"
                                color="primary"
                                style={{ ...stylesComponent.buttonEditar }} onClick={() => history.push("/team/edit")}> Editar 
                            </Button> 
                            <Button type="submit"
                                variant="contained"
                                color="primary"
                                style={{ ...stylesComponent.buttonEditar }}
                                onClick={()=> deleteTeam()}> Borrar 
                            </Button> 

                            <Button type="submit"
                                variant="contained"
                                color="primary"
                                style={{ ...stylesComponent.buttonCrear }}
                                onClick={() => history.push("/team/"+ team.id + "/players")}> Ver jugadores 
                            </Button> 
                        </ButtonGroup>
                        )}
                        </CardActions>
                    </Grid>
                </Grid>
            </div>
            <div>
            </div>
            <Container className={phoneScreen? classes.rootPhone : classes.root} maxWidth={"lg"}>
                <h1 align="center">Tus próximos {matches.length} partidos</h1>
                <Grid container spacing={3}>
                    {matches && matches.map((match) => (
                        <Grid item xs={12} sm={6} md={6} key={match.id}>
                            <MatchCard {...match} isCoach={isCoach}/>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
        )

}

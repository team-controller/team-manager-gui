import React,{ useEffect } from 'react';
import { useHistory } from "react-router"
import Container from '@material-ui/core/Container';
import useUser from '../hooks/useUser';
import teamService from "../services/team.service"
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '5rem',
        marginBottom:"20%"
    },
    rootPhone: {
        marginBottom:"20%"
    },
}))


function Home() {
    const history =  useHistory();
    const {auth, isLogged} = useUser();
    useEffect(() => {
        if (!isLogged) {
            history.push('/signup')
        }
    }, [isLogged, history])

    useEffect(() => {
        if(auth && auth.role === "ROLE_COACH"){
        teamService.haveTeam().then(res => {
            if(res.data !== true){
                history.push('/createTeam')
            }
        }).catch(e => { 
            history.push('/pageNotFound')
        })
        }
     }, [history, auth])
    
    return <Container style={{margin: '0 auto'}} component="main">
            {auth && (
            <div style={{marginTop:'20%'}}>
            <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                <span >Bienvenido a TeamManager la mejor aplicación para gestionar tu equipo {auth.firstName}</span>
            </Typography>
            </div>
            )}
            {!auth && (
            <div align="center">
            <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                <span >Bienvenido a TeamManager la mejor aplicación para gestionar tu equipo</span>
            </Typography>
            <Typography align="center" variant="h5" className={useStyles.title} gutterBottom>
                <span >Registrate o inicia sesión</span>
            </Typography>
            </div>
            )}
    </Container>
}
export default Home;

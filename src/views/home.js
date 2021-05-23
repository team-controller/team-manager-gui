import React,{ useEffect } from 'react';
import { useHistory } from "react-router"
import Container from '@material-ui/core/Container';
import useUser from '../hooks/useUser';
import teamService from "../services/team.service"

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
            }else{
                history.push('/team')
            }
        }).catch(e => { 
            history.push('/pageNotFound')
        })
        }
     }, [history, auth])
    
    return <Container component="main" maxWidth="xs">
    </Container>
}
export default Home;

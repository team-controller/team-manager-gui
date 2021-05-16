import React,{ useEffect } from 'react';
import { useHistory } from "react-router"
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import useUser from '../hooks/useUser';

function Home() {
    const useStyles = {
        centerImage: {
            margin: 'auto',
            width: '60%',
            display: 'block',
            backgroundColor: '#fafafa',
            marginTop: '15px',
        }
    }
    const history =  useHistory();
    const {currentTeam,auth, isLogged} = useUser();
    useEffect(() => {
        if (!isLogged) {
            history.push('/signup')
        }
    }, [isLogged, history])

    useEffect(() => {
        if(!currentTeam && auth){
            history.push('/createTeam')
        }
     }, [isLogged, history, currentTeam])
    
    return <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br></br>
        <div style = {{'marginTop':'70px'}}>
            <h4>Bienvenidos a la mejor aplicación para controlar tu equipo</h4>
            {auth ? (
                <h3>Tu nombre es {auth.firstName}</h3>
            ) : (
                <div style = {{'textAlign':'center', 'margin': 'auto'}}>
                    <Button variant="contained"  color="primary" onClick={() => history.push("/signup")}>
                        Registrate
                    </Button>
                </div>
            )
            }
        </div>
        
    </Container>
}
export default Home;

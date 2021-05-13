import React from 'react';
import { useHistory } from "react-router"
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

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
    const history = useHistory();
    const routeRedirect = () => {
        let path = '/';
        history.push(path);
    }

    const user = JSON.parse(sessionStorage.getItem('user'));
    return <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br></br>
        <div style = {{'marginTop':'70px'}}>
            <h4>Bienvenidos a la mejor aplicación para controlar tu equipo</h4>
            {user ? (
                <h3>Tu nombre es {user.firstName}</h3>
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

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
            backgroundColor: '#fafafa'
        }
    }
    const history = useHistory();
    const routeRedirect = () => {
        let path = '/';
        history.push(path);
    }
    return <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br></br>
        <div>
            <h4>Bienvenidos a la mejor aplicación para controlar tu equipo</h4>
        </div>
        <div style = {{'textAlign':'center', 'margin': 'auto'}}>
            <Button variant="contained"  color="primary" onClick={routeRedirect}>
                Ir al inicio
                </Button>
        </div>
    </Container>
}
export default Home;

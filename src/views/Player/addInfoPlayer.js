import React, { useState, useEffect } from 'react'
import PlayerService from "../../services/player.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'
import { useParams } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

export default function CreatePlayer() {
    const classes = useStyles();
    const params = useParams();
    const [state, setState] = useState({})
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const { auth } = useUser()
    const [errors, setErrors] = useState({});
    const idTeam = params.idTeam
    const admin = auth.role === "ROLE_COACH";
    const usernamePlayer = params.usernamePlayer

    useEffect(() => {
        if (!admin) history.push('/')
    }, [admin, history])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (handleValidation()){
            const object = {
                "goalsPerMatch": state.goalsPerMatch,
                "yellowsPerMatch": state.yellowsPerMatch,
                "redPerMatch": state.redPerMatch, 
                "minutesPerMatch":state.minutesPerMatch
            }
            PlayerService.addInfoPlayer(idTeam, usernamePlayer, object).then(response => {
                if (response.status === 200) {
                    history.push({ pathname: `/team/${idTeam}/players` , state: { data: true } });
                } else {
                    setOpenSubmitIncorrect(true)
                }
            }).catch(error => {
                console.log("Error" + error)
            })
        }
    }

    function handleValidation() {
        let objErrors = {};
        let valid = true;
        if(!state.goalsPerMatch || state.goalsPerMatch<0) {
            valid = false;
            objErrors['goalsPerMatch'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!state.yellowsPerMatch || state.yellowsPerMatch < 0) {
            valid = false;
            objErrors['yellowsPerMatch'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!state.redPerMatch || state.redPerMatch<0) {
            valid = false;
            objErrors['redPerMatch'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!state.minutesPerMatch || state.minutesPerMatch<0) {
            valid = false;
            objErrors['minutesPerMatch'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(state.redPerMatch>1) {
            valid = false;
            objErrors['redPerMatch'] = 'No se puede añadir más de una roja por partido'
        }
        if(state.yellowsPerMatch>2) {
            valid = false;
            objErrors['yellowPerMatch'] = 'No se puede añadir más de dos amarillas por partido'
        }
        if(state.minutesPerMatch>120) {
            valid = false;
            objErrors['minutesPerMatch'] = 'No se puede añadir más de 120 minutos por partido'
        }
        setErrors(objErrors);
        return valid;
    }
    
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false)
    };

    return (

        <Container fixed>
            <div style={{ marginTop: '90px', marginBottom: '100px' }}>
                <Typography align="center" className='h5' variant="h5" gutterBottom>
                    Registra nuevos datos de tu jugador
            </Typography>
                <div style={{ margin:'0px 0px 0px 20px' }}>
                    <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{paddingTop: '20px'}}>
                                <TextField className='input-title' type="number" 
                                helperText={errors.goalsPerMatch} id="goalsPerMatch" 
                                label="Goles en el partido" name="goalsPerMatch" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{paddingTop: '20px'}}>
                                <TextField className='input-title' type="number"
                                 helperText={errors.yellowsPerMatch} id="yellowsPerMatch" 
                                 label="Amarillas en el partido" name="yellowsPerMatch" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{paddingTop: '20px'}}>
                                <TextField className='input-title' type="number" 
                                helperText={errors.redPerMatch} id="redPerMatch" 
                                label="Roja en el partido" name="redPerMatch" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{paddingTop: '20px'}}>
                                <TextField className='input-title' type="number" 
                                helperText={errors.minutesPerMatch} id="minutesPerMatch" 
                                label="Minutos en el partido" name="minutesPerMatch" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ ...stylesComponent.buttonCrear }}>
                            Enviar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ ...stylesComponent.buttonCrear }}
                            onClick={() => history.goBack()}>
                            Volver
                        </Button>
                        <div className={stylesComponent.snak}>
                            <Snackbar open={openSubmitIncorrect} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="error">
                                    Tienes que rellenar el formulario correctamente
                            </Alert>
                            </Snackbar>
                        </div>
                    </form>
                </div>
            </div>
        </Container>

    )
}

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
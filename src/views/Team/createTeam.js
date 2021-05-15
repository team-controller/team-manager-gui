import React, { useState, useEffect } from 'react';
import TeamService from "../../services/team.service";
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { TextField, Button, Snackbar, Container, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

export default function CreateTeam() {
    const classes = useStyles();
    const [state, setState] = useState('')
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const { auth } = useUser()
    const admin = auth.role === "ROLE_COACH";
    useEffect(() => {
        if (!admin) history.push('/')
    }, [admin, history])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (state.name === undefined || state.name === "" || state.city === undefined || state.city === "" || state.stadiumName === undefined ||state.stadiumName === "") {
            setOpenSubmitIncorrect(true)
        } else {
            const object = {
                "name": state.name, "city": state.city, "stadiumName":state.stadiumName
            }
            TeamService.createTeam(object).then(response => {
                if (response.status === 201) {
                    history.push({ pathname: '/team/'+auth.username , state: { data: true } });
                } else {
                    setOpenSubmitIncorrect(true)
                }
            }).catch(error => {
                console.log("Error" + error)
            })
        }
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
                    Crea tu equipo
            </Typography>
                <div style={{ margin:'0px 0px 0px 20px' }}>
                    <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="name" label="Nombre" name="name" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' id="city" label="Ciudad" name="city" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' id="stadiumName" label="Nombre Estadio" name="stadiumName" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ ...stylesComponent.buttonCrear }}>
                            Enviar
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
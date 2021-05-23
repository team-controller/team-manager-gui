import React, { useState, useEffect } from 'react'
import PlayerService from "../../services/player.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'
import { useParams } from 'react-router-dom'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import moment from 'moment';

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
    const idTeam = params.idTeam
    const [position, setPosition] = useState('')
    const admin = auth.role === "ROLE_COACH"
    const player = "ROLE_PLAYER"
    const [errors, setErrors] = useState({})
    const [date, setDate] = useState(new Date())
    const [dateError, setDateError] = useState('')

    useEffect(() => {
        setPosition("No Definido") //Se setea aqui 
        if (!admin) history.push('/')
    }, [admin, history])

    useEffect(() => { 
        if(!auth) {
            history.push("/signup")
        }
    }, [history, auth])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (handleValidation()){
            const object = {
                "username": state.username,
                "password": state.password,
                "firstName": state.firstName, 
                "secondName":state.secondName,
                "phoneNumber": state.phoneNumber,
                "fechaNacimiento": moment(date).format("YYYY/MM/DD"),
                "rol": player
            }
            PlayerService.createPlayer(idTeam, object, position).then(response => {
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

        const patternDate = new RegExp('^(\\d{4})[\\/](0?[1-9]|1[012])[\\/](0?[1-9]|[12][0-9]|3[01])$');
        const patternMobile = new RegExp('^([67][0-9]{8})');

        if(!state.username) {
            valid = false;
            objErrors['username'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!state.firstName) {
            valid = false;
            objErrors['firstName'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!state.secondName) {
            valid = false;
            objErrors['secondName'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!date) {
            valid = false;
            objErrors['fechaNacimiento'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!state.phoneNumber || !state.phoneNumber.match(patternMobile)) {
            valid = false;
            objErrors['phoneNumber'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!state.password) {
            valid = false;
            objErrors['password'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(state.password<5) {
            valid = false;
            objErrors['password'] = 'Debe de tener más de 6 caracteres'
        }
        
        setErrors(objErrors);
        return valid;
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
        if(event.target.name === 'posicion'){
            setPosition(event.target.value );
        }
    }
    const handleDateChange = (time) => {
        setDate(time)
        if (time === undefined || isNaN(time) || time === null) {
            setDateError("La fecha no es válida")
        } else {
            setDateError("")
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false)
    };
    const handleChangPosition = (event) => {       
        setPosition(event.target.value );

    };

    return (

        <Container fixed>
            <div style={{ marginTop: '90px', marginBottom: '100px' }}>
                <Typography align="center" className='h5' variant="h5" gutterBottom>
                    Registra tu jugador
            </Typography>
                <div style={{ margin:'0px 0px 0px 20px' }}>
                    <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                        <Grid style={{ marginTop:'20px' }} container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="username" label="Nombre de usuario"
                                helperText={errors.username} name="username" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid style={{ marginTop:'20px' }} container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="password" label="Contraseña"
                                helperText={errors.password} name="password" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid style={{ marginTop:'20px' }} container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="firstname" label="Nombre"
                                helperText={errors.firstName} name="firstName" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid style={{ marginTop:'20px' }} container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="secondname" label="Apellidos"
                                helperText={errors.secondName} name="secondName" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3} style={{margin: '25px auto 10px', width:'16%'}} >
                            <MuiPickersUtilsProvider style={{marginLeft: '30px'}} utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        id={"date"}
                                        label={"Fecha de Nacimiento"}
                                        format="yyyy/MM/dd"
                                        value={date}
                                        error={dateError !== ''}
                                        helperText={dateError}
                                        onChange={handleDateChange}/>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid style={{ marginTop:'20px' }} container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="phoneNumber" label="Teléfono"
                                helperText={errors.phoneNumber} name="phoneNumber" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        
                        <Grid xs={12} container justify="center" alignItems="center" >
                            <FormControl style={{marginTop:'25px',width:'16%'}}>
                                <InputLabel id="demo-simple-select-label">Posición</InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={position}
                                  onChange={handleChangPosition}
                                  autoWidth="true"
                                >
                                  <MenuItem value="No definido">--</MenuItem>
                                  <MenuItem value="Delantero">Delantero</MenuItem>
                                  <MenuItem value="Centrocampista">Centrocampista</MenuItem>
                                  <MenuItem value="Defensa">Defensa</MenuItem>
                                  <MenuItem value="Portero">Portero</MenuItem>
                                </Select>
                            </FormControl>
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
import React, { useState, useEffect } from 'react'
import PlayerService from "../../services/player.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'
import { useParams } from 'react-router-dom'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

const useStyle = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));
export default function EditPlayer(props) {
    const[player, setPlayer] = useState({
        username: '',
        password: '',
        firstName: '',
        secondName: '',
        phoneNumber: '',
        fechaNacimiento: ''
    });
    const classes = useStyle()
    const history = useHistory()
    const { auth } = useUser()
    const params = useParams();
    const [position, setPosition] = useState('');
    const idTeam = params.idTeam
    const usernamePlayer = params.usernamePlayer
    const admin = auth.role === "ROLE_COACH"
    const rol = "ROLE_PLAYER";
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const [errors, setErrors] = useState({})
    const [newPassword, setNewPassword] = useState('')
    const [dateError] = useState('')

    useEffect(() => {
        if (!admin) {
            history.push('/pageNotFound/')
        } else {
            PlayerService.getPlayer(idTeam, usernamePlayer).then(
                res => {
                    if (res.status === 200) {
                        setPosition(res.data.position)
                        setPlayer(res.data)
                    } else {
                        history.push('/pageNotFound/')
                    }
                }
            )
        }
    }, [admin, history, idTeam,usernamePlayer])

    const handleSubmit = (evt) => {
        evt.preventDefault()
        if (handleValidation()) {
            if(newPassword !== "" && newPassword !== player.password){
                player.password = newPassword
            }
            const object = {
                "username": player.username, "password": player.password, "firstName": player.firstName, "secondName": player.secondName,
                 "phoneNumber": player.phoneNumber, "fechaNacimiento": player.fechaNacimiento, "rol": rol
            }
            PlayerService.editPlayer(idTeam, usernamePlayer, object, position).then(response => {
                if(response.status === 200) {
                    props.history.push({pathname: `/team/`+idTeam+`/players`, object: {data:true}})
                }
            }).catch(error => {
                console.log(error)
                history.push('/pageNotFound')
            })
        }
    }
    const handleDateChange = (event) => {
        setPlayer({
            ...player,
            fechaNacimiento: event,
        });
    }

    const handleChangPosition = (event) => {       
        setPosition(event.target.value );

    };
    function handleValidation() {
        let objErrors = {};
        let valid = true;

        const patternMobile = new RegExp('^([67][0-9]{8})');

        if(!player.username) {
            valid = false;
            objErrors['username'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!player.firstName) {
            valid = false;
            objErrors['firstName'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!player.secondName) {
            valid = false;
            objErrors['secondName'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!player.fechaNacimiento) {
            valid = false;
            objErrors['fechaNacimiento'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!player.phoneNumber || !player.phoneNumber.match(patternMobile)) {
            valid = false;
            objErrors['phoneNumber'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!player.password) {
            valid = false;
            objErrors['password'] = 'Tienes que rellenar este campo con un valor válido'
        }else {
            if(newPassword !== "" && newPassword<5) {
                valid = false;
                objErrors['password'] = 'Debe de tener más de 6 caracteres'
            }
        }   
        
        setErrors(objErrors);
        return valid;
    }

    const handleChange = (event) => {
        setPlayer({...player, [event.target.name]: event.target.value})
        if(event.target.name === 'posicion'){
            setPosition(event.target.value );
        }
        if(event.target.name === 'password'){
            setNewPassword(event.target.value);
        }
        
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false)
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

    return(
        <Container fixed>
        <div style={{ marginTop: '90px', marginBottom: '100px' }}>
            <Typography align="center" className='h5' variant="h5" gutterBottom>
                Edita tu equipo
        </Typography>
            <div style={{ margin:'0px 0px 0px 20px' }}>
                <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' 
                                id="username" 
                                label="Username" 
                                name="username" 
                                helperText={errors.username}
                                onChange={(e) => handleChange(e)} 
                                value={player.username}
                            />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' 
                                id="password" 
                                label="Nueva Contraseña" 
                                name="password" 
                                placeholder="Introduce una nueva contraseña"
                                helperText={errors.password}
                                onChange={(e) => handleChange(e)} 
                                value={newPassword} 
                            />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' 
                                id="firstName" 
                                label="Nombre" 
                                name="firstName" 
                                helperText={errors.firstName}
                                onChange={(e) => handleChange(e)} 
                                value={player.firstName}
                            />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' 
                                id="secondName" 
                                label="Apellidos" 
                                name="secondName" 
                                helperText={errors.secondName}
                                onChange={(e) => handleChange(e)} 
                                value={player.secondName}
                            />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' 
                                id="phoneNumber" 
                                label="Número de teléfono" 
                                name="phoneNumber" 
                                helperText={errors.phoneNumber}
                                onChange={(e) => handleChange(e)} 
                                value={player.phoneNumber}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3} style={{margin: '25px auto 10px', width:'16%'}} >
                            <MuiPickersUtilsProvider style={{marginLeft: '30px'}} utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        id={"date"}
                                        label={"Fecha de Nacimiento"}
                                        format="yyyy/MM/dd"
                                        value={player.fechaNacimiento}
                                        error={dateError !== ''}
                                        helperText={errors.fechaNacimiento}
                                        onChange={handleDateChange}
                                        focused/>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid xs={12} container justify="center" alignItems="center" >
                            <FormControl style={{marginTop:'25px',width:'16%'}}>
                                <InputLabel id="demo-simple-select-label">Posición</InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={position}
                                  onChange={handleChangPosition}
                                >
                                  <MenuItem value="No definido">Seleccione una opción</MenuItem>
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
                        onClick={() => history.goBack()}
                        style={{ ...stylesComponent.buttonCrear }}>
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
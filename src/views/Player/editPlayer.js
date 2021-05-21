import React, { useState, useEffect } from 'react'
import PlayerService from "../../services/player.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'
import { useParams } from 'react-router-dom'

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

    useEffect(() => {
        if (!admin) {
            history.push('/pageNotFound/')
        } else {
            PlayerService.getPlayer(idTeam, usernamePlayer).then(
                res => {
                    if (res.status === 200) {
                        setPlayer(res.data)
                    } else {
                        history.push('/pageNotFound/')
                    }
                }
            )
        }
    }, [admin, history])

    const handleSubmit = (evt) => {
        evt.preventDefault()
        if (handleValidation()) {
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

    function handleValidation() {
        let objErrors = {};
        let valid = true;

        const patternDate = new RegExp('^(\\d{4})[\\/](0?[1-9]|1[012])[\\/](0?[1-9]|[12][0-9]|3[01])$');
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
        if(!player.fechaNacimiento || !player.fechaNacimiento.match(patternDate)) {
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
            if(player.password<5) {
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
                                label="Contraseña" 
                                name="password" 
                                helperText={errors.password}
                                onChange={(e) => handleChange(e)} 
                                value={player.password} 
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
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                            <TextField className='input-title' 
                                id="fechaNacimiento" 
                                label="Fecha de Nacimiento" 
                                name="fechaNacimiento" 
                                helperText={errors.fechaNacimiento}
                                onChange={(e) => handleChange(e)} 
                                value={player.fechaNacimiento}
                            />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{marginTop: '20px' }}>
                            <p style={{color:'#8D8D8D', marginBottom: '0px'}}>Posición</p>
                            <select style={{width: '192px'}} className='input-title' id="posicion" label="Posición" name="posicion" onChange={(e) => handleChange(e)}>
                                <option selected value="No definido">--</option>
                                <option value="Delantero">Delantero</option>
                                <option value="Centrocampista">Centrocampista</option>
                                <option value="Defensa">Defensa</option>
                                <option value="Portero">Portero</option>
                            </select>
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
                        onClick={() => history.goBack()}
                        style={{ marginLeft: 5 }}>
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
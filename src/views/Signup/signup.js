import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";


import {useHistory} from 'react-router'

import useUser from '../../hooks/useUser'
import {Alert, AlertTitle} from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '10px'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {},
    eye: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const history = useHistory();
    const [formData, setFormData] = useState({})
    const [checkData, setCheckData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [passwordShown, setPasswordShown] = useState(false);
    const [now, setNow] = useState(new Date())
    const [dateOfBorn, setDateOfBorn] = useState(new Date(now.getTime() + 2 * 60000))
    const role = 'ROLE_COACH'
    const phonePatt = new RegExp("^[+]*[(]?[0-9]{1,4}[)]?[-s./0-9]*$")

    const {isLogged, signup, error} = useUser()

    useEffect(() => {
        if (isLogged) {
            history.push('/')
        }
    }, [isLogged, history])

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        setFormErrors({})
    }

    const handleCheckChange = (e) => {
        setCheckData({...checkData, [e.target.name]: e.target.checked})
        setFormErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (handleValidation()) {
            let username = formData.username
            let fechaNacimiento = formData.fechaNacimiento
            let password = formData.password
            let firstName = formData.firstName
            let secondName = formData.secondName
            let phoneNumber = formData.phoneNumber
            signup({username, fechaNacimiento, role, password, firstName, secondName, phoneNumber})
        }
    }

    function handleValidation() {
        let valid = true
        let objErrors = {}
        if (!formData.username || formData.username.length < 3 || formData.username.length > 20) {
            valid = false
            objErrors["username"] = "El nombre de usuario debe tener más de 3 caracteres y menos de 20"
        }
        // if (!formData.fechaNacimiento || !emailPatt.test(formData.email) || formData.email.length > 50) {
        //     valid = false
        //     objErrors["email"] = "Se debe introducir un correo electrónico válido y no mayor de 50 caracteres"
        // }
        if (!formData.password || formData.password.length < 6 || formData.password.length > 40) {
            valid = false
            objErrors["password"] = "La contraseña debe tener más de 6 caracteres y menos de 40"
        }
        if (!formData.firstName) {
            valid = false
            objErrors["firstName"] = "El nombre no puede estar vacío"
        }
        if (!formData.secondName) {
            valid = false
            objErrors["secondName"] = "El apellido no puede estar vacío"
        }
        if (!formData.phoneNumber || !phonePatt.test(formData.phoneNumber)) {
            valid = false
            objErrors["phoneNumber"] = "Se debe introducir un número de teléfono válido"
        }
        setFormErrors(objErrors)
        return valid
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Registrarse
                    </Typography>
                    {error && (
                        <Alert severity="error" style={{width: '100%', marginTop: 30}}>
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    )}
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth required autoFocus
                                           id={"username"}
                                           name={"username"}
                                           label={"Nombre de usuario"}
                                           autoComplete={"username"}
                                           variant={"outlined"}
                                           error={formErrors.username !== null && formErrors.username !== undefined && formErrors.username !== ''}
                                           helperText={formErrors.username}
                                           onChange={(e) => handleChange(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth
                                           id="firstName"
                                           name="firstName"
                                           label="Nombre"
                                           autoComplete="fname"
                                           variant="outlined"
                                           error={formErrors.firstName !== null && formErrors.firstName !== undefined && formErrors.firstName !== ''}
                                           helperText={formErrors.firstName}
                                           onChange={(e) => handleChange(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth
                                           id="secondName"
                                           name="secondName"
                                           label="Apellido"
                                           variant="outlined"
                                           autoComplete="lname"
                                           error={formErrors.lastName !== null && formErrors.lastName !== undefined && formErrors.lastName !== ''}
                                           helperText={formErrors.lastName}
                                           onChange={(e) => handleChange(e)}
                                />
                            </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth
                                        id="fechaNacimiento"
                                        name="fechaNacimiento"
                                        label="Fecha Nacimiento"
                                        variant="outlined"
                                        autoComplete="lname"
                                        error={formErrors.fechaNacimiento !== null && formErrors.fechaNacimiento !== undefined && formErrors.fechaNacimiento !== ''}
                                        helperText={formErrors.fechaNacimiento}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth
                                           id="phoneNumber"
                                           name="phoneNumber"
                                           label="Teléfono"
                                           variant="outlined"
                                           autoComplete="phone"
                                           error={formErrors.phoneNumber !== null && formErrors.phoneNumber !== undefined && formErrors.phoneNumber !== ''}
                                           helperText={formErrors.phoneNumber}
                                           onChange={(e) => handleChange(e)}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField required fullWidth
                                           id="password"
                                           name="password"
                                           label="Contraseña"
                                           variant="outlined"
                                           type={passwordShown ? "text" : "password"}
                                           autoComplete="current-password"
                                           error={formErrors.password !== null && formErrors.password !== undefined && formErrors.password !== ''}
                                           helperText={formErrors.password}
                                           onChange={(e) => handleChange(e)}
                                />
                            </Grid>
                            <Grid item xs={"auto"} className={classes.eye}>
                                <i onClick={togglePasswordVisiblity}>{passwordShown ? <VisibilityIcon/> :
                                    <VisibilityOffIcon/>}</i>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Registrarse
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="#/login" variant="body2">
                                    Inicia sesión
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        </div>
    );
}
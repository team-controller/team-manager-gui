import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'
import moment from 'moment';
import MatchesService from '../../services/matches.service'
import DateFnsUtils from '@date-io/date-fns'
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

export default function CreateMatch() {
    const classes = useStyles();
    const [state, setState] = useState({})
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const { auth } = useUser()
    const admin = auth.role === "ROLE_COACH";
    const [startTime, setStartTime] = useState(new Date())
    const [callTime, setCallTime] = useState(new Date())
    const [date, setDate] = useState(new Date())
    const [startTimeError, setStartTimeError] = useState('')
    const [callTimeError, setCallTimeError] = useState('')
    const [dateError, setDateError] = useState('')
    const [errors, setErrors] = useState([]);
    
    const player = "ROLE_PLAYER";
    useEffect(() => {
        if (!admin) history.push('/')
    }, [admin, history])


    function validateFormulario(){
        let errors = []
        if(state.callPlace === "" || state.callPlace === undefined) {
            let err = "Lugar de convocatoria vacío"
            errors.push(err)
        }
        if(state.matchPlace === "" ||state.matchPlace === undefined){
            let err = "Lugar del partido vacío"
            errors.push(err);
        }
        if(state.visitorTeam === "" ||state.visitorTeam === undefined){
            let err = "Equipo rival vacío"
            errors.push(err);
        }
        if(date === null ){
            let err = "Fecha vacía"
            errors.push(err);
        }
        if(startTime === null){
            let err = "Hora de comienzo vacía"
            errors.push(err);
        }
        if(callTime === null){
            let err = "Hora de convocatoria vacía"
            errors.push(err);
        }
        if(moment(moment().subtract(1,"days")).isAfter(date)){
            let err = "La fecha del partido es anterior a la fecha actual"
            errors.push(err);
        }
        if(moment(callTime).isAfter(moment(startTime))){
            let err = "La hora de convocatoria debe ser anterior a la hora del partido";
            errors.push(err);
        }
        return errors;
    }


    const handleSubmit = (evt) => {
        evt.preventDefault();
        let errorsValidation = validateFormulario();
        setErrors(errorsValidation);
        if(errorsValidation.length !== 0){
            setOpenSubmitIncorrect(true)
        }else{
            const object = {
                "date": moment(date).format("YYYY/MM/DD"),
                "startTime": moment(startTime).format("HH:mm:ss"),
                "callTime": moment(callTime).format("HH:mm:ss"),
                "callPlace": state.callPlace,
                "matchPlace": state.matchPlace,
                "visitorTeam": state.visitorTeam
            }
            MatchesService.createMatch(object).then(response => {
                if (response.status === 200) {
                    history.push({ pathname: `/matches` , state: { data: true } });
                } else {
                    setOpenSubmitIncorrect(true)
                }
            }).catch(error => {
                setOpenSubmitIncorrect(true)
                console.log("Error" + error)
            })
        }
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    }
    const handleStartTimeChange = (time) => {
        setStartTime(time)
        if (time === undefined || isNaN(time) || time === null) {
            setStartTimeError("La hora no es válida")
        } else {
            setStartTimeError("")
        }
    }
    const handleCallTimeChange = (time) => {
        setCallTime(time)
        if (time === undefined || isNaN(time) || time === null) {
            setCallTimeError("La hora no es válida")
        } else {
            setCallTimeError("")
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

    return (

        <Container fixed>
            <div style={{ marginTop: '90px', marginBottom: '100px' }}>
                <Typography align="center" className='h5' variant="h5" gutterBottom>
                    Crea un nuevo Partido
            </Typography>
                <div style={{ margin:'0px 0px 0px 20px' }}>
                    <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                        <Grid container justify="center" alignItems="center" >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardDatePicker
                                        id={"date"}
                                        label={"Fecha del partido"}
                                        format="yyyy/MM/dd"
                                        value={date}
                                        error={dateError !== ''}
                                        helperText={dateError}
                                        onChange={handleDateChange}/>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardTimePicker
                                        id={"callTime"}
                                        label={"Hora de convocatoria"}
                                        ampm={false}
                                        value={callTime}
                                        error={callTimeError !== ''}
                                        helperText={callTimeError}
                                        onChange={handleCallTimeChange}/>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardTimePicker
                                        id={"startTime"}
                                        label={"Hora de comienzo"}
                                        ampm={false}
                                        value={startTime}
                                        error={startTimeError !== ''}
                                        helperText={startTimeError}
                                        onChange={handleStartTimeChange}/>
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="matchPlace" label="Lugar del partido" name="matchPlace" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="callPlace" label="Lugar de convocatoria" name="callPlace" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="visitorTeam" label="Equipo rival" name="visitorTeam" onChange={(e) => handleChange(e)} />
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
                                    Tienes los siguentes errores en el formulario {errors.map(err => (
                                        <p>{err}</p>
                                    ))}
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
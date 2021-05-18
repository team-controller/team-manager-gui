import React, { useState, useEffect } from 'react'
import PlayerService from "../../services/player.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'
import { useParams } from 'react-router-dom'
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
    const [endTime, setEndTime] = useState(new Date())
    const [callTime, setCallTime] = useState(new Date())
    const [date, setDate] = useState(new Date())
    const [startTimeError, setStartTimeError] = useState('')
    const [endTimeError, setEndTimeError] = useState('')
    const [callTimeError, setCallTimeError] = useState('')
    const [dateError, setDateError] = useState('')
    
    const player = "ROLE_PLAYER";
    useEffect(() => {
        if (!admin) history.push('/')
    }, [admin, history])

    const handleSubmit = (evt) => {
    evt.preventDefault();
        const object = {
            "date": formatTime(date),
            "startTime": formatTime(startTime),
            "endTime": formatTime(endTime), 
            "callTime": formatTime(callTime),
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
            console.log("Error" + error)
        })
    }

    function formatTime(time) {
        let result = null
        if (time !== null) {
            let d = new Date(time.getTime() + 60000 * time.getTimezoneOffset())
            let hour = d.getHours()
            let minute = d.getMinutes()

            if (hour.toString().length < 2) {
                hour = '0' + hour;
            }
            if (minute.toString().length < 2) {
                minute = '0' + minute;
            }
            var dateOfMatch = moment(date).format("YYYY-MM-DD");
            result = dateOfMatch+"T" + [hour, minute, '00'].join(':') + ".000+00:00"
            return result
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
    const handleEndTimeChange = (time) => {
        setEndTime(time)
        if (time === undefined || isNaN(time) || time === null) {
            setEndTimeError("La hora no es válida")
        } else {
            setEndTimeError("")
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
            setDateError("La hora no es válida")
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
                    Registra tu jugador
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
                                        id={"startTime"}
                                        label={"Hora de comienzo"}
                                        ampm={false}
                                        value={startTime}
                                        error={startTimeError !== ''}
                                        helperText={startTimeError}
                                        onChange={handleStartTimeChange}/>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardTimePicker
                                        id={"endTime"}
                                        label={"Hora del final"}
                                        ampm={false}
                                        value={endTime}
                                        error={endTimeError !== ''}
                                        helperText={endTimeError}
                                        onChange={handleEndTimeChange}/>
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
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="matchPlace" label="Lugar del Partido" name="matchPlace" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="visitorTeam" label="Lugar de convocatoria" name="callPlace" onChange={(e) => handleChange(e)} />
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <TextField className='input-title' id="visitorTeam" label="Equipo Visitante" name="visitorTeam" onChange={(e) => handleChange(e)} />
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
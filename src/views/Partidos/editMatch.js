import React, { useState, useEffect } from 'react';
import MatchesService from "../../services/matches.service";
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Button, Snackbar, Container, Grid, Typography,InputLabel,Select, MenuItem, TextField, FormControl, Input } from '@material-ui/core';
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));

export default function UpdateMatch(){
    const classes = useStyles();
    const history = useHistory()
    const [match, setMatch] = useState({});
    const {isLogged,auth} = useUser();
    const {id} = useParams();
    const [startTimeError, setStartTimeError] = useState('')
    const [endTimeError, setEndTimeError] = useState('')
    const [callTimeError, setCallTimeError] = useState('')
    const [dateError, setDateError] = useState('')
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    useEffect(() => {
        if(!auth){
            history.push("/signup")
        }
    },[history, auth])

    useEffect(() => {
        MatchesService.getOneMatch(id).then(res => {
           // res.data.date = formatDate(res.data.date);
            res.data.startTime = formatStringToDate(res.data.date,res.data.startTime);
            res.data.callTime = formatStringToDate(res.data.date, res.data.callTime);
            setMatch(res.data)
        })
    },[id])
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false)
    };
    const handleChange = (event) => {
        const name = event.target.name;
        setMatch({
            ...match,
            [name]: event.target.value,
        });
    };
    const handleStartTimeChange = (event) => {
        const name = event.target.name

        // if (time === undefined || isNaN(time) || time === null) {
        //     setStartTimeError("La hora no es válida")
        // } else {
        //     setStartTimeError("")
        // }
    }
    const handleEndTimeChange = (time) => {
        // setEndTime(time)
        // if (time === undefined || isNaN(time) || time === null) {
        //     setEndTimeError("La hora no es válida")
        // } else {
        //     setEndTimeError("")
        // }
    }
    const handleCallTimeChange = (time) => {
        // setCallTime(time)
        // if (time === undefined || isNaN(time) || time === null) {
        //     setCallTimeError("La hora no es válida")
        // } else {
        //     setCallTimeError("")
        // }
    }
    const handleDateChange = (time) => {
        // setDate(time)
        // if (time === undefined || isNaN(time) || time === null) {
        //     setDateError("La hora no es válida")
        // } else {
        //     setDateError("")
        // }
    }
    function formatStringToDate(fecha, horas) {
        if (!fecha && !horas) {
            return null
        } else {
            const newFecha = moment(fecha).format("YYYY-MM-DD")
            const newDate = newFecha+"T"+horas
            // var dateRes = moment(newDate).format("YYYY/MM/DD ")
            return newDate
        }
    }

    function formatDate(date){
        if(!date){
            return null
        }else{
            const newDate = moment(date).format("YYYY-MM-DD")
            const dateRes = newDate + "T00:00:00"
            return dateRes 
        }
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        //AQUI HACER VALIDACIONES 
        const object = {
            "date": formatTime(match.date),
            "startTime": formatTime(match.startTime),
            "callTime": formatTime(match.callTime),
            "callPlace": match.callPlace,
            "matchPlace": match.matchPlace,
            "visitorTeam": match.visitorTeam,
            "status" : match.status,
            "localTeam": match.localTeam
        }
        MatchesService.UpdateTeam(object,id).then(res => {
            if(res.status === "201"){
                history.push({ pathname: `/matches` , state: { data: true } });
            }
        }).catch((e) => {
            //Aqui poner el mensaje de error
            console.log(e);
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
            var dateOfMatch = moment(match.date).format("YYYY-MM-DD");
            result = dateOfMatch+"T" + [hour, minute, '00'].join(':') + ".000+00:00"
            return result
        }
    }
    return (    
        <Container fixed>
            <div style={{ marginTop: '90px', marginBottom: '100px' }}>
                <Typography align="center" className='h5' variant="h5" gutterBottom>
                    Edita el Partido
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
                                        value={match.date}
                                        error={dateError !== ''}
                                        helperText={dateError}
                                        onChange={(e) => handleDateChange(e)}/>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardTimePicker
                                        id={"startTime"}
                                        label={"Hora de comienzo"}
                                        ampm={false}
                                        value={match.startTime}
                                        error={startTimeError !== ''}
                                        helperText={startTimeError}
                                        onChange={(e) =>handleStartTimeChange(e)}/>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardTimePicker
                                        id={"callTime"}
                                        label={"Hora de convocatoria"}
                                        ampm={false}
                                        value={match.callTime}
                                        error={callTimeError !== ''}
                                        helperText={callTimeError}
                                        onChange={(e) => handleCallTimeChange(e)}/>
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'15px'}} focused>
                                    <InputLabel htmlFor="matchPlace">Lugar Convocatoria</InputLabel>
                                    <Input className='input-title' type="text" id="matchPlace" label="Lugar del Partido" name="matchPlace" onChange={(e) => handleChange(e)} value={match.matchPlace} />
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'15px'}} focused>
                                    <InputLabel htmlFor="callPlace">Lugar Convocatoria</InputLabel>
                                    <Input className='input-title' type="text" id="callPlace" label="Lugar de convocatoria" name="callPlace" onChange={(e) => handleChange(e)} value={match.callPlace} />
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'15px'}} focused>
                                    <InputLabel htmlFor="visitorTeam">Equipo Visitante</InputLabel>
                                    <Input className='input-title' type="text" id="visitorTeam" label="Equipo Visitante" name="visitorTeam" onChange={(e) => handleChange(e)} value={match.visitorTeam} />
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'15px'}} focused>
                                    <InputLabel htmlFor="localTeam">Equipo Local</InputLabel>
                                    <Input className='input-title' type="text" id="localTeam" label="Equipo Local" name="localTeam" onChange={(e) => handleChange(e)} value={match.localTeam} disabled />
                                </FormControl>
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

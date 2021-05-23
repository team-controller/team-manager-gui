import React, { useState, useEffect } from 'react';
import MatchesService from "../../services/matches.service";
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Button, Snackbar, Container, Grid, Typography,InputLabel,Select, MenuItem, FormControl, Input } from '@material-ui/core';
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function UpdateMatch(props){
    const classes = useStyles();
    const history = useHistory()
    const [match, setMatch] = useState({});
    const {auth} = useUser();
    const {id} = useParams();
    const [startTimeError] = useState('')
    const [callTimeError] = useState('')
    const [dateError] = useState('')
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const [ableToSetGoals, setAbleToSetGoals] = useState(false);
    const [ableToSetGoalsMessage, setAbleToSetGoalsMessage] = useState(false);
    const [disabledDate, setDisabledDate] = useState(false);
    const [status, setStatus] = useState("");
    const [dateMatch, setDateMatch] = useState("");
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        if(!auth){
            history.push("/signup")
        }
    },[history, auth])

    useEffect(() => {
        MatchesService.getOneMatch(id).then(res => {
            res.data.startTime = formatStringToDate(res.data.date,res.data.startTime);
            res.data.callTime = formatStringToDate(res.data.date, res.data.callTime);
            setStatus(res.data.status);
            setDateMatch(res.data.date);
            if(moment(moment()).isAfter(res.data.date)){
                setDisabledDate(true)
            }
            if(moment(res.data.date).isBefore(moment().subtract(1,"days"))){
                setAbleToSetGoals(true);
                
            }else{
                setAbleToSetGoalsMessage(true);
            }
            setMatch(res.data)
        })
    },[id,dateMatch])
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false)
        setAbleToSetGoals(false);
        setAbleToSetGoalsMessage(false)
        setErrors([])
    };
    const handleChange = (event) => {
        const name = event.target.name;
        setMatch({
            ...match,
            [name]: event.target.value,
        });

    };
    const handleChangeStatus = (event) => {
        setMatch({
            ...match,
            status: event.target.value,
        });
        setStatus(event.target.value)
    };
    
    const handleStartTimeChange = (event) => {
        setMatch({
            ...match,
            startTime: event,
        });
    }

    const handleCallTimeChange = (event) => {
        setMatch({
            ...match,
            callTime: event,
        });
    }
    const handleDateChange = (event) => {
        if(moment(moment()).isAfter(event)){
            let err = "Si el partido ya ha pasado no puedes cambiar la fecha más al pasado"
            errors.push(err);
            setErrors(errors)
            setOpenSubmitIncorrect(true);
        }else{
            setMatch({
                ...match,
                date: event,
            });
        }
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
    function validateFormulario(){
        let errors = []
        if(match.callPlace === "") {
            let err = "Lugar de convocatoria vacío"
            errors.push(err)
        }
        if(match.matchPlace === ""){
            let err = "Lugar del partido vacío"
            errors.push(err);
        }
        if(match.visitorTeam === ""){
            let err = "Equipo rival vacío"
            errors.push(err);
        }
        if(match.status === ""){
            let err = "Estado de partido incorrecto"
            errors.push(err);
        }
        if(match.date === null ){
            let err = "Fecha vacía"
            errors.push(err);
        }
        if(match.startTime === null){
            let err = "Hora de comienzo vacía"
            errors.push(err);
        }
        if(match.callTime === null){
            let err = "Hora de convocatoria vacía"
            errors.push(err);
        }
        
        if(moment(match.callTime).isAfter(moment(match.startTime))){
            let err = "La hora de convocatoria debe ser anterior a la hora del partido";
            errors.push(err);
        }
        return errors;
    }
    function getStatusByGoals(goalsLocal, goalsVisitante){
        let status = "PENDIENTE";
        if(parseInt(goalsLocal) > parseInt(goalsVisitante)){
            status = "GANADO"
        }else if(parseInt(goalsLocal) === parseInt(goalsVisitante)) { 
            status = "EMPATADO"
        }else{ 
            status = "PERDIDO"
        }
        return status;
    }


    const handleSubmit = (evt) => {
        evt.preventDefault();
        //AQUI HACER VALIDACIONES 
        let errorsValidation = validateFormulario();
        setErrors(errorsValidation);
        if(errorsValidation.length !== 0){
            setOpenSubmitIncorrect(true)
        }else{
            const object = {
                "id":match.id,
                "date": moment(match.date).format("YYYY/MM/DD"),
                "startTime": moment(match.startTime).format("HH:mm:ss"),
                "callTime": moment(match.callTime).format("HH:mm:ss"),
                "callPlace": match.callPlace,
                "matchPlace": match.matchPlace,
                "visitorTeam": match.visitorTeam,
                "status" : getStatusByGoals(match.goalsLocal,match.goalsVisitor),
                "localTeam": match.localTeam,
                "goalsLocal": match.goalsLocal,
                "goalsVisitor": match.goalsVisitor
            }
            MatchesService.updateMatch(object,id).then(res => {
                    props.history.push(`/matches`);
            }).catch((e) => {
                //Aqui poner el mensaje de error
                console.log(e);
            })
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
                                {disabledDate ? (
                                <Grid style={{marginTop:'25px'}} item xs={12} sm={6} lg={3} align="center" >
                                    <KeyboardDatePicker
                                        id={"date"}
                                        label={"Fecha del partido"}
                                        format="yyyy/MM/dd"
                                        value={match.date}
                                        error={dateError !== ''}
                                        helperText={dateError}
                                        onChange={(e) => handleDateChange(e)}
                                        disabled/>
                                </Grid>
                                ):(
                                <Grid style={{marginTop:'25px'}} item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardDatePicker
                                        id={"date"}
                                        label={"Fecha del partido"}
                                        format="yyyy/MM/dd"
                                        value={match.date}
                                        error={dateError !== ''}
                                        helperText={dateError}
                                        onChange={(e) => handleDateChange(e)}/>
                                </Grid>
                                )
                                }
                                <Grid style={{marginTop:'25px'}} item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardTimePicker
                                        id={"callTime"}
                                        label={"Hora de convocatoria"}
                                        ampm={false}
                                        value={match.callTime}
                                        error={callTimeError !== ''}
                                        helperText={callTimeError}
                                        onChange={(e) => handleCallTimeChange(e)}/>
                                </Grid>
                                <Grid style={{marginTop:'25px'}} item xs={12} sm={6} lg={3} align="center">
                                    <KeyboardTimePicker
                                        id={"startTime"}
                                        label={"Hora de comienzo"}
                                        ampm={false}
                                        value={match.startTime}
                                        error={startTimeError !== ''}
                                        helperText={startTimeError}
                                        onChange={(e) =>handleStartTimeChange(e)}/>
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'25px'}} focused>
                                    <InputLabel htmlFor="matchPlace">Lugar del Partido</InputLabel>
                                    <Input className='input-title' type="text" id="matchPlace" label="Lugar del partido" name="matchPlace" onChange={(e) => handleChange(e)} value={match.matchPlace} />
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'25px'}} focused>
                                    <InputLabel htmlFor="callPlace">Lugar Convocatoria</InputLabel>
                                    <Input className='input-title' type="text" id="callPlace" label="Lugar de convocatoria" name="callPlace" onChange={(e) => handleChange(e)} value={match.callPlace} />
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'25px'}} focused>
                                    <InputLabel htmlFor="visitorTeam">Equipo Rival</InputLabel>
                                    <Input className='input-title' type="text" id="visitorTeam" label="Equipo Rival" name="visitorTeam" onChange={(e) => handleChange(e)} value={match.visitorTeam} />
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{marginTop:'25px'}} focused>
                                    <InputLabel htmlFor="localTeam">Tu equipo</InputLabel>
                                    <Input className='input-title' type="text" id="localTeam" label="Tu equipo" name="localTeam" onChange={(e) => handleChange(e)} value={match.localTeam} disabled />
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <div>
                                <FormControl style={{margin:'25px 35px 0px 0px'}} focused>
                                    <InputLabel htmlFor="goalsLocal">Goles tu Equipo</InputLabel>
                                    {ableToSetGoals ? (
                                        <Input className='input-title' type="number" inputProps={{ min: "0", max: "10"}} id="goalsLocal" label="Goles tu Equipo" name="goalsLocal" onChange={(e) => handleChange(e)} value={match.goalsLocal} />
                                    ):(
                                        <Input disabled className='input-title' type="number" inputProps={{ min: "0", max: "10"}} id="goalsLocal" label="Goles tu Equipo" name="goalsLocal" onChange={(e) => handleChange(e)} value={match.goalsLocal} />
                                    )}
                                    
                                </FormControl>
                            </div>
                            <div>
                                <FormControl style={{margin:'25px 0px 0px 20px'}} focused>
                                    <InputLabel htmlFor="goalsVisitor">Goles del Rival</InputLabel>
                                    {ableToSetGoals ? (
                                        <Input className='input-title' type="number" inputProps={{ min: "0", max: "10", size:"40"}} id="goalsVisitor" label="Goles del Rival" name="goalsVisitor" onChange={(e) => handleChange(e)} value={match.goalsVisitor} />
                                    ) : (
                                        <Input disabled className='input-title' type="number" inputProps={{ min: "0", max: "10", size:"40"}} id="goalsVisitor" label="Goles del Rival" name="goalsVisitor" onChange={(e) => handleChange(e)} value={match.goalsVisitor} />
                                    )
                                    }
                                </FormControl>
                            </div>
                        </Grid>
                        <Grid container justify="center" alignItems="center" >
                            <FormControl style={{marginTop:'25px'}} justify="center" alignItems="center" disabled  className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={status}
                                  onChange={handleChangeStatus}
                                >
                                  <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                                  <MenuItem value="GANADO">Ganado</MenuItem>
                                  <MenuItem value="EMPATADO">Empatado</MenuItem>
                                  <MenuItem value="PERDIDO">Perdido</MenuItem>
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
                        <div className={stylesComponent.snak}>
                            <Snackbar open={openSubmitIncorrect} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="error">
                                    Tienes los siguentes errores en el formulario {errors.map(err => (
                                        <p>{err}</p>
                                    ))}
                            </Alert>
                            </Snackbar>
                            <Snackbar open={ableToSetGoalsMessage} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="info">
                                    No podras introducir un resultado hasta que no pase la fecha del partido
                            </Alert>
                            </Snackbar>
                        </div>
                    </form>
                </div>
            </div>
        </Container>

    )
          


}

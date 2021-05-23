import React, { useState, useEffect } from 'react'
import TeamService from "../../services/team.service"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'

const useStyle = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
}));
export default function UpdateTeam(props) {
    const[team, setTeam] = useState({
        name: '',
        city: '',
        stadiumName: ''
    });
    const classes = useStyle()
    const history = useHistory()
    const { auth } = useUser()
    const admin = auth.role === "ROLE_COACH"
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const [errors, setErrors] = useState({})
    useEffect(() => {
        if (!admin) {
            history.push('/pageNotFound/')
        } else {
            TeamService.getTeam().then(
                res => {
                    if (res.status === 200) {
                        setTeam(res.data[0])
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
                "name": team.name, "city": team.city, "stadiumName": team.stadiumName
            }
            TeamService.updateTeam(object).then(response => {
                if(response.status === 201) {
                    props.history.push({pathname: `/team/`, object: {data:true}})
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

        if(!team.name) {
            valid = false;
            objErrors['name'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!team.city) {
            valid = false;
            objErrors['city'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!team.stadiumName) {
            valid = false;
            objErrors['stadiumName'] = 'Tienes que rellenar este campo con un valor válido'
        }
        setErrors(objErrors);
        return valid;
    }

    const handleChange = (event) => {
        setTeam({...team, [event.target.name]: event.target.value})
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
                        <div>
                            <TextField className='input-title' 
                            id="name" 
                            label="Nombre" 
                            name="name" 
                            helperText={errors.name}
                            onChange={(e) => handleChange(e)} 
                            value={team.name} />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                        <TextField className='input-title' 
                        id="city" 
                        label="Ciudad" 
                        name="city" 
                        helperText={errors.city}
                        onChange={(e) => handleChange(e)} 
                        value={team.city} />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="center" >
                        <div style={{ marginTop: '20px' }}>
                        <TextField className='input-title' 
                        id="stadiumName" 
                        label="Nombre Estadio" 
                        name="stadiumName" 
                        helperText={errors.stadiumName}
                        onChange={(e) => handleChange(e)} 
                        value={team.stadiumName}/>
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
                        style={{...stylesComponent.buttonCrear}}>
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
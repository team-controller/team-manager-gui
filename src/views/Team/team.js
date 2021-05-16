import React, {useEffect, useState} from "react"
import {useHistory} from 'react-router'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TeamService from "../../services/team.service"


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: '16%',
    },
    block: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: 'auto',
    },
    bottomDivider: {
        borderBottom: '0.1em solid darkgray',
        lineHeight: '90%',
    },
    topBottomDivider: {
        borderTop: '0.1em solid darkgray',
        borderBottom: '0.1em solid darkgray',
        lineHeight: '85%',
    },
    barHeader: {
        padding: theme.spacing(1),
        textAlign: 'center',
        margin: 'auto',
        marginBottom: '10px',
    },
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex',
    },
    buttons: {
        alignItems: 'stretch',
    },
    overflowHidden: {
        overflow: 'hidden',
    },
    hrColor: {
        borderTop: '1px solid darkgray',
    },
    snak: {
        marginBottom: '20px',
    },
    colorBar: {
        backgroundColor: 'white',
    },
}));

const logo = require('../../img/LogoTeamManager.png')

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

export default function Team(props) {
    const history = useHistory();
    const classes = useStyles();
    const [team,setTeam] = useState({});

    useEffect(() => {
        TeamService.getTeam().then(teamRes => { 
            setTeam(teamRes.data[0]);
        });
    }, [history, team])


    const deleteTeam = () => {
        TeamService.deleteTeam().then((response) => {
            if(response.status=== 200) {
                history.push({ pathname: '/createTeam/' , state: { data: true } });
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }


    return (
        <div>
            <div  key={team.id} style={{marginTop: "90px"}}>
                {team.name}
                {team.stadiumName}
                {team.city}
            </div>
            <div>
                <Button type="submit"
                    variant="contained"
                    color="primary"
                    style={{ ...stylesComponent.buttonCrear }} onClick={() => history.push("/team/edit")}> Editar </Button> 
                <Button type="submit"
                    variant="contained"
                    color="primary"
                    style={{ ...stylesComponent.buttonCrear }}
                    onClick={()=> deleteTeam()}> Borrar </Button> 

                <Button type="submit"
                    variant="contained"
                    color="primary"
                    style={{ ...stylesComponent.buttonCrear }}
                    onClick={() => history.push("/team/"+ team.id + "/players")}> Ver jugadores </Button> 
            </div>
        </div>
        )

}

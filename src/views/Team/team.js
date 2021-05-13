import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import {green, red} from '@material-ui/core/colors';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import {ChevronLeft, ChevronRight} from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';
import useUser from '../../hooks/useUser';
import EditIcon from '@material-ui/icons/Edit';
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    Snackbar,
    CssBaseline,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import TeamService from "../../services/team.service";
import Alert from '@material-ui/lab/Alert';
import BottomBar from '../../components/bottom-bar';
import Container from "@material-ui/core/Container";

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


export default function Team(props) {
    const history = useHistory();
    const classes = useStyles();
    const [team,setTeam] = useState({});

    useEffect(() => {
        TeamService.getTeamByCoachId().then(teamRes => { 
            setTeam(JSON.parse(teamRes.data));
        });
    }, [history, team])

    return (
        <div style={{marginTop: "90px"}}>
            {team.name}
            {team.stadiumName}
            {team.city}
        </div>
    )

}

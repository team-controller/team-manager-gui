import http from "../http-common";
import authHeader from "./auth-header";

class PlayerService {

    getAllPlayers(idTeam) {
        return http.get(`/team/${idTeam}/players`, {headers: authHeader()})
    }

    createPlayer(idTeam, object, position) {
        if(position === undefined || position === "") {
            position = "No definido"
        }
        return http.post(`/team/${idTeam}/player/${position}/create`, object, {headers: authHeader()})
    }

    getPlayer(idTeam, usernamePlayer) {
        return http.get(`/team/${idTeam}/player/${usernamePlayer}`, {headers: authHeader()})
    }

    editPlayer(idTeam, usernamePlayer, object, position) {
        if(position === undefined || position === "") {
            position = "No definido"
        }
        return http.put(`/team/${idTeam}/player/${usernamePlayer}/edit/${position}`, object, {headers: authHeader()})
    }

    addInfoPlayer(idTeam, usernamePlayer, object) {
        return http.put(`/team/${idTeam}/player/${usernamePlayer}/editMatch`, object, {headers: authHeader()})
    }

    deletePlayer(idTeam, usernamePlayer) {
        return http.delete(`/team/${idTeam}/player/${usernamePlayer}/delete`, {headers: authHeader()})
    }

    convocatePlayer(idMatch, usernamePlayer) {
        return http.get(`/team/match/${idMatch}/player/${usernamePlayer}/convocar`, {headers: authHeader()})
    }

    desConvocatePlayer(idMatch, usernamePlayer) {
        return http.get(`/team/match/${idMatch}/player/${usernamePlayer}/desconvocar`,{headers: authHeader()})
    }
    
}
export default new PlayerService();
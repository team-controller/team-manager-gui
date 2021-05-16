import http from "../http-common";
import authHeader from "./auth-header";

class PlayerService {

    getAllPlayers(idTeam) {
        return http.get(`/team/${idTeam}/players`, {headers: authHeader()})
    }

    createPlayer(idTeam, object) {
        return http.post(`/team/${idTeam}/player/create`, object, {headers: authHeader()})
    }

    editPlayer(idTeam, usernamePlayer, object) {
        return http.put(`/team/${idTeam}/player/${usernamePlayer}/edit`, object, {headers: authHeader()})
    }

    editPlayer(idTeam, usernamePlayer, object) {
        return http.delete(`/team/${idTeam}/player/${usernamePlayer}/delete`, object, {headers: authHeader()})
    }
    
}
export default new PlayerService();
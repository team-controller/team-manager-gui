
import http from "../http-common";
import authHeader from "./auth-header";

class MatchesService {
    
    getOneMatch(matchId) {
        return http.get(`/oneMatch/${matchId}`, {headers: authHeader()})
    }

    getAllMatchesByCoach(){
        return http.get(`/matches/`, {headers:authHeader()})
    }

    getThreeNextMatchesByCoach(idTeam) {
        return http.get(`/matches/threeNext/${idTeam}`, {headers:authHeader()})
    }

    createMatch(object) {
        return http.post("/match/create/", object, {headers: authHeader()})
    }

    updateMatch(object) {
        return http.put("/match/edit/", object, {headers: authHeader()})
    }

    deleteMatch(idMatch) {
        return http.delete(`/match/delete/${idMatch}`, {headers: authHeader()})
    }

    getPlayersToConvocate(idMatch) {
        return http.get(`/match/convocate/${idMatch}`, {headers: authHeader()})
    }
    getPlayersConvocated(idMatch) {
        return http.get(`/match/players/convocated/${idMatch}`, {headers: authHeader()})
    }
    getAllPlayers(){
        return http.get(`/match/allPlayers/`, {headers: authHeader()})
    }

}

export default new MatchesService();
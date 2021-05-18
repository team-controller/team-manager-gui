
import http from "../http-common";
import authHeader from "./auth-header";

class MatchesService {
    
    getOneMatch(matchId) {
        return http.get(`/oneMatch/${matchId}`, {headers: authHeader()})
    }

    getAllMatchesByCoach(teamId){
        return http.get(`/matches/`, {headers:authHeader()})
    }

    createMatch(object) {
        return http.post("/match/create/", object, {headers: authHeader()})
    }

    updateMatch(object) {
        return http.put("/match/edit", object, {headers: authHeader()})
    }

    deleteMatch(idMatch) {
        return http.delete(`/match/delete/${idMatch}`, {headers: authHeader()})
    }

}

export default new MatchesService();
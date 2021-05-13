import http from "../http-common";
import authHeader from "./auth-header";

class TeamService {
    
    getTeamByCoachId() {
        return http.get("/team/", {headers: authHeader()})
    }

    createTeam(object) {
        return http.post("/createTeam", object, {headers: authHeader()})
    }

    updateTeam(object, teamId) {
        return http.put("/team/" + teamId, object, {headers: authHeader()})
    }
}

export default new TeamService();
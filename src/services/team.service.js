import http from "../http-common";
import authHeader from "./auth-header";

class TeamService {
    
    getTeam() {
        return http.get("/team/", {headers: authHeader()})
    }

    createTeam(object) {
        return http.post("/createTeam", object, {headers: authHeader()})
    }

    updateTeam(object) {
        return http.put("/team/edit", object, {headers: authHeader()})
    }

    deleteTeam() {
        return http.delete("/team/delete", {headers: authHeader()})
    }
    haveTeam(){
        return http.get("/haveTeam/", {headers: authHeader()})
    }

}

export default new TeamService();
import axios from "axios";

export default axios.create({
  baseURL: "https://8080-9b15a2a9-8e12-4e86-8e4f-0fdf50440277.cs-europe-west1-akef.cloudshell.dev/api/",
  headers: {
    "Content-type": "application/json"
  }
});
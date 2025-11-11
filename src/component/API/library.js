import axios from "axios";

export const createAccount = (accountRequest) =>
     axios.post('http://192.168.1.4:8080/v1/login/auth/create', accountRequest)

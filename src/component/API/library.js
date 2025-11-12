import axios from "axios";

const baseUrl = "http://192.168.1.4:8080"

export const createAccount = (accountRequest) =>
     axios.post(`${baseUrl}/v1/login/auth/create`, accountRequest)

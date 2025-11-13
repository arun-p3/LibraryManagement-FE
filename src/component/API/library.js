import axios from "axios";

const baseUrl = "http://localhost:8080"

export const createAccount = (accountRequest) =>
     axios.post(`${baseUrl}/v1/login/auth/create`, accountRequest)

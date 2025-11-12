import axios from "axios";


const baseUrl = "http://192.168.1.4:8080";

export const lendBooks = (bookRequest) => {
    const token = localStorage.getItem("token");

    axios.post(`${baseUrl}/v1/inventory/lend`, bookRequest, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

}
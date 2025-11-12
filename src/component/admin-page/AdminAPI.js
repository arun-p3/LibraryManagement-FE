import axios from "axios"

const BaseUrl = "http://192.168.1.4:8080"

export const updateUser = (accountRequest) => {
    const token = `Bearer ${localStorage.getItem("token")}`
    axios.put(`${BaseUrl}/v1/account-management/admin/update`, accountRequest, {
        headers: {
            "Authorization": token
        }
    })
}
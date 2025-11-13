import axios from "axios";

const BASE_URL = "http://localhost:8080/v1/catalog-management"; 
// or your IP if on same network: http://localhost:8080

export const findAllBooks = async (page, size) => {
  const token = localStorage.getItem("token"); 

  return axios.get(`${BASE_URL}/book/findAll`, {
    params: {
      page: page,
      size: size
    },
    headers: {
      Authorization: `Bearer ${token}` 
    },
  });
};
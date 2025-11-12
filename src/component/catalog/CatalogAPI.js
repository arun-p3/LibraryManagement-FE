import axios from "axios";


// const token = localStorage.getItem("token");
// console.log("rendering From Endpoint Section")
// console.log(token)

// export const findAllBooks = async (page, size) => 
//     axios.get(`http://192.168.1.4:8080/v1/catalog-management/book/findAll/${page}/${size}`, {
        
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });

const BASE_URL = "http://192.168.1.4:8080/v1/catalog-management"; 
// or your IP if on same network: http://192.168.1.4:8080

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
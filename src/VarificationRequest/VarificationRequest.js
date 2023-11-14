import { useEffect } from 'react';
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000' });


const VarificationRequest = () => {
    useEffect(() => {
        API.interceptors.request.use((req) => {
            if(localStorage.getItem("user")){
                req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
            }
            return req;
        });
    },[localStorage.getItem("user")])

    return VarificationRequest;
};

export default VarificationRequest;



// const JwtRequest = () => {
//     useEffect(() => {
//         const requestIntercept = API.interceptors.request.use(
//             req => {
//                 if(localStorage.getItem("user")){
//                     req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
//             }
//             return req;
//             },(error) => Promise.reject(error)

//         );
//         return () => {
//             API.interceptors.request.eject(requestIntercept);
//         }

//     },[localStorage.getItem('user')])

//     return JwtRequest;
// }

// export default JwtRequest;
import axios from 'axios';

const url ='http://localhost:5000/users';

export const storeData=(data)=>{
   return axios.post(url,data);
}
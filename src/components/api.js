import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost/api/login.php',
 
});

 

export default api;
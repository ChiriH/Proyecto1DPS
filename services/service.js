import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/tu_directorio/api.php',  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
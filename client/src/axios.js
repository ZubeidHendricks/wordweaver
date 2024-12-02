import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://wordweaver-git-main-zubeidhendricks.vercel.app/api'
    : 'http://localhost:5000/api'
});

export default instance;
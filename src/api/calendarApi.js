import axios from "axios";
import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables()

//ESta instancia de axios me va a servir para que cada
//Que haga una peticion no repetir codigo
const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

//PAra interceptar el request
calendarApi.interceptors.request.use(config => {

    //En los headers le agregamos el token para que cualquier peticion
    //que se ahce con calendarApi lo lleve
    config.headers = {
        //esparcir si ya habia otros headers
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }

    return config;
});

export default calendarApi;
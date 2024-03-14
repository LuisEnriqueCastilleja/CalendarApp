import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        try {
            //Para poner el status en onChecking mientas se prueba si son
            //correctas sus credenciales
            dispatch(onChecking());

            //recibe 2 parametros el segmento que le agregaremos
            //a nuestro baseUrl que ya definimos en calendarAPI
            //le agregamos el /auth y en el body mandamos
            //el email y password
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);


            //el getTime es la representacion con un entero de la fecha
            //actual con esta variable el localStorage podemos ahorrarnos
            //Llegar una peticion al backend si se que mi token es validao aun
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
            dispatch(onLogout("Credenciales incorrectas"));

            //Temporizador
            setTimeout(() => {
                //Para limpiar el error despues de 10ms
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const startRegister = async ({ name, email, password }) => {
        try {

            dispatch(onChecking());

            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
            const { response } = error;
            const { data } = response;
            dispatch(onLogout(data.msg));

            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const checkAuthToken = async () => {
        //Traemos el token del localStorage
        const token = localStorage.getItem('token');
        //SI no existe el token hacemos un logout
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
            //SI hay un error limpiamos el localStorage
            localStorage.clear();
            //Lo sacamos de la app 
            dispatch(onLogout());

        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
        dispatch(onLogoutCalendar());
    }

    return {
        status,
        user,
        errorMessage,
        startLogin,
        startRegister,
        startLogout,
        checkAuthToken,
    }
}

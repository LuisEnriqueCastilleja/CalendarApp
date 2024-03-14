import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage";
import { CalendarPage } from "../calendar";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();
    // const authStatus = 'not-authenticated';

    useEffect(() => {
        //Es donde checamos el token para saber que rutas mostrar
        //Si esta autenticado o no
        checkAuthToken();
    }, [])


    if (status === 'checking') {
        return (
            <h3>Cargando...</h3>
        )
    }




    return (
        <Routes>
            {
                (status === 'not-authenticated')
                    ? (<>
                        {/* Si no esta autenticado solo le dejamos ver el login */}
                        <Route path="/auth/*" element={<LoginPage />} />
                        <Route path="/*" element={<Navigate to="/auth/login" />} />
                    </>)
                    :
                    <>
                        {/* Si esta autenticado mostramos el CalendarPage y 
                        cualquier ruta lo redirigimos a CalendarPage */}
                        <Route path="/" element={<CalendarPage />} />
                        <Route path="/*" element={<Navigate to="/" />} />
                    </>
            }
            {/* Para evitar fallos dejamos esta para que haya 
            una por defecto  */}
            <Route path="/*" element={<Navigate to="/auth/login" />} />
        </Routes>
    );
}
